FROM nginx:1.25.2

RUN apt-get update && apt-get install -y --no-install-recommends \
    libaom3=3.7.1-1~deb12u1 \
    zlib1g=1:1.2.13.dfsg-1+deb12u1 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY /dist /usr/share/nginx/html
COPY /dist/browser /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
