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
    port: getEnvVariable("BILLING_PORT"),
    host: getEnvVariable("BILLING_HOST", false) || "localhost",
  },
  database: {
    username: getEnvVariable("BILLING_DB_USER"),
    password: getEnvVariable("BILLING_DB_PASSWORD"),
    database: getEnvVariable("BILLING_DB_NAME"),
    host: getEnvVariable("BILLING_DB_HOST"),
    port: getEnvVariable("BILLING_DB_PORT"),
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
  rabbitmq: {
    localUrl: getEnvVariable("RABBITMQ_LOCAL_URL"),
    queue: getEnvVariable("RABBITMQ_QUEUE"),
  },
};

export default config;
