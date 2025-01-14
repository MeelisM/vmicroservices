#!/bin/bash
# Load environment variables from root directory's .env file if it exists
if [ -f "../../.env" ]; then
    export $(cat ../../.env | grep -v '#' | awk '/=/ {print $1}')
    echo "Loaded environment variables from ../.env"
else
    echo "No .env file found in parent directory"
fi

# Connect as postgres user to set up billing user and database
sudo -u postgres psql << EOF
-- Create billing user and database
CREATE USER ${BILLING_DB_USER} WITH PASSWORD '${BILLING_DB_PASSWORD}';
CREATE DATABASE ${BILLING_DB_NAME};
GRANT ALL PRIVILEGES ON DATABASE ${BILLING_DB_NAME} TO ${BILLING_DB_USER};
ALTER DATABASE ${BILLING_DB_NAME} OWNER TO ${BILLING_DB_USER};

-- Revoke public access to the database
REVOKE ALL ON DATABASE ${BILLING_DB_NAME} FROM PUBLIC;
EOF

# Connect to orders database to set schema permissions
sudo -u postgres psql -d ${BILLING_DB_NAME} << EOF
GRANT ALL ON SCHEMA public TO ${BILLING_DB_USER};
EOF

echo "Billing database setup completed successfully!"