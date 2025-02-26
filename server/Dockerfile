FROM node:18-alpine

# Install Python and build tools required for node-gyp and canvas
RUN apk add --no-cache python3 make g++ cairo-dev pango-dev giflib-dev

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
