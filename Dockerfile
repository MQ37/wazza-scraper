FROM apify/actor-node-playwright-chrome:24 AS builder

USER root
RUN npm install -g pnpm
USER myuser

COPY package.json pnpm-lock.yaml tsconfig.json ./

RUN pnpm install --frozen-lockfile

COPY src ./src

RUN pnpm run build

# --- Final image ---
FROM apify/actor-node-playwright-chrome:24

USER root
RUN npm install -g pnpm
USER myuser

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /home/myuser/dist ./dist
COPY .actor ./.actor
COPY README.md ./

ENV APIFY_DISABLE_OUTDATED_WARNING=1

CMD ["node", "dist/main.js"]
