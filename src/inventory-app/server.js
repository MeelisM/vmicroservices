import express from "express";
import db from "./app/models/index.js";
import initializeRoutes from "./app/routes/movie.routes.js";
import { checkDatabaseExists } from "./app/config/db.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
initializeRoutes(app);

async function initializeApp() {
  try {
    await checkDatabaseExists();
    await db.sequelize.sync();
    console.log("##### Database synchronized successfully");

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`##### Server is running on port ${PORT}.`);
      console.log("##### CTRL + C to quit.");
    });
  } catch (err) {
    console.error("##### Failed to initialize application:", err);
    process.exit(1);
  }
}

initializeApp();
