const defineMovie = (sequelize, Sequelize) => {
  const Movie = sequelize.define("movie", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue("title", value);
      },
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  });
  return Movie;
};

export default defineMovie;
