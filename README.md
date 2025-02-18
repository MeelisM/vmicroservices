# crud-master

A simple microservices infrastructure. All services are encapsulated in different virtual machines. <br>
For the purpose of this exercise, the .env file is included in the repository.

![image](/images/diagram.jpg)

## Table of contents

- [Requirements](#requirements)
  - [Core Technologies](#core-technologies)
  - [System Requirements](#system-requirements)
- [Installation: Development](#installation-development)
  - [billing-app](#billing-app)
  - [inventory-app](#inventory-app)
  - [api-gateway](#api-gateway)
- [Installation: Production](#installation-production)
  - [Vagrant Setup](#vagrant-setup)
- [API Documentation](#api-documentation)

## Requirements

### Core Technologies

- Node.js
- PostgreSQL
- RabbitMQ
- VirtualBox
- Vagrant
- PM2

### System Requirements

- Minimum 4GB RAM (for running 3 VMs).
- ~10GB available disk space.
- Processor with virtualization support enabled.

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
./scripts/billing-app/setup-billing-db.sh
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
./scripts/inventory-app/setup-inventory-db.sh
```

Start the server.

```bash
npm run start
```

Run database migrations.

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

## Installation: Production

### Vagrant Setup

Set the production environment variable in the `.env` file.

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

The API documentation is available in OpenAPI (Swagger) format.

### Development Environment:

```http
http://localhost:8000/api-docs
```

### Production Environment:

```http
https://192.168.56.10:8000/api-docs
```
