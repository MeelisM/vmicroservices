#!/bin/bash

# Update package list
apt-get update

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PostgreSQL
apt-get install -y postgresql postgresql-contrib

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
    
    echo "Verifying variables:"
    echo "INVENTORY_DB_USER=${INVENTORY_DB_USER}"
    echo "INVENTORY_DB_NAME=${INVENTORY_DB_NAME}"
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
cd /home/vagrant/app/scripts/inventory-app
chmod +x inventory-db-setup.sh
./inventory-db-setup.sh

# Install dependencies and start service
cd /home/vagrant/app/src/inventory-app || exit
npm install
pm2 start server.js --name "inventory-api"
pm2 save