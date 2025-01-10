FROM node:latest as node
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=node /app/dist/helpdesk /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80