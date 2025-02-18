# crud-master

A simple microservices infrastructure. All services are encapsulated in different virtual machines. <br>
For the purpose of this exercise, the .env file is included in the repository.

![image](/images/diagram.jpg)

## Table of contents

- [Core Technologies](#core-technologies)
- [Installation: Development](#installation-development)
  - [billing-app](#billing-app)
  - [inventory-app](#inventory-app)
  - [api-gateway](#api-gateway)
- [Database Migrations](#database-migrations)
- [Installation: Production](#installation-production)
  - [System Requirements](#system-requirements)
  - [Vagrant Setup](#vagrant-setup)
- [API Documentation](#api-documentation)
- [Testing and Documentation Tools](#testing-and-documentation-tools)

## Core Technologies

- Node.js
- PostgreSQL
- RabbitMQ
- VirtualBox
- Vagrant
- PM2
- Postman

## Installation: Development

This project can be run in either development or production mode. The mode is controlled by the `ENVIRONMENT` variable in the `.env` file.

For this exercise, a pre-filled `.env` file is included in the repository.

The easiest way to get everything up and running is to run a single script that installs all the required packages, creates databases with users, performs database migrations and starts all 3 applications. Make sure that the `.env` file `ENVIRONMENT` value is set to `DEVELOPMENT`.<br>
If you don't have a local PostgreSQL database set up, be sure to update the `.env` file. Databases run locally for both development and production environments.

```
./scripts/setup-development.sh
```

### billing-app

Set the production environment variable in the `.env` file.

```bash
ENVIRONMENT=DEVELOPMENT
```

Navigate to the correct directory.

```bash
cd src/billing-app/
```

Install the required packages.

```bash
npm install
```

Setup the database.

```bash
 cd ../.. && ./scripts/billing-app/setup-billing-db.sh
```

Run database migrations.

```bash
cd src/inventory-app/ && npm run db:migrate
```

Start the server.

```bash
npm run start
```

### inventory-app

Navigate to the correct directory.

```bash
cd src/inventory-app/
```

Install the required packages.

```bash
npm install
```

Setup the database.

```bash
 cd ../.. && ./scripts/inventory-app/setup-inventory-db.sh
```

Run database migrations.

```bash
cd src/inventory-app/ && npm run db:migrate
```

Start the server.

```bash
npm run start
```

### api-gateway

Navigate to the correct directory.

```bash
cd src/api-gateway/
```

Install the required packages.

```bash
npm install
```

Start the server.

```bash
npm run start
```

## Database Migrations

`billing-app` and `inventory-app` use PostgreSQL database and have migrations set up with `Sequalize`. Make sure to be in the correct application folder.

Run database migrations

```bash
npm run db:migrate
```

Roll back the last database migration.

```bash
npm run db:migrate:undo
```

Roll back all database migrations.

```bash
npm run db:migrate:undo:all
```

## Installation: Production

### System Requirements

- Minimum 4GB RAM (for running 3 VMs).
- ~10GB available disk space.
- Processor with virtualization support enabled.

### Vagrant Setup

Set the environment variable in the `.env` file.

```bash
ENVIRONMENT=PRODUCTION
```

Start the virtual machines.

```bash
vagrant up
```

This will automatically:

- Configure all three virtual machines (gateway-vm, inventory-vm, billing-vm).
- Set up PostgreSQL databases.
- Configure RabbitMQ.
- Start all services using PM2.
  You can check the status of the virtual machines and services:

```bash
vagrant status # Check VM status
vagrant ssh <vm-name> # SSH into specific VM
sudo pm2 list # Check running services
```

## API Documentation

The API is documented using OpenAPI 3.0 specification (`openapi.yaml`). The documentation includes:

- Complete endpoint descriptions
- Request/response schemas
- Example payloads
- Error responses

The documentation runs on the `Gateway VM` and provides a comprehensive overview of all available endpoints and their functionality.

### Development Environment:

```http
http://localhost:8000/api-docs
```

### Production Environment:

```http
https://192.168.56.10:8000/api-docs
```

## Testing and Documentation Tools

### Postman Collections

The project includes comprehensive Postman collections for testing all API endpoints. It also includes two sets of environment variables. These can be used to test both `production` and `development` endpoints with the same Postman collection.

- Gateway Tests
  - Movies (CRUD operations)
  - Billing (Order creation)
- Direct API Tests
  - Inventory API (direct testing of movie service)
- Test Suites
  - Movie CRUD sequence
    1. DELETE All Movies (Clean Start)
    2. GET All Movies (Verify Empty)
    3. Create Movie
    4. Get Movie by ID
    5. Update Movie by ID
    6. Get Movie by Title
    7. Delete Movie by ID

<details>
<summary>Click to view Postman image</summary>
![image](/images/postman.png)
</details>

### Testing RabbitMQ Queue

To test the billing queue functionality:

- Send order while billing-app is running

  - Verify order appears in database

- Stop billing-app: `pm2 stop billing-app`

  - Send order
  - Verify Gateway accepts it

- Start billing-app: `pm2 start billing-app`

  - Verify queued order appears in database
