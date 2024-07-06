FROM node:alpine as build
WORKDIR /src/client


RUN npm install -g pnpm

COPY package.json /src/client/
COPY pnpm-lock.yaml /src/client/
COPY .npmrc /src/client/

RUN pnpm install

COPY ./ /src/client/

RUN pnpm build

FROM build as final
# Serve app with nginx server
FROM nginx:alpine

COPY config/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /src/client/dist/client/browser /usr/share/nginx/html
EXPOSE 80