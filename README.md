# Mini Marketplace — A NestJS Microservices Learning Project

A small, production-style project to learn **NestJS, Prisma, PostgreSQL, RabbitMQ,
Docker, and microservices** before tackling a bigger system.

> This project is built in **6 phases**. Each phase adds one layer of the system.
> Read this file first — it is the map of everything we will build.

---

## 1. What are we building?

A tiny marketplace where:

- **Sellers** create products.
- **Buyers** place orders on products.
- Whenever an order is placed, **the Order Service shouts an event** through
  RabbitMQ, and the **Notification Service listens** and prints/records a notification.

The whole system is split into **4 independent programs** (microservices):

```
                        ┌─────────────────────┐
    Client (curl/browser)──HTTP─▶│    API Gateway    │  port 3000
                        └─────────────────────┘
                          │             │
                HTTP      │             │      HTTP
          (port 3001)     ▼             ▼     (port 3002)
                  ┌────────────┐   ┌────────────┐
                  │  Product   │   │   Order    │
                  │  Service   │   │  Service   │
                  └────────────┘   └────────────┘
                       │                │
                Prisma │          Prisma│        │  RabbitMQ
                       ▼                ▼        ▼   (publish event)
               ┌────────────┐   ┌────────────┐   ┌────────────┐
               │PostgreSQL  │   │PostgreSQL  │   │  RabbitMQ  │
               │(products DB)│  │(orders DB) │   │  broker    │
               └────────────┘   └────────────┘   └─────┬──────┘
                                                        │  RabbitMQ
                                                        ▼   (consume event)
                                                 ┌────────────┐
                                                 │Notification│
                                                 │  Service   │
                                                 └────────────┘
```

### Why 4 programs instead of 1 big one?

- **Each service owns its own job and its own data.** If the Notification Service
  crashes, orders still work. If the Order Service is busy, product browsing still
  works. They are **independently deployable and independently scalable**.
- You can update one service without redeploying the others.
- This is the reality of most real companies — but for learning, our goal is simply
  to *feel* the difference between code that runs in one process and code that
  talks to other processes over a network.

---

## 2. The two kinds of communication (THE most important concept)

### 2.1 Synchronous communication — "call and wait"

```
Client ──HTTP request──▶ Gateway ──HTTP request──▶ Order Service ──▶ PostgreSQL
Client ◀──HTTP response─ Gateway ◀──HTTP response─ Order Service ◀── returns rows
```

- The caller **sends a request and blocks until the answer comes back**.
- If the callee is down, the caller gets an error.
- Used when the caller **needs the result right now** (e.g. "give me this product").

In this project, synchronous calls are made over **HTTP**:
`Client → Gateway → Product/Order Service`.

### 2.2 Asynchronous communication — "fire and forget"

```
Order Service ──publish "order.created"──▶ RabbitMQ ──deliver──▶ Notification Service
```

- The sender **does not wait for a reply**. It publishes a *message* and moves on.
- The receiver processes the message **whenever it is ready** (maybe immediately,
  maybe later).
- If the receiver is down, the message **waits safely in the broker** — it is not
  lost, and it is not an error to the sender.
- Used when the caller **does not need an immediate result** (e.g. "someone should
  be notified about this order — but I don't need to wait for it").

In this project, the async link is **Order Service → RabbitMQ → Notification Service**.

### 2.3 Publisher vs Consumer (roles in async communication)

| Role | Who | What it does |
|---|---|---|
| **Publisher** | Order Service | Produces a message (`order.created`) and sends it to RabbitMQ |
| **Broker** | RabbitMQ | The middleman. Receives messages, stores them in a queue, delivers them |
| **Consumer** | Notification Service | Subscribes to the queue, receives messages, does the work |

Key insight: **the publisher and consumer never meet.** They only know the broker.

---

## 3. The 4 services and their responsibilities

| # | Service | Folder | Job | Talks to | Owns DB? |
|---|---|---|---|---|---|
| 1 | **API Gateway** | `gateway/` | The only door the outside world sees. Routes requests to the right service. Has **no business logic** | Product & Order (HTTP) | No |
| 2 | **Product Service** | `services/products/` | Sellers + Products CRUD | PostgreSQL via Prisma | Yes — `marketplace_products` |
| 3 | **Order Service** | `services/orders/` | Buyers + Orders; publishes events | PostgreSQL via Prisma + RabbitMQ (publisher) | Yes — `marketplace_orders` |
| 4 | **Notification Service** | `services/notifications/` | Consumes `order.created` events and records notifications | RabbitMQ (consumer) | No (logs / in-memory) |

### Why a gateway at all?

- The client only learns **one address** (`http://localhost:3000`).
- Each internal service is **hidden behind the gateway** (like a reception desk
  in a company — you don't walk directly to each employee's office).
- Later you could add authentication, rate limiting, or request logging in one place.

---

## 4. Ports and URLs map

| Thing | Port | URL |
|---|---|---|
| API Gateway | 3000 | http://localhost:3000 |
| Product Service | 3001 | http://localhost:3001 |
| Order Service | 3002 | http://localhost:3002 |
| Notification Service | 3003 | http://localhost:3003 |
| PostgreSQL (products DB) | 5432 | `marketplace_products` |
| PostgreSQL (orders DB) | 5433 | `marketplace_orders` |
| RabbitMQ (AMQP) | 5672 | — |
| RabbitMQ Management UI | 15672 | http://localhost:15672 (guest/guest) |

> **Note on databases:** in a real microservices system, each service owns its own
> database (DB per service). Here Product and Order each get their **own database**
> in the *same* PostgreSQL container — enough to feel the pattern without the cost.

---

## 5. Database models (per the requirements)

```
USER (exists in both Product & Order DB — each service stores the users it cares about)
  id, name, role: SELLER | BUYER

PRODUCT (Product Service DB)
  id, sellerId → User, name, price, createdAt

ORDER (Order Service DB)
  id, buyerId → User, productId, quantity, status: PENDING | CONFIRMED, createdAt
```

### Why does User appear twice?

Microservices do **not share databases**. A service can only read data it owns.
The Product Service cares about *sellers*, the Order Service cares about *buyers*,
so each keeps its own copy of the user rows relevant to it. This duplication is
normal and intentional — it is how services stay independent.

---

## 6. Complete folder structure

```
mini-marketplace/
│
├── README.md                     ← you are here (the map)
├── docker-compose.yml            ← Phase 5: starts everything with one command
│
├── gateway/                      ← SERVICE 1 — API Gateway
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── main.ts
│       ├── app.module.ts
│       └── modules/
│           ├── products/         ← forwards /products requests → Product Service (HTTP)
│           │   ├── products.module.ts
│           │   ├── products.controller.ts
│           │   └── products.service.ts
│           └── orders/           ← forwards /orders requests → Order Service (HTTP)
│               ├── orders.module.ts
│               ├── orders.controller.ts
│               └── orders.service.ts
│
└── services/
    ├── products/                 ← SERVICE 2 — Product Service
    │   ├── Dockerfile
    │   ├── package.json
    │   ├── .env.example
    │   ├── prisma/
    │   │   └── schema.prisma     ← Product + User models (source of truth)
    │   └── src/
    │       ├── main.ts
    │       ├── app.module.ts
    │       └── modules/
    │           ├── users/        ← create users (SELLER/BUYER)
    │           │   ├── users.module.ts
    │           │   ├── users.controller.ts
    │           │   ├── users.service.ts
    │           │   └── dto/create-user.dto.ts
    │           └── products/
    │               ├── products.module.ts
    │               ├── products.controller.ts
    │               ├── products.service.ts
    │               └── dto/create-product.dto.ts
    │
    ├── orders/                   ← SERVICE 3 — Order Service
    │   ├── Dockerfile
    │   ├── package.json
    │   ├── .env.example
    │   ├── prisma/
    │   │   └── schema.prisma     ← Order + User models
    │   └── src/
    │       ├── main.ts
    │       ├── app.module.ts
    │       └── modules/
    │           ├── users/        ← create users (buyers)
    │           │   ├── users.module.ts
    │           │   ├── users.controller.ts
    │           │   ├── users.service.ts
    │           │   └── dto/create-user.dto.ts
    │           └── orders/
    │               ├── orders.module.ts
    │               ├── orders.controller.ts
    │               ├── orders.service.ts
    │               └── dto/create-order.dto.ts
    │
    └── notifications/            ← SERVICE 4 — Notification Service
        ├── Dockerfile
        ├── package.json
        └── src/
            ├── main.ts
            ├── app.module.ts
            └── modules/
                └── notifications/
                    ├── notifications.module.ts
                    ├── notifications.service.ts   ← consumes RabbitMQ events
                    └── order-created.event.ts     ← the message shape
```

---

## 7. How NestJS organizes code (the 3 core files you will see everywhere)

Every module in NestJS follows the same recipe. Learn this once, reuse it everywhere:

```
request ──▶ Controller ──▶ Service ──▶ Prisma ──▶ PostgreSQL
              │               │
            (HTTP)        (business logic)
```

| File | Job | Analogy |
|---|---|---|
| `*.controller.ts` | Receives HTTP requests, validates nothing, delegates to the service, returns the response | The **receptionist** — takes the call, knows who to forward to |
| `*.service.ts` | Contains the real logic: talks to the database, does calculations | The **worker** who actually does the job |
| `*.module.ts` | "Glues" the controller + service together and tells NestJS they exist | The **department head** that registers everyone |

The controller never touches the database. The service never sees HTTP. This
separation is called **separation of concerns**.

---

## 8. Technology cheat-sheet (why these tools)

| Tool | Role in this project |
|---|---|
| **NestJS** | The web framework every service is built with. Gives structure (modules, DI, decorators) |
| **Prisma** | The ORM. We write `schema.prisma`, run `prisma migrate`, and get type-safe DB queries |
| **PostgreSQL** | The database that actually stores rows |
| **RabbitMQ** | The message broker between Order and Notification services |
| **Docker** | Packages each service + PostgreSQL + RabbitMQ into containers |
| **Docker Compose** | Starts all containers together with one command, wires the network |

---

## 9. The two request flows we will trace (targets for Phase 6)

```
Workflow 1 (synchronous):
Client → API Gateway → Product Controller → Product Service → Prisma → PostgreSQL

Workflow 2 (synchronous + asynchronous):
Client → API Gateway → Order Controller → Order Service → Prisma → PostgreSQL
                                                          ↘ RabbitMQ Publisher
                                                            → RabbitMQ queue
                                                            → Notification Consumer
```

---

## 10. Phase plan

- [x] **Phase 1** — This file: architecture, concepts, folder structure.
- [x] **Phase 2** — Product Service (NestJS + Prisma + PostgreSQL). You will learn:
  modules, DI, controllers, services, DTOs, Prisma schema & queries.

  **Try it yourself (Phase 2):**
  ```bash
  cd services/products
  npm install
  npx prisma migrate dev --name init   # creates tables in PostgreSQL (needs Postgres running)
  npm run start:dev                    # http://localhost:3001
  ```
  ```bash
  # Create a seller, then a product:
  curl -X POST localhost:3001/users -H "Content-Type: application/json" -d '{"name":"Alice","role":"SELLER"}'
  curl -X POST localhost:3001/products -H "Content-Type: application/json" -d '{"sellerId":1,"name":"Keyboard","price":49.99}'
  curl localhost:3001/products
  curl localhost:3001/products/seller/1
  ```
- [ ] **Phase 3** — Order Service (same patterns, new domain).
- [ ] **Phase 4** — RabbitMQ: Order Service publishes, Notification Service consumes.
- [ ] **Phase 5** — Docker: Dockerfiles + `docker-compose.yml` (PostgreSQL, RabbitMQ, 4 services).
- [ ] **Phase 6** — Trace both complete workflows end-to-end, file by file.

> Each phase includes: the code, a "what does every file do" explanation, and
> "who calls whom" communication notes.
