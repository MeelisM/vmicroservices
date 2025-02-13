import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../../../.env") });

const configEnvironment = process.env.ENVIRONMENT;

if (configEnvironment !== "DEVELOPMENT" && configEnvironment !== "PRODUCTION") {
  console.warn("ENVIRONMENT must be either DEVELOPMENT or PRODUCTION. Defaulting to DEVELOPMENT");
}

const envPrefix = configEnvironment === "DEVELOPMENT" ? "DEV_" : "PROD_";

const rabbitmqConfig = {
  url: process.env[`${envPrefix}RABBITMQ_URL`],
  queue: process.env[`${envPrefix}RABBITMQ_QUEUE`],
};

export default rabbitmqConfig;
