import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../../../../.env") });

const requiredEnvVars = [
  "INVENTORY_DB_HOST",
  "INVENTORY_DB_USER",
  "INVENTORY_DB_PASSWORD",
  "INVENTORY_DB_NAME",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export default {
  db: {
    HOST: process.env.INVENTORY_DB_HOST,
    USER: process.env.INVENTORY_DB_USER,
    PASSWORD: process.env.INVENTORY_DB_PASSWORD,
    DB: process.env.INVENTORY_DB_NAME,
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
};
