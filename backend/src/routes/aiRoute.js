import express from "express";
import { protectedRoute } from "../middleware/middleware.js";
import { chatWithAi } from "../controller/aicontroller.js";

const router = express.Router();

router.post("/chat", protectedRoute, chatWithAi);

export default router;
