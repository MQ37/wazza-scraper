FROM apify/actor-node-playwright-chrome:24

USER root
RUN npm install -g pnpm
USER myuser

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod

COPY . ./

ENV APIFY_DISABLE_OUTDATED_WARNING=1

CMD ["node", "src/main.js"]
