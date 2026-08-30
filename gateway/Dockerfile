# ============================================================
# Dockerfile — API Gateway
#
# No Prisma, no RabbitMQ: the gateway only makes HTTP calls.
# Its only "external" need is the addresses of the internal
# services, provided via env vars by docker-compose.
# ============================================================

# ---------- STAGE 1: build ----------
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- STAGE 2: run ----------
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci

COPY --from=builder /app/dist ./dist

USER node

CMD ["node", "dist/main.js"]
