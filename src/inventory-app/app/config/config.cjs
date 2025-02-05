require("dotenv").config({ path: "../../../../.env" });

const config = {
  development: {
    username: process.env.INVENTORY_DB_USER || "postgres",
    password: process.env.INVENTORY_DB_PASSWORD || "postgres",
    database: process.env.INVENTORY_DB_NAME || "movies",
    host: process.env.INVENTORY_DB_HOST || "localhost",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
};

module.exports = config;
