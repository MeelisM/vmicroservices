import { Sequelize } from "sequelize";
import config from "./config.cjs";

const dbConfig = config.envValues;

export async function checkDatabaseExists() {
  const tempSequelize = new Sequelize({
    ...dbConfig,
    database: "postgres",
    logging: false,
  });

  try {
    await tempSequelize.authenticate();
    const [results] = await tempSequelize.query(
      `SELECT 1 FROM pg_database WHERE datname = '${dbConfig.database}'`
    );

    if (results.length === 0) {
      throw new Error(
        `Database ${dbConfig.database} does not exist. Run billing-db-setup.sh first.`
      );
    }

    console.log(`Database ${dbConfig.database} exists, proceeding with connection`);
  } finally {
    await tempSequelize.close();
  }
}

export default dbConfig;
