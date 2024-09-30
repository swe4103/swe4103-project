# Use the official Node.js 16 LTS image as the base
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock to the container
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --production

# Copy the rest of the application code to the container
COPY . .

# Expose port Express api will run on
EXPOSE 3000

# Start the app
CMD ["yarn", "start"]
