# Stage 1: Build the React app
FROM node:14-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Disable strict CI type checking (if needed)
ENV CI=false
RUN npm run build

# Stage 2: Serve the built app with Nginx
FROM nginx:stable-alpine
# Remove default static assets
RUN rm -rf /usr/share/nginx/html/*
# Copy build files from the correct folder (dist)
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
