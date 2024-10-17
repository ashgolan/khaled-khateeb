import { Router } from "express";

import { verifyAccessToken } from "../../middleware/verifyAccessToken.js";
import { personalInvestmentsController } from "../../controllers/personal/personalInvestment.controller.js";

export const personalInvestmentRouter = Router();
personalInvestmentRouter.get(
  "/",
  verifyAccessToken,
  personalInvestmentsController.getAllPersonalInvestments
);
personalInvestmentRouter.get(
  "/:id",
  verifyAccessToken,
  personalInvestmentsController.getPersonalInvestment
);
personalInvestmentRouter.post(
  "/",
  //   verifyAccessToken,
  personalInvestmentsController.createPersonalInvestment
);
personalInvestmentRouter.patch(
  "/:id",
  verifyAccessToken,
  personalInvestmentsController.updatePersonalInvestment
);
personalInvestmentRouter.delete(
  "/:id",
  verifyAccessToken,
  personalInvestmentsController.deletePersonalInvestment
);
