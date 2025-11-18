# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Deps para bcrypt, etc.
RUN apk add --no-cache python3 make g++

# AUMENTAR TIMEOUT DE YARN
RUN yarn config set networkTimeout 600000 -g

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# ---- Runtime Stage ----
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

# Mismo ajuste por si acaso
RUN yarn config set networkTimeout 600000 -g

COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile

COPY --from=builder /app/dist ./dist
COPY firebasekeys.json ./firebasekeys.json

EXPOSE 3000
CMD ["node", "dist/main.js"]
