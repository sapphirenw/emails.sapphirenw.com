# Optimized multi-platform Dockerfile for Hono/Node.js
FROM --platform=$BUILDPLATFORM node:20-alpine AS base

FROM base AS builder

# Install system dependencies
RUN apk add --no-cache gcompat
WORKDIR /app

# Copy package files first for better caching
COPY package*.json tsconfig.json ./

# Install dependencies with cache mount
RUN --mount=type=cache,target=/root/.npm \
    npm ci --cache /root/.npm --prefer-offline

# Copy source code
COPY src ./src 
COPY emails ./emails

# Build and prune with cache mounts
RUN --mount=type=cache,target=/root/.npm \
    npm run build && \
    npm prune --production --cache /root/.npm

# Runtime stage uses target platform (default)
FROM node:20-alpine AS runner
WORKDIR /app

# Create user group
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

# Copy built application
COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/dist /app/dist
COPY --from=builder --chown=hono:nodejs /app/package.json /app/package.json

USER hono

CMD ["node", "/app/dist/src/index.js"]