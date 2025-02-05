require("dotenv").config({ path: "../../../../.env" });

module.exports = {
  development: {
    username: process.env.BILLING_DB_USER || "billing_user",
    password: process.env.BILLING_DB_PASSWORD || "billing_password",
    database: process.env.BILLING_DB_NAME || "orders",
    host: process.env.BILLING_DB_HOST || "localhost",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
};
