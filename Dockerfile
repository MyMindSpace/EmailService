# Use the official Node.js 18 LTS Alpine image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S emailservice -u 1001

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy the rest of the application code
COPY . .

# Change ownership of the app directory to the nodejs user
RUN chown -R emailservice:nodejs /app
USER emailservice

# Expose the port the app runs on
EXPOSE 3003

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node healthcheck.js || exit 1

# Start the application
CMD ["node", "server.js"]
