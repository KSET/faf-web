FROM node:22-alpine3.19 as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ic
COPY . .
RUN npm run build

FROM caddy:2-alpine
RUN cat > /etc/caddy/Caddyfile <<EOF
:80 {
  try_files {path} /
  file_server
  root * /app
}
EOF
COPY --from=build /app/dist /app

