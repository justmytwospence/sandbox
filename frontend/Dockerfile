# Use the official Node.js image from the Docker Hub
FROM node:14

# Set the working directory in the container
WORKDIR /frontend

# Copy the React app code into the container
COPY . .

# Install the dependencies
RUN npm install

# Build the React app
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to serve the React app
CMD ["npm", "start"]