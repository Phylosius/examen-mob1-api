# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Install openssl for Prisma
RUN apk add --no-cache openssl

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy the prisma directory so 'npm install' can run the prisma postinstall hook
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Ensure entrypoint script is executable and in the path
RUN chmod +x entrypoint.sh && mv entrypoint.sh /usr/local/bin/

# Expose the port the app runs on
EXPOSE 8080

# Define the entrypoint
ENTRYPOINT ["entrypoint.sh"]

# Set the default command to start the app
CMD ["npm", "run", "dev"]
