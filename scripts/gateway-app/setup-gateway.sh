#!/bin/bash

# Update package list
apt-get update

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2 globally
npm install -g pm2

# Load environment variables
ENV_FILE="/home/vagrant/app/.env"
if [ -f "$ENV_FILE" ]; then
    echo "Found .env file at: $ENV_FILE"
    echo "Contents of .env (excluding passwords):"
    grep -v PASSWORD "$ENV_FILE"
    
    # Export variables
    export $(cat "$ENV_FILE" | sed 's/#.*//g' | xargs)

else
    echo "No .env file found at $ENV_FILE!"
    exit 1
fi

# Install dependencies and start service
cd /home/vagrant/app/src/api-gateway
npm install
pm2 start server.js --name "api-gateway"
pm2 save