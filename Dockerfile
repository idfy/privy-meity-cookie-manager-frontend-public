FROM fholzer/nginx-brotli:latest
RUN mkdir /usr/app
WORKDIR /usr/app
RUN apk add --no-cache bash nginx-mod-http-headers-more nginx-mod-http-brotli

# Copy nginx config files
RUN rm -rf /etc/nginx/nginx.conf /etc/nginx/conf.d
COPY conf /etc/nginx

# Copy build directory
COPY build/. /usr/share/nginx/html

# Setup envs
COPY ./deploy .
COPY ./.env .

# Start server
EXPOSE 8080
RUN chmod +x /usr/app/run-server.sh
ENTRYPOINT ["/bin/bash", "-c", "/usr/app/run-server.sh"]