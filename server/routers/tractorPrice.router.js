import { Router } from "express";
import { verifyAccessToken } from "../middleware/verifyAccessToken.js";
import {
  createTractorPrice,
  deleteTractorPrice,
  getAllTractorPrices,
  getTractorPrice,
  updateTractorPrice,
} from "../controllers/tractorPrice.controller.js";

export const tractorPriceRouter = Router();
tractorPriceRouter.get("/", verifyAccessToken, getAllTractorPrices);
tractorPriceRouter.get("/:id", verifyAccessToken, getTractorPrice);
tractorPriceRouter.post("/", verifyAccessToken, createTractorPrice);
tractorPriceRouter.patch("/:id", verifyAccessToken, updateTractorPrice);
tractorPriceRouter.delete("/:id", verifyAccessToken, deleteTractorPrice);
