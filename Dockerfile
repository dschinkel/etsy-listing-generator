# Stage 1: Build the frontend
FROM node:20-alpine AS frontend-builder

# Ensure yarn is available in the Alpine image
RUN apk add --no-cache yarn

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# Stage 2: Build the backend and run the app
FROM node:20-alpine

# Ensure yarn is available in the Alpine image
RUN apk add --no-cache yarn

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile

COPY --from=frontend-builder /app/dist ./dist
COPY --from=frontend-builder /app/src/service ./src/service
COPY --from=frontend-builder /app/tsconfig.json ./

# Create necessary directories for assets
RUN mkdir -p src/assets/generated-images src/assets/archived-images src/assets/uploads

# Install tsx to run the service
RUN yarn global add tsx

# Expose the port
EXPOSE 8080

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Start the application
CMD ["tsx", "src/service/index.ts"]
