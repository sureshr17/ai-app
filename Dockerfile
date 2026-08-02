# Multi-stage Dockerfile for Movie Book Application

# Stage 1: Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build app
COPY . .
RUN npm run build

# Stage 2: Runtime stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy built dist files and package configs
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

# Run Express server
CMD ["node", "dist/server.cjs"]
