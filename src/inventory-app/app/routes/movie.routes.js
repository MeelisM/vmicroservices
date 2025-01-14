import express from "express";
import * as movies from "../controllers/movie.controller.js";

const router = express.Router();

router.post("/", movies.create);
router.get("/", movies.findAll);

export default function (app) {
  app.use("/api/movies", router);
}
