import express from "express";
import { nightBlocker } from "./middlewares/night-blocker.js";
import { logger } from "./middlewares/logger.js";
import { visitCounter } from "./middlewares/visit-counter.js";

const app = express();
app.use(nightBlocker);
app.use(logger);
app.use(visitCounter);

app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API Monumento !");
});

app.get("/visit", (req, res) => {
  res.send(`Vous êtes le visiteur n° ${req.visit}`);
});

app.listen(3008, () => {
  console.log("API démarrée sur http://localhost:3008");
});