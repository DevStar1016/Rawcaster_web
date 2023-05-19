# Stage 1: Build the React app
FROM node:18.16.0-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Delete package-lock.json
RUN rm package-lock.json

# Clear npm cache
RUN npm cache clean --force

# Install dependencies
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the built React app with Nginx
FROM nginx:1.21.0-alpine

# Copy the built app from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for the application
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

