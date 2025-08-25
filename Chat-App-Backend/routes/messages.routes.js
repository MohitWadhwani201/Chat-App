import { Router } from "express";
import { getMessages } from "../controllers/messages.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const messagesRoutes = Router();
messagesRoutes.post("/get-messages", verifyToken, getMessages);

export default messagesRoutes;