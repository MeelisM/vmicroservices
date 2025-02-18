#!/bin/bash

# Define colors
LIGHTGREEN='\033[1;32m' # Success message
LIGHTBLUE='\033[1;36m' # General message
NC='\033[0m' # No Color 

echo -e "${LIGHTBLUE}Starting the setup-gateway script!${NC}"

# Update package list
echo -e "${LIGHTBLUE}Updating...${NC}"
apt-get update

# Install Node.js
echo -e "${LIGHTBLUE}Installing Node.js...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2 globally
echo -e "${LIGHTBLUE}Installing PM2...${NC}"
npm install -g pm2

# Install required packages
cd /home/vagrant/app/src/api-gateway
echo -e "${LIGHTBLUE}Installing npm packages${NC}"
npm install

# Start the service
echo -e "${LIGHTGREEN}##### Starting the api-gateway #####${NC}"
pm2 start server.js --name "api-gateway"
pm2 save

echo -e "${LIGHTGREEN}##### api-gateway has been started! #####${NC}"
echo -e "${LIGHTGREEN}##### setup-gateway script finished! #####${NC}"