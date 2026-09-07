import express from "express";
import { nightBlocker } from "./middlewares/night-blocker.js";
import { logger } from "./middlewares/logger.js";

const app = express();
app.use(nightBlocker);
app.use(logger);

app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API Monumento !");
});

app.listen(3008, () => {
  console.log("API démarrée sur http://localhost:3008");
});