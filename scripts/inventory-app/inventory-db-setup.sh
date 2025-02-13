#!/bin/bash
# Function to load environment variables
load_env_vars() {
    local current_dir="$1"
    while [ "$current_dir" != "/" ]; do
        if [ -f "$current_dir/.env" ]; then
            echo "Found .env at: $current_dir/.env"
            
            export $(cat "$current_dir/.env" | sed 's/#.*//g' | xargs)
            
            if [ "$ENVIRONMENT" = "PRODUCTION" ]; then
                export INVENTORY_DB_USER="$PROD_INVENTORY_DB_USER"
                export INVENTORY_DB_PASSWORD="$PROD_INVENTORY_DB_PASSWORD"
                export INVENTORY_DB_NAME="$PROD_INVENTORY_DB_NAME"
            else
                export INVENTORY_DB_USER="$DEV_INVENTORY_DB_USER"
                export INVENTORY_DB_PASSWORD="$DEV_INVENTORY_DB_PASSWORD"
                export INVENTORY_DB_NAME="$DEV_INVENTORY_DB_NAME"
            fi
            
            echo "Verifying variables after loading:"
            echo "Environment: $ENVIRONMENT"
            echo "INVENTORY_DB_USER=${INVENTORY_DB_USER}"
            echo "INVENTORY_DB_NAME=${INVENTORY_DB_NAME}"
            return 0
        fi
        current_dir="$(dirname "$current_dir")"
    done
    return 1
}

# If variables aren't already set, try to load them
if [ -z "$INVENTORY_DB_USER" ] || [ -z "$INVENTORY_DB_PASSWORD" ] || [ -z "$INVENTORY_DB_NAME" ]; then
    echo "Variables not set, attempting to load from .env"
    SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
    load_env_vars "$SCRIPT_DIR"
fi

# Check if we have the required variables
if [ -z "$INVENTORY_DB_USER" ] || [ -z "$INVENTORY_DB_PASSWORD" ] || [ -z "$INVENTORY_DB_NAME" ]; then
    echo "Required environment variables are not set!"
    echo "Current environment variables:"
    env | grep INVENTORY_
    exit 1
fi

echo "Setting up database with:"
echo "User: $INVENTORY_DB_USER"
echo "Database: $INVENTORY_DB_NAME"

# Connect as postgres user to set up billing user and database
sudo -u postgres psql << EOF
-- Create billing user and database
CREATE USER ${INVENTORY_DB_USER} WITH PASSWORD '${INVENTORY_DB_PASSWORD}';
CREATE DATABASE ${INVENTORY_DB_NAME};
GRANT ALL PRIVILEGES ON DATABASE ${INVENTORY_DB_NAME} TO ${INVENTORY_DB_USER};
ALTER DATABASE ${INVENTORY_DB_NAME} OWNER TO ${INVENTORY_DB_USER};

-- Revoke public access to the database
REVOKE ALL ON DATABASE ${INVENTORY_DB_NAME} FROM PUBLIC;
EOF

# Connect to orders database to set schema permissions
sudo -u postgres psql -d ${INVENTORY_DB_NAME} << EOF
GRANT ALL ON SCHEMA public TO ${INVENTORY_DB_USER};
EOF

echo "Billing database setup completed successfully!"