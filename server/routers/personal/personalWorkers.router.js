import { Router } from "express";

import { personalWorkers } from "../../controllers/personal/personalWorkers.controller.js";
import { verifyAccessToken } from "../../middleware/verifyAccessToken.js";

export const personalWorkersRouter = Router();
personalWorkersRouter.get(
  "/",
  verifyAccessToken,
  personalWorkers.getAllPersonalWorkers
);
personalWorkersRouter.get(
  "/:id",
  verifyAccessToken,
  personalWorkers.getPersonalWorkers
);
personalWorkersRouter.post(
  "/",
  verifyAccessToken,
  personalWorkers.createPersonalWorkers
);
personalWorkersRouter.patch(
  "/:id",
  verifyAccessToken,
  personalWorkers.updatePersonalWorkers
);
personalWorkersRouter.delete(
  "/:id",
  verifyAccessToken,
  personalWorkers.deletePersonalWorkers
);
