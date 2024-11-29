FROM nginx:1.27.3-alpine
COPY /dist /usr/share/nginx/html
COPY /dist/browser /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
