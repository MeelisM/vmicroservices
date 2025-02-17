# crud-master

A simple microservices infrastructure. All services are encapsulated in different virtual machines. <br>
!! ------> For the purpose of this exercise, the .env file is included in the repository <------ !!

![image](/images/diagram.jpg)

## Table of contents

- [Applications](#applications)
  - [billing-app](#billing-app)
  - [inventory-app](#inventory-app)
  - [api-gateway](#api-gateway)

## Applications

### billing-app

TBA

### inventory-app

Start the server.

```
npm run start
```

Run database migrations.

```
npm run db:migrate
```

Roll back the last database migration.

```
npm run db:migrate:undo
```

Roll back all database migrations.

```
npm run db:migrate:undo:all
```

### api-gateway

TBA
