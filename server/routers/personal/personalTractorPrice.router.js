import { Router } from "express";

import {
  createPersonalTractorPrice,
  deletePersonalTractorPrice,
  getAllPersonalTractorPrices,
  getPersonalTractorPrice,
  updatePersonalTractorPrice,
} from "../../controllers/personal/personalTractorPrice.controller.js";
import { verifyAccessToken } from "../../middleware/verifyAccessToken.js";

export const personalTractorPriceRouter = Router();
personalTractorPriceRouter.get(
  "/",
  verifyAccessToken,
  getAllPersonalTractorPrices
);
personalTractorPriceRouter.get(
  "/:id",
  verifyAccessToken,
  getPersonalTractorPrice
);
personalTractorPriceRouter.post(
  "/",
  verifyAccessToken,
  createPersonalTractorPrice
);
personalTractorPriceRouter.patch(
  "/:id",
  verifyAccessToken,
  updatePersonalTractorPrice
);
personalTractorPriceRouter.delete(
  "/:id",
  verifyAccessToken,
  deletePersonalTractorPrice
);
