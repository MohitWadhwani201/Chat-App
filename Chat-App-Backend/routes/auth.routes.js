import Router from "express";
import { login, signup, getUserInfo, removerProfileImage, updateProfile, addProfileImage } from "../controllers/auth.controller.js";
import multer from "multer";
import { verifyToken } from "../middlewares/auth.middleware.js";
const authRoutes = Router();
const upload = multer({ dest: "uploads/profiles/" });
authRoutes.post("/signup", signup);

authRoutes.post("/login", login);
authRoutes.get("/user-info", verifyToken, getUserInfo);
authRoutes.post("/update-user-info", verifyToken, updateProfile);
authRoutes.post("/profile-image", verifyToken, upload.single("profile-image"), addProfileImage);
authRoutes.delete("/remove-profile-image", verifyToken, removerProfileImage);
export default authRoutes;
