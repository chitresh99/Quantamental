FROM oven/bun:1 AS builder

WORKDIR /app

COPY bun.lock package.json tsconfig.json ./
COPY . .

RUN bun install --frozen-lockfile
RUN bun run build

FROM oven/bun:1 AS runner

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/bun.lock ./bun.lock

RUN bun install --production --frozen-lockfile

EXPOSE 3000
CMD ["bun", "run", "start"]
