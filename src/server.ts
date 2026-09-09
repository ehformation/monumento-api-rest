import express from "express";
import { nightBlocker } from "./middlewares/night-blocker.js";
import { logger } from "./middlewares/logger.js";
import { visitCounter } from "./middlewares/visit-counter.js";
import { env } from "./config/env.js";
import { monumentRouter } from "./routes/monument.routes.js";
import { authRouter } from "./routes/auth.routes.js";

// Import models to ensure they are registered with Sequelize
import "./models/monument.model.js";
import "./models/user.model.js";

import { initDatabase } from "./db/sequelize.js";
import { errorHandler } from "./middlewares/error-handler.js";
import { requireAuth } from "./middlewares/require-auth.js";

// Initialize the database
await initDatabase();

//Express app setup
const app = express();
app.use(express.json());

// Middlewares
app.use(nightBlocker);
app.use(logger);
app.use(visitCounter);

// Routes
app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API Monumento !");
});
// Routes for monuments
app.use("/auth", authRouter);
app.use("/monuments", requireAuth, monumentRouter);

app.get("/visit", (req, res) => {
  res.send(`Vous êtes le visiteur n° ${req.visit}`);
});

// Error Middlewares 
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`API démarrée sur http://localhost:${env.PORT}`);
});