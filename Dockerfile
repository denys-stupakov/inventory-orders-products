# ── Stage 1: build React app ──────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── Stage 2: Node.js serves API + static React build ──────────
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY server/ ./server/
COPY --from=build /app/dist ./dist
EXPOSE 3001
ENV NODE_ENV=production
ENV JWT_SECRET=inventory-secret-key-2024
CMD ["node", "server/index.js"]
