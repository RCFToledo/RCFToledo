# Estágio 1: Build da Aplicação Vue.js
FROM node:20-alpine AS build-stage
WORKDIR /app
COPY src/package*.json ./
RUN npm ci
COPY src/ ./
RUN npm run build

# Estágio 2: Servidor Nginx para Produção
FROM nginx:alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]