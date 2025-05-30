import Router from "express";
import { login, signup ,getUserInfo} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
const authRoutes = Router();

authRoutes.post("/signup", signup);

authRoutes.post("/login", login);
authRoutes.get("/user-info",verifyToken,getUserInfo);
export default authRoutes;
