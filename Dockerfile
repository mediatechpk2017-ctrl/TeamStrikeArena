FROM node:18-alpine AS base
WORKDIR /app

FROM base AS server
WORKDIR /app/server
COPY server/package.json server/package-lock.json* ./
RUN npm install
COPY server ./
RUN npm run build

FROM base AS client
WORKDIR /app/client
COPY client/package.json client/package-lock.json* ./
RUN npm install
COPY client ./
RUN npm run build

# final image only runs the server
FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=server /app/server/dist ./server
COPY --from=client /app/client/dist ./client

EXPOSE 3000
CMD ["node", "server/index.js"]
