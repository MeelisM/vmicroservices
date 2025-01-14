import db from "../models/index.js";
const Movie = db.movies;
const { Op, Sequelize } = db.Sequelize;

const findAll = async (req, res) => {
  try {
    const { title } = req.query;
    let condition = null;

    if (title) {
      const searchTerm = title.trim();
      condition = {
        title: Sequelize.where(
          Sequelize.fn("LOWER", Sequelize.col("title")),
          "LIKE",
          "%" + searchTerm.toLowerCase() + "%"
        ),
      };
    }

    console.log(
      "Raw query:",
      await Movie.sequelize.query(
        Movie.queryGenerator.selectQuery("movies", {
          where: condition,
        }),
        { type: Movie.sequelize.QueryTypes.SELECT }
      )
    );

    const movies = await Movie.findAll({ where: condition });
    res.status(200).send(movies);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error occurred while retrieving movies.",
    });
  }
};

const create = async (req, res) => {
  try {
    if (!req.body.title) {
      res.status(400).send({
        message: "Title cannot be empty!",
      });
      return;
    }

    const movie = await Movie.create({
      title: req.body.title,
      description: req.body.description,
    });
    res.status(201).send(movie);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error occurred while creating the movie.",
    });
  }
};

export { findAll, create };
