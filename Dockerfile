# Stage 1: Build the React app
FROM node:18.16.0-alpine as build

# Set working directory
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --silent

RUN npm install react-scripts@3.4.1 -g --silent

# Copy the rest of the application files
COPY . ./

# Build the React app
RUN npm run build

# Stage 2: Serve the built React app with Nginx
FROM nginx:stable-alpine

# Copy the built app from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for the application
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

