import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../../../.env") });

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
    port: getEnvVariable("GATEWAY_PORT"),
    inventoryUrl: getEnvVariable("INVENTORY_URL"),
    host: getEnvVariable("GATEWAY_BASE_URL"),
  },
  rabbitmq: {
    localUrl: getEnvVariable("RABBITMQ_URL"),
    queue: getEnvVariable("RABBITMQ_QUEUE"),
  },
};

export default config;
