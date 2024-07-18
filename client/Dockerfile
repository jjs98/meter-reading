FROM nginx:alpine

COPY config/nginx.conf /etc/nginx/conf.d/default.conf

COPY dist/client/browser /usr/share/nginx/html
EXPOSE 80