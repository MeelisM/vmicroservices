import Sequelize from "sequelize";
import config from "../config/config.cjs";
import defineOrder from "./order.model.js";

const dbConfig = config.development;

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool,
});

const db = {
  Sequelize,
  sequelize,
  orders: defineOrder(sequelize, Sequelize),
};

export default db;
