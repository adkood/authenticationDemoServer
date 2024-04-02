# Use the official Node.js image as the base image
FROM node:20

# Set environment variables
ENV NODE_ENV=development \
    PORT=5000 \
    DB_KEY=mongodb+srv://ashutosh:<password>@cluster0.jx263.mongodb.net/?retryWrites=true&w=majority&appName=test \
    DB_PASSWORD=cNzEhfCKhJIsIdTv \
    JWT_SECRET=this-is-my-secret-jwt-key-for-this-project \
    JWT_EXPIRES_IN=90d \
    COOKIE_EXPIRES_IN=90

# Set the working directory in the container
WORKDIR /myServer

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port 5000
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
