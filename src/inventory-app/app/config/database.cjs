const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../../.env") });

module.exports = {
  development: {
    username: process.env.INVENTORY_DB_USER || "inventory_user",
    password: process.env.INVENTORY_DB_PASSWORD || "inventory_password",
    database: process.env.INVENTORY_DB_NAME || "movies",
    host: process.env.INVENTORY_DB_HOST || "localhost",
    dialect: "postgres",
  },
  test: {
    // test environment config
  },
  production: {
    // production environment config
  },
};
