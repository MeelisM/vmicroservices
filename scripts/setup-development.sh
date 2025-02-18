#!/bin/bash

LIGHTGREEN='\033[1;32m' # Success message
LIGHTBLUE='\033[1;36m' # General message
NC='\033[0m' # No Color 
PROJECT_ROOT=$(git rev-parse --show-toplevel)

echo -e "${LIGHTBLUE}Starting the setup-development script!${NC}"

# Install required packages
cd "$PROJECT_ROOT/src/inventory-app"
echo -e "${LIGHTBLUE}Installing inventory-app packages${NC}"
npm install

cd "$PROJECT_ROOT/src/billing-app"
echo -e "${LIGHTBLUE}Installing billing-app packages${NC}"
npm install

cd "$PROJECT_ROOT/src/api-gateway"
echo -e "${LIGHTBLUE}Installing api-gateway packages${NC}"
npm install

echo -e "${LIGHTGREEN}##### Finished installing npm packages #####${NC}"

# Setup inventory-app and billing-app databases
cd "$PROJECT_ROOT/scripts/inventory-app"
echo -e "${LIGHTBLUE}Setting up inventory-app database...${NC}"
chmod +x setup-inventory-db.sh
./setup-inventory-db.sh

cd "$PROJECT_ROOT/scripts/billing-app"
echo -e "${LIGHTBLUE}Setting up billing-app database...${NC}"
chmod +x setup-billing-db.sh
./setup-billing-db.sh

# Start inventory-app, billing-app and api-gateway 
echo -e "${LIGHTBLUE}Starting inventory-app...${NC}"
cd "$PROJECT_ROOT/src/inventory-app/"
npm run start &
sleep 2

echo -e "${LIGHTBLUE}Starting billing-app...${NC}"
cd "$PROJECT_ROOT/src/billing-app/"
npm run start &
sleep 2

echo -e "${LIGHTBLUE}Starting api-gateway...${NC}"
cd "$PROJECT_ROOT/src/api-gateway/"
npm run start &
sleep 2
echo -e "${LIGHTGREEN}##### inventory-app, billing-app and api-gateway are up and running! #####${NC}"

wait
