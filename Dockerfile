FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat openssl
RUN npm install -g pnpm

# ── Build ─────────────────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app

# Copy package manifests + npmrc (node-linker=hoisted → flat node_modules)
COPY .npmrc package.json pnpm-lock.yaml ./
# Prisma schema must be present before install so postinstall can run generate
COPY prisma ./prisma

RUN pnpm install --frozen-lockfile

COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# ── Runner ────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# Next.js standalone bundles the JS; static assets served separately
COPY --from=builder /app/public                          ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static     ./.next/static

# Prisma query-engine binary (not included in standalone output)
COPY --from=builder /app/node_modules/.prisma            ./node_modules/.prisma
COPY --from=builder /app/prisma/schema.prisma            ./prisma/schema.prisma

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
