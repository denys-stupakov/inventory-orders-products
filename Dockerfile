# ── Stage 1: build React app ──────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# .env.production sets VITE_API_URL="" so axios uses relative /api
RUN npm run build

# ── Stage 2: serve with nginx + proxy config ──────────────────
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template
EXPOSE 80
# nginx docker image runs envsubst on /etc/nginx/templates/*.template automatically
ENV BACKEND_HOST=backend
ENV BACKEND_PORT=3001
CMD ["nginx", "-g", "daemon off;"]
