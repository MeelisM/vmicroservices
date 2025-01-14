#!/bin/bash

# Load environment variables from parent directory's .env file if it exists
if [ -f "../.env" ]; then
    export $(cat ../.env | grep -v '#' | awk '/=/ {print $1}')
    echo "Loaded environment variables from ../.env"
else
    echo "No .env file found in parent directory"
fi

# Connect as postgres user to set up new users and databases
sudo -u postgres psql << EOF
-- Create inventory user and database
CREATE USER ${INVENTORY_DB_USER} WITH PASSWORD '${INVENTORY_DB_PASSWORD}';
CREATE DATABASE ${INVENTORY_DB_NAME};
GRANT ALL PRIVILEGES ON DATABASE ${INVENTORY_DB_NAME} TO ${INVENTORY_DB_USER};
ALTER DATABASE ${INVENTORY_DB_NAME} OWNER TO ${INVENTORY_DB_USER};

-- Create billing user and database
CREATE USER ${BILLING_DB_USER} WITH PASSWORD '${BILLING_DB_PASSWORD}';
CREATE DATABASE ${BILLING_DB_NAME};
GRANT ALL PRIVILEGES ON DATABASE ${BILLING_DB_NAME} TO ${BILLING_DB_USER};
ALTER DATABASE ${BILLING_DB_NAME} OWNER TO ${BILLING_DB_USER};

-- Revoke public access to these databases
REVOKE ALL ON DATABASE ${INVENTORY_DB_NAME} FROM PUBLIC;
REVOKE ALL ON DATABASE ${BILLING_DB_NAME} FROM PUBLIC;
EOF

# Connect to movies database to set schema permissions
sudo -u postgres psql -d ${INVENTORY_DB_NAME} << EOF
GRANT ALL ON SCHEMA public TO ${INVENTORY_DB_USER};
EOF

# Connect to orders database to set schema permissions
sudo -u postgres psql -d ${BILLING_DB_NAME} << EOF
GRANT ALL ON SCHEMA public TO ${BILLING_DB_USER};
EOF

echo "Database setup completed successfully!"