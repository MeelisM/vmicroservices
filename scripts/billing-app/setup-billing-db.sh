#!/bin/bash

# Define colors
LIGHTGREEN='\033[1;32m' # Success message
LIGHTBLUE='\033[1;36m' # General message
NC='\033[0m' # No Color 

echo -e "${LIGHTBLUE}Starting the setup-billing script!${NC}"

# Function to load environment variables
load_env_vars() {
    local current_dir="$1"
    while [ "$current_dir" != "/" ]; do
        if [ -f "$current_dir/.env" ]; then
            echo -e "${LIGHTBLUE}Found .env at: $current_dir/.env${NC}"
            
            export $(cat "$current_dir/.env" | sed 's/#.*//g' | xargs)
            
            if [ "$ENVIRONMENT" = "PRODUCTION" ]; then
                export BILLING_DB_USER="$PROD_BILLING_DB_USER"
                export BILLING_DB_PASSWORD="$PROD_BILLING_DB_PASSWORD"
                export BILLING_DB_NAME="$PROD_BILLING_DB_NAME"
            else
                export BILLING_DB_USER="$DEV_BILLING_DB_USER"
                export BILLING_DB_PASSWORD="$DEV_BILLING_DB_PASSWORD"
                export BILLING_DB_NAME="$DEV_BILLING_DB_NAME"
            fi
            
            echo -e "${LIGHTBLUE}Verifying variables after loading:${NC}"
            echo -e "${LIGHTBLUE}Environment: $ENVIRONMENT${NC}"
            echo -e "${LIGHTBLUE}BILLING_DB_USER=${BILLING_DB_USER}${NC}"
            echo -e "${LIGHTBLUE}BILLING_DB_NAME=${BILLING_DB_NAME}${NC}"
            return 0
        fi
        current_dir="$(dirname "$current_dir")"
    done
    return 1
}

# If variables aren't already set, try to load them
if [ -z "$BILLING_DB_USER" ] || [ -z "$BILLING_DB_PASSWORD" ] || [ -z "$BILLING_DB_NAME" ]; then
    echo -e "${LIGHTBLUE}Variables not set, attempting to load from .env${NC}"
    SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
    load_env_vars "$SCRIPT_DIR"
fi

# Check if we have the required variables
if [ -z "$BILLING_DB_USER" ] || [ -z "$BILLING_DB_PASSWORD" ] || [ -z "$BILLING_DB_NAME" ]; then
    echo -e "${LIGHTBLUE}Required environment variables are not set!${NC}"
    exit 1
fi

echo -e "${LIGHTBLUE}Setting up database with:${NC}"
echo -e "${LIGHTBLUE}User: $BILLING_DB_USER${NC}"
echo -e "${LIGHTBLUE}Database: $BILLING_DB_NAME${NC}"

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

echo -e "${LIGHTGREEN}##### Billing database setup completed successfully! #####${NC}"