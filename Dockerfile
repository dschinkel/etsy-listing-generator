# Stage 1: Build the frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* ./
RUN if [ -f yarn.lock ]; then yarn install; else npm install; fi

COPY . .
RUN npm run build

# Stage 2: Build the backend and run the app
FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* ./
RUN if [ -f yarn.lock ]; then yarn install --production; else npm install --production; fi

COPY --from=frontend-builder /app/dist ./dist
COPY --from=frontend-builder /app/src/service ./src/service
COPY --from=frontend-builder /app/tsconfig.json ./

# Install tsx to run the service
RUN npm install -g tsx

# Expose the port
EXPOSE 8080

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Start the application
CMD ["tsx", "src/service/index.ts"]
