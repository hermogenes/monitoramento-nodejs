FROM node:23.8.0-alpine AS base

FROM base AS builder

RUN apk add --no-cache gcompat

WORKDIR /app

COPY package*json tsconfig.json src types ./

RUN npm install -g pnpm && \
  pnpm install && \
  pnpm run build && \
  pnpm prune --prod

FROM base AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 app
RUN adduser --system --uid 1001 app

COPY --from=builder --chown=app:app /app/node_modules /app/node_modules
COPY --from=builder --chown=app:app /app/dist /app/dist
COPY --from=builder --chown=app:app /app/package.json /app/package.json

USER app
EXPOSE 3001

CMD ["node", "--import", "/app/dist/instrumentation.js", "/app/dist/index.js"]
