#!/bin/sh
set -e

: ${SERVER_BIND:=":8081"}
: ${API_FAKT_HOST:="http://localhost:8080/api/v1"}

if [ "$1" = 'fakt-ui' ]; then
  touch /var/log/fakt-ui/out.log
  exec fakt-ui -server.bind=${SERVER_BIND} -api.fakt.host=${API_FAKT_HOST} | tee /var/log/fakt-ui/out.log 2>&1
fi

exec "$@"