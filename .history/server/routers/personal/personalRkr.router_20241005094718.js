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
  personalRkrExpenses.getRkrExpense
);
personalRkrRouter.post(
  "/",
  verifyAccessToken,
  personalRkrExpenses.createRkrExpense
);
personalRkrRouter.patch(
  "/:id",
  verifyAccessToken,
  personalRkrExpenses.updateRkrExpense
);
personalRkrRouter.delete(
  "/:id",
  verifyAccessToken,
  personalRkrExpenses.deleteRkrExpense
);
