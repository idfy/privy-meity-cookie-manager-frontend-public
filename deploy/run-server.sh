#!/bin/bash -e

chmod +x env.sh
./env.sh /usr/share/nginx/html

export server_host=$SERVER_HOST
envsubst '${server_host}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

nginx -g "daemon off;"