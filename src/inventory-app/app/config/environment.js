import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../../../../.env") });

const VALID_ENVIRONMENTS = ["DEVELOPMENT", "PRODUCTION"];
const environment = process.env.ENVIRONMENT || "DEVELOPMENT";

if (!VALID_ENVIRONMENTS.includes(environment)) {
  console.warn(
    `ENVIRONMENT must be one of ${VALID_ENVIRONMENTS.join(", ")}. Defaulting to DEVELOPMENT`
  );
}

const envPrefix = environment === "DEVELOPMENT" ? "DEV_" : "PROD_";

const getEnvVariable = (name, required = true) => {
  const value = process.env[`${envPrefix}${name}`];
  if (required && !value) {
    throw new Error(`Environment variable ${envPrefix}${name} is required but not set`);
  }
  return value;
};

const config = {
  environment,
  server: {
    port: getEnvVariable("INVENTORY_PORT"),
    host: getEnvVariable("INVENTORY__HOST", false) || "localhost",
  },
  database: {
    username: getEnvVariable("INVENTORY_DB_USER"),
    password: getEnvVariable("INVENTORY_DB_PASSWORD"),
    database: getEnvVariable("INVENTORY_DB_NAME"),
    host: getEnvVariable("INVENTORY_DB_HOST"),
    port: getEnvVariable("INVENTORY_DB_PORT"),
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
};

export default config;
