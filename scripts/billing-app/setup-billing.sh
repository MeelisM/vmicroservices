#!/bin/bash

# Define colors
LIGHTGREEN='\033[1;32m' # Success message
LIGHTBLUE='\033[1;36m' # General message
NC='\033[0m' # No Color 

echo -e "${LIGHTBLUE}Starting the setup-billing script!${NC}"

# Update package list
echo -e "${LIGHTBLUE}Updating...${NC}"
apt-get update

# Install Node.js
echo -e "${LIGHTBLUE}Installing Node.js...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PostgreSQL and RabbitMQ
echo -e "${LIGHTBLUE}Installing PostgreSQL and RabbitMQ...${NC}"
apt-get install -y postgresql postgresql-contrib rabbitmq-server

# Install PM2 globally
echo -e "${LIGHTBLUE}Installing PM2...${NC}"
npm install -g pm2

# Start RabbitMQ service
echo -e "${LIGHTBLUE}Starting RabbitMQ...${NC}"
systemctl start rabbitmq-server
systemctl enable rabbitmq-server

# Create RabbitMQ user
rabbitmqctl add_user rabbit_user rabbit_password
echo -e "${LIGHTGREEN}Created RabbitMQ user and password.${NC}"

# Set the user as an administrator (optional)
rabbitmqctl set_user_tags rabbit_user administrator

# Grant the user permissions
rabbitmqctl set_permissions -p / rabbit_user ".*" ".*" ".*"
echo -e "${LIGHTGREEN}Set correct user permissions.${NC}"

# Configure PostgreSQL authentication
PG_VERSION=$(psql -V | awk '{print $3}' | cut -d. -f1)
PG_HBA_PATH="/etc/postgresql/${PG_VERSION}/main/pg_hba.conf"

# Logging output for PostgreSQL version and path
echo -e "${LIGHTBLUE}PostgreSQL version ${PG_VERSION}${NC}"
echo -e "${LIGHTBLUE}pg_hba.conf path: ${PG_HBA_PATH}${NC}"

# Backup original config
sudo cp "${PG_HBA_PATH}" "${PG_HBA_PATH}.backup"

# Replace authentication method to trust for local connections
sudo sed -i 's/peer/trust/g' "${PG_HBA_PATH}"
sudo sed -i 's/scram-sha-256/trust/g' "${PG_HBA_PATH}"
sudo sed -i 's/md5/trust/g' "${PG_HBA_PATH}"

# Restart PostgreSQL to apply changes
echo -e "${LIGHTBLUE}Restarting PostgreSQL...${NC}"
sudo systemctl restart postgresql

# Run database setup script
cd /home/vagrant/app/scripts/billing-app/
echo -e "${LIGHTBLUE}Setting up the database...${NC}"
chmod +x setup-billing-db.sh
./setup-billing-db.sh

# Install required packages
cd /home/vagrant/app/src/billing-app
echo -e "${LIGHTBLUE}Installing npm packages...${NC}"
npm install

# Start the service
echo -e "${LIGHTGREEN}##### Starting the billing-api #####${NC}"
pm2 start server.js --name "billing-api"
pm2 save

echo -e "${LIGHTGREEN}##### billing-app has been started! #####${NC}"
echo -e "${LIGHTGREEN}##### setup-billing script finished! #####${NC}"