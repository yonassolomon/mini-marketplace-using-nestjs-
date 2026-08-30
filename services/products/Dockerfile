# ============================================================
# Dockerfile — Product Service
#
# PURPOSE: packages the service into a container image.
#
# KEY DOCKER CONCEPTS:
# - IMAGE:   the recipe (this file) + layers. Read-only blueprint.
# - CONTAINER: a running instance of an image.
# - STAGE 1  ("builder"): has everything to COMPILE the code.
# - STAGE 2  ("runner"):  only what is needed to RUN it (smaller).
#
# Why multi-stage? The compiler needs TypeScript + dev deps
# (~400 MB). The running app needs neither. Two FROM lines =
# two images; only the LAST one is kept.
# ============================================================

# ---------- STAGE 1: build ----------
FROM node:22-alpine AS builder
WORKDIR /app

# Copy only the manifests first: Docker caches layers. If
# package.json didn't change, npm ci is reused (huge speedup).
COPY package*.json ./
RUN npm ci

# Now the source code, then compile + generate the Prisma client.
COPY . .
RUN npx prisma generate && npm run build

# ---------- STAGE 2: run ----------
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

# Install runtime dependencies (includes the prisma CLI so we can
# run migrations at container start — see CMD).
COPY package*.json ./
RUN npm ci

# Copy the compiled code, the schema + migrations, and the
# GENERATED Prisma client (npm ci does NOT run prisma generate).
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Node runs as root by default; drop privileges (production habit).
USER node

# migrate deploy = apply pending migrations (idempotent: only
# unapplied ones run), then start the app.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
