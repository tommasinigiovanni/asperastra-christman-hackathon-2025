# Hackathon AI Mentor - Production Dockerfile
FROM nginx:alpine

# Metadata
LABEL maintainer="Giovanni Tommasini"
LABEL description="Hackathon AI Mentor - Interactive presentation app"
LABEL version="2.0.0"

# Copy application files
COPY index.html /usr/share/nginx/html/
COPY src/ /usr/share/nginx/html/src/
COPY img/ /usr/share/nginx/html/img/

# Nginx is configured to serve on port 80 by default
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
