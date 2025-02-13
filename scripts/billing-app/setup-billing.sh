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
ENV_FILE="/home/vagrant/app/.env"
if [ -f "$ENV_FILE" ]; then
    echo "Found .env file at: $ENV_FILE"
    echo "Contents of .env (excluding passwords):"
    grep -v PASSWORD "$ENV_FILE"
    
    # Export variables
    export $(cat "$ENV_FILE" | sed 's/#.*//g' | xargs)
    
    echo "Verifying variables:"
    echo "BILLING_DB_USER=${BILLING_DB_USER}"
    echo "BILLING_DB_NAME=${BILLING_DB_NAME}"
else
    echo "No .env file found at $ENV_FILE!"
    exit 1
fi

# Configure PostgreSQL authentication
PG_VERSION=$(ls /etc/postgresql/)  # Get installed PostgreSQL version
PG_HBA_PATH="/etc/postgresql/${PG_VERSION}/main/pg_hba.conf"

# Backup original config
sudo cp "${PG_HBA_PATH}" "${PG_HBA_PATH}.backup"

# Replace authentication method to trust for local connections
sudo sed -i 's/peer/trust/g' "${PG_HBA_PATH}"
sudo sed -i 's/scram-sha-256/trust/g' "${PG_HBA_PATH}"
sudo sed -i 's/md5/trust/g' "${PG_HBA_PATH}"

# Restart PostgreSQL to apply changes
sudo systemctl restart postgresql

# Run database setup script
cd /home/vagrant/app/scripts/billing-app/
chmod +x billing-db-setup.sh
./billing-db-setup.sh

# Install dependencies and start service
cd /home/vagrant/app/src/billing-app || exit
npm install
pm2 start server.js --name "billing-api"
pm2 save