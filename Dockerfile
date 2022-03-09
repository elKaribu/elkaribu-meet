FROM node:14 as deps

WORKDIR /calcom
COPY package.json yarn.lock ./
COPY apps/web/package.json apps/web/yarn.lock ./apps/web/
COPY packages/prisma/package.json ./packages/prisma/package.json
COPY packages/lib/package.json ./packages/lib/package.json
COPY packages/tsconfig/package.json ./packages/tsconfig/package.json
RUN yarn install

FROM node:14 as builder

WORKDIR /calcom
ARG BASE_URL
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_LICENSE_CONSENT
ARG NEXT_PUBLIC_TELEMETRY_KEY
ENV BASE_URL=$BASE_URL \
    NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    NEXT_PUBLIC_LICENSE_CONSENT=$NEXT_PUBLIC_LICENSE_CONSENT \
    NEXT_PUBLIC_TELEMETRY_KEY=$NEXT_PUBLIC_TELEMETRY_KEY

COPY package.json yarn.lock turbo.json ./
COPY apps/web ./apps/web
COPY packages ./packages
COPY --from=deps /calcom/node_modules ./node_modules
RUN yarn build && yarn install --production --ignore-scripts --prefer-offline

FROM node:14 as runner
WORKDIR /calcom
ENV NODE_ENV production

RUN apt-get update && \
    apt-get -y install netcat && \
    rm -rf /var/lib/apt/lists/* && \
    npm install --global prisma

COPY package.json yarn.lock turbo.json ./
COPY --from=builder /calcom/node_modules ./node_modules
COPY --from=builder /calcom/packages ./packages
COPY --from=builder /calcom/apps/web/node_modules ./apps/web/node_modules
COPY --from=builder /calcom/apps/web/scripts ./apps/web/scripts
COPY --from=builder /calcom/apps/web/next.config.js ./apps/web/next.config.js
COPY --from=builder /calcom/apps/web/next-i18next.config.js ./apps/web/next-i18next.config.js
COPY --from=builder /calcom/apps/web/public ./apps/web/public
COPY --from=builder /calcom/apps/web/.next ./apps/web/.next
COPY --from=builder /calcom/apps/web/package.json ./apps/web/package.json
COPY  scripts scripts

EXPOSE 3000
CMD ["/bin/sh", "/calcom/scripts/start.sh"]
