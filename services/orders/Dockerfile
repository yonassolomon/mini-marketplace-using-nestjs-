# ============================================================
# Dockerfile — Order Service
#
# Same structure as the Product Service Dockerfile — the only
# difference: the runtime also needs @prisma + amqplib (both
# come with npm ci). The RabbitMQ connection is configured via
# env vars in docker-compose, not in the image.
# ============================================================

# ---------- STAGE 1: build ----------
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate && npm run build

# ---------- STAGE 2: run ----------
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER node

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
