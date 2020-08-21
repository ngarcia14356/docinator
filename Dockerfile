FROM node:latest as builder
WORKDIR /docinator
COPY . .
RUN set -e && \
    export NPM_CONFIG_PREFIX=~/.npm-global && \
    npm install -g typescript && \
    npm install --unsafe-perm

FROM openjdk:15-jdk-alpine
COPY --from=builder . .
WORKDIR /docinator
RUN apk add --no-cache nodejs npm graphviz ttf-droid bash ttf-droid-nonlatin
RUN npm install -g . 
ENTRYPOINT [ "docinator" ]