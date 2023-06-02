# Use an official Node.js runtime as the base image
FROM node:14-alpine as build

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock) files to the container
COPY package*.json ./

RUN npm install -force

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application's code to the container
COPY . .

# Build the React app
RUN npm run build

# Use a lightweight Node.js runtime as the final base image
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the built assets from the previous stage to the container
COPY --from=build /app/build ./build

# Install a static server to serve the production build
RUN npm install -g serve

# Expose the port on which the application will run (default for create-react-app is 3000)
EXPOSE 80

# Set the command to start the application
CMD ["serve", "-s", "build"]

