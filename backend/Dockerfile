FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Ensure the database file exists or the init script is run
# We will run the init script in the entrypoint or CMD if db doesn't exist
# But for simplicity, we'll just expose the port and run start.
# The init-db script creates a NEW db, so we should be careful with persistence.
# We will use a volume for the database file.

EXPOSE 3001

CMD ["npm", "start"]
