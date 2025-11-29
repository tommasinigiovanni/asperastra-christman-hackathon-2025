# Hackathon AI Mentor - Production Dockerfile
FROM nginx:alpine

# Metadata
LABEL maintainer="Giovanni Tommasini"
LABEL description="Hackathon AI Mentor - Interactive presentation app"
LABEL version="2.0.0"

# Copy application files
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY config.js /usr/share/nginx/html/
COPY script-content.js /usr/share/nginx/html/
COPY state-manager.js /usr/share/nginx/html/
COPY animation-engine.js /usr/share/nginx/html/
COPY chat-manager.js /usr/share/nginx/html/
COPY main.js /usr/share/nginx/html/

# Copy any assets if they exist
COPY *.jpg /usr/share/nginx/html/ 2>/dev/null || true
COPY *.png /usr/share/nginx/html/ 2>/dev/null || true
COPY *.gif /usr/share/nginx/html/ 2>/dev/null || true
COPY *.jpeg /usr/share/nginx/html/ 2>/dev/null || true

# Nginx is configured to serve on port 80 by default
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]