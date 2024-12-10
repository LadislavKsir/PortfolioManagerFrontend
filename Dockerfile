# Use the official Nginx image as the base
FROM nginx:stable-alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Remove default Nginx static resources
RUN rm -rf ./*

# Copy the build output from the 'dist' folder into the container
COPY dist/ .

# Copy a custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to allow external access
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
