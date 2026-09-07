import type { RequestHandler } from "express";

export const nightBlocker: RequestHandler = (req, res, next) => {
  const hour = new Date().getHours();
  console.log(`Current hour: ${hour}`);

  if (hour >= 14 && hour < 16) {
    res.status(503).json({
      message: "Le serveur est en cours de maintenance",
      data: null,
    });
    return;
  }

  next();
};