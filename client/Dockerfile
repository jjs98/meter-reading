FROM nginx:alpine

COPY config/nginx.conf /etc/nginx/conf.d/default.conf

COPY dist/client /usr/share/nginx/html
EXPOSE 80