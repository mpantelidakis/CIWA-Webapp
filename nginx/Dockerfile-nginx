#Dockerfile-nginx
# Use the Nginx image
FROM nginx:latest

# Nginx will listen on this port
EXPOSE 81

# Remove the default nginx.conf
RUN rm /etc/nginx/conf.d/default.conf

# Replace with our own nginx.conf
COPY nginx.conf /etc/nginx/conf.d

# link media and static access logs with stdout. Neat for debugging.
RUN ln -sf /dev/stdout /var/log/nginx/mediafiles.access.log