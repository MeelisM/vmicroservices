#!/bin/bash

# Load environment variables if not already loaded

    if [ -f "../../.env" ]; then
        export $(cat ../../.env | grep -v '#' | awk '/=/ {print $1}')
        echo "Loaded environment variables from .env"
    else
        echo "No .env file found!"
        exit 1
    fi


echo "Setting up database with:"
echo "User: $INVENTORY_DB_USER"
echo "Database: $INVENTORY_DB_NAME"

# Connect as postgres user to set up inventory user and database
sudo -u postgres psql << EOF
-- Create inventory user and database
CREATE USER ${INVENTORY_DB_USER} WITH PASSWORD '${INVENTORY_DB_PASSWORD}';
CREATE DATABASE ${INVENTORY_DB_NAME};
GRANT ALL PRIVILEGES ON DATABASE ${INVENTORY_DB_NAME} TO ${INVENTORY_DB_USER};
ALTER DATABASE ${INVENTORY_DB_NAME} OWNER TO ${INVENTORY_DB_USER};

-- Revoke public access to the database
REVOKE ALL ON DATABASE ${INVENTORY_DB_NAME} FROM PUBLIC;
EOF

# Connect to movies database to set schema permissions
sudo -u postgres psql -d ${INVENTORY_DB_NAME} << EOF
GRANT ALL ON SCHEMA public TO ${INVENTORY_DB_USER};
EOF

echo "Inventory database setup completed successfully!"