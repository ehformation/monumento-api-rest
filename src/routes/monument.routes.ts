import { Router } from "express";
import * as monumentController from "../controllers/monument.controller.js";

export const monumentRouter = Router();

monumentRouter.get("/", monumentController.findAll);
