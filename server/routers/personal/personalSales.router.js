import { Router } from "express";

import { personalSales } from "../../controllers/personal/personalSales.controller.js";
import { verifyAccessToken } from "../../middleware/verifyAccessToken.js";

export const personalSalesRouter = Router();
personalSalesRouter.get(
  "/",
  verifyAccessToken,
  personalSales.getAllPersonalSales
);
personalSalesRouter.get(
  "/:id",
  verifyAccessToken,
  personalSales.getPersonalSales
);
personalSalesRouter.post(
  "/",
  verifyAccessToken,
  personalSales.createPersonalSales
);
personalSalesRouter.patch(
  "/:id",
  verifyAccessToken,
  personalSales.updatePersonalSales
);
personalSalesRouter.delete(
  "/:id",
  verifyAccessToken,
  personalSales.deletePersonalSales
);
