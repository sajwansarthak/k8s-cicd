FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src

ENV NODE_ENV=production
EXPOSE 3000

# Run as non-root user (built into the node image)
USER node

CMD ["node", "src/server.js"]
