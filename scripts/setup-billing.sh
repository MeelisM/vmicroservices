#!/bin/bash

# Update package list
apt-get update

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PostgreSQL and RabbitMQ
apt-get install -y postgresql postgresql-contrib rabbitmq-server

# Install PM2 globally
npm install -g pm2

# Start RabbitMQ service
systemctl start rabbitmq-server
systemctl enable rabbitmq-server

# Load environment variables
if [ -f "/home/vagrant/root/.env" ]; then
    export $(cat /home/vagrant/root/.env | grep -v '#' | awk '/=/ {print $1}')
    echo "Loaded environment variables from .env"
else
    echo "No .env file found!"
    exit 1
fi

# Run database setup script
cd /home/vagrant/scripts/billing-app
chmod +x billing-db-setup.sh
./billing-db-setup.sh

# Install dependencies and start service
cd /home/vagrant/billing-app
npm install
pm2 start server.js --name "billing-api"
pm2 save