import { Router } from "express";

import { productsExpenses } from "../../controllers/personal/personalProductsExpenses.controller.js";
import { verifyAccessToken } from "../../middleware/verifyAccessToken.js";

export const personalProductExpensesRouter = Router();
personalProductExpensesRouter.get(
  "/",
  verifyAccessToken,
  productsExpenses.getAllProductsExpenses
);
personalProductExpensesRouter.get(
  "/:id",
  verifyAccessToken,
  productsExpenses.getProductsExpenses
);
personalProductExpensesRouter.post(
  "/",
  //   verifyAccessToken,
  productsExpenses.createProductsExpenses
);
personalProductExpensesRouter.patch(
  "/:id",
  verifyAccessToken,
  productsExpenses.updateProductsExpenses
);
personalProductExpensesRouter.delete(
  "/:id",
  verifyAccessToken,
  productsExpenses.deleteProductsExpenses
);
