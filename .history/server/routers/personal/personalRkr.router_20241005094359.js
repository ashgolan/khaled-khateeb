import { Router } from "express";

import { personalRkrExpenses } from "../../controllers/personal/personalRkrExpenses.controller.js";
import { verifyAccessToken } from "../../middleware/verifyAccessToken.js";

export const personalRkrRouter = Router();
personalRkrRouter.get(
  "/",
  verifyAccessToken,
  personalRkrExpenses.getAllRkrExpenses
);
personalRkrRouter.get(
  "/:id",
  verifyAccessToken,
  personalRkrExpenses.
);
personalRkrRouter.post(
  "/",
  verifyAccessToken,
  personalRkrExpenses.getRkrExpense
);
personalRkrRouter.patch(
  "/:id",
  verifyAccessToken,
  personalRkrExpenses.updateProductsExpenses
);
personalRkrRouter.delete(
  "/:id",
  verifyAccessToken,
  personalRkrExpenses.deleteProductsExpenses
);
