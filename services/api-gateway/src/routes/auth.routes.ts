import { Router } from "express";

import { AuthController } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

const authController = new AuthController();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/profile", requireAuth, authController.profile);

export default router;
