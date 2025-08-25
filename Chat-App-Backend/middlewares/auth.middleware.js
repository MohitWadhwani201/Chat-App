import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiErrors.js";
export const verifyToken = (req, res, next) => {
	const token = req.cookies.jwt;
	// console.log("Token:", req.cookies);
	if (!token) {
		throw new ApiError(401, "Unauthorized: No token provided");
	}

	jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
		if (err) {
			throw new ApiError(403, "Unauthorized: Invalid token");
		}
		req.userId = payload.userId;
		next();
	});
};
