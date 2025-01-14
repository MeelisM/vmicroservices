import { Sequelize } from "sequelize";
import dbConfig from "./database.cjs";

async function setupDatabase() {
  const config = dbConfig.development;

  try {
    const tempSequelize = new Sequelize({
      ...config,
      database: "postgres",
      logging: false,
    });

    try {
      await tempSequelize.authenticate();
      const [results] = await tempSequelize.query(
        `SELECT 1 FROM pg_database WHERE datname = '${config.database}'`
      );

      if (results.length === 0) {
        console.log(
          `##### Database ${config.database} not found! Please run postgres-setup.sh first`
        );
        throw new Error(
          `Database ${config.database} does not exist. Run postgres-setup.sh to create it.`
        );
      }

      console.log(
        `##### Database ${config.database} exists, proceeding with connection`
      );
    } finally {
      await tempSequelize.close();
    }
  } catch (error) {
    console.error("Error setting up database:", error);
    throw error;
  }
}

export default setupDatabase;
