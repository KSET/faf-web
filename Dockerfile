FROM node:22-alpine3.19 as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ic
COPY . .
RUN npm run build

FROM nginx:1-alpine
COPY --from=build /app/dist /usr/share/nginx/html

