import { Router } from "express";

import { verifyAccessToken } from "../../middleware/verifyAccessToken.js";
import { personalProductsExpenses } from "../../controllers/personal/personalProductsExpenses.controller.js";

export const personalProductExpensesRouter = Router();
personalProductExpensesRouter.get(
  "/",
  verifyAccessToken,
  personalProductsExpenses.getAllPersonalProductsExpenses
);
personalProductExpensesRouter.get(
  "/:id",
  verifyAccessToken,
  personalProductsExpenses.getPersonalProductsExpenses
);
personalProductExpensesRouter.post(
  "/",
  //   verifyAccessToken,
  personalProductsExpenses.createPersonalProductsExpenses
);
personalProductExpensesRouter.patch(
  "/:id",
  verifyAccessToken,
  personalProductsExpenses.updatePersonalProductsExpenses
);
personalProductExpensesRouter.delete(
  "/:id",
  verifyAccessToken,
  personalProductsExpenses.deletePersonalProductsExpenses
);
