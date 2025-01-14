import Sequelize from "sequelize";
import defineMovie from "./movie.model.js";
import dbConfig from "../config/db.config.js";

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool,
});

const db = {
  Sequelize,
  sequelize,
  movies: defineMovie(sequelize, Sequelize),
};

export default db;
