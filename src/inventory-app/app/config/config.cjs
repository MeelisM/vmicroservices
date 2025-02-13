require("dotenv").config({ path: "../../.env" });

const configEnvironment = process.env.ENVIRONMENT;

if (configEnvironment !== "DEVELOPMENT" && configEnvironment !== "PRODUCTION") {
  console.warn("ENVIRONMENT must be either DEVELOPMENT or PRODUCTION. Defaulting to DEVELOPMENT");
}

const envPrefix = configEnvironment === "DEVELOPMENT" ? "DEV_" : "PROD_";

const config = {
  envValues: {
    username: process.env[`${envPrefix}INVENTORY_DB_USER`],
    password: process.env[`${envPrefix}INVENTORY_DB_PASSWORD`],
    database: process.env[`${envPrefix}INVENTORY_DB_NAME`],
    host: process.env[`${envPrefix}INVENTORY_DB_HOST`],
    port: process.env[`${envPrefix}INVENTORY_DB_PORT`],
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
