#!/bin/bash

# Update package list
apt-get update

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2 globally
npm install -g pm2

# Load environment variables
if [ -f "/home/vagrant/root/.env" ]; then
    export $(cat /home/vagrant/root/.env | grep -v '#' | awk '/=/ {print $1}')
    echo "Loaded environment variables from .env"
else
    echo "No .env file found!"
    exit 1
fi

# Install dependencies and start service
cd /home/vagrant/api-gateway
npm install
pm2 start server.js --name "api-gateway"
pm2 save