#!/bin/bash
# Create uploads and db directories in the volume
mkdir -p /data/uploads /data/db
chown -R node:node /data/uploads /data/db
chmod -R 755 /data/uploads /data/db

# Ensure /app/public/uploads exists and is writable
mkdir -p /app/public/uploads
chown -R node:node /app/public/uploads
chmod -R 755 /app/public/uploads

# Create symbolic link from /app/public/uploads to /data/uploads
ln -sfn /data/uploads /app/public/uploads

# Start Strapi in production mode
NODE_ENV=production npm start