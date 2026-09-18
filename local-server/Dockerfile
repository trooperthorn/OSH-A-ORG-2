# A-ORG-2 local server — zero-dependency Node http server (see server.js for
# why: no framework, no npm install as a build step, nothing to audit).
# node:20-alpine keeps the image small; only server.js runs, and it needs no
# native modules, so alpine's musl libc is not a concern here.
FROM node:20-alpine

WORKDIR /app

# The server reads the repo root (../ from local-server/) as its static site,
# so the whole repo is the build context — see docker-compose.yml, which sets
# the build context to the repo root and this Dockerfile's path explicitly.
COPY . /app

ENV PORT=8080
# LIVE_PUSH_TOKEN must be supplied at run time (docker run -e / compose env) —
# it is deliberately NOT baked into the image or given a default here, so an
# image can never ship with an unauthenticated ingest route by accident.
ENV LIVE_DATA_DIR=/data

# Persisted so the last-pushed live-assets snapshot survives a container
# restart; mount this as a volume (see docker-compose.yml).
VOLUME ["/data"]

EXPOSE 8080

CMD ["node", "local-server/server.js"]
