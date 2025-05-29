import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const maxAge = 1000 * 60 * 60 * 24 * 3; // 3 days
const createToken = (email, userId) => {
	return jwt.sign({ email, userId }, process.env.JWT_SECRET, { expiresIn: maxAge });
};
export const signup = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			throw new ApiError(400, "Email and password are required");
		}
		const user = await User.create({ email, password });
		console.log("User created:", user);
		res.cookie("jwt", createToken(email, user._id), {
			httpOnly: true,
			maxAge,
			secure: true,
			sameSite: "None",
		});
		return res.status(201).json(new ApiResponse(200, user, "User created successfully"));
	} catch (error) {
		throw new ApiError(500, "Something went wrong during signup");
	}
};
export const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			throw new ApiError(400, "Email and password are required");
		}
		const user = await User.findOne({ email });
		if (!user) {
			return new ApiError(404, "User not found");
		}
		const authenticated = await bcrypt.compare(password, user.password);
		if (!authenticated) {
			return new ApiError(401, "Password is incorrect");
		}
		res.cookie("jwt", createToken(email, user._id), {
			httpOnly: true,
			maxAge,
			secure: true,
			sameSite: "None",
		});
		return res.status(200).json({
			user: {
				_id: user._id,
				email: user.email,
				profileSet: user.profileSet,
				image: user.image,
				firstName: user.firstName,
				lastName: user.lastName,
				color: user.color,
			},
		});
	} catch (error) {
		throw new ApiError(500, "Something went wrong during signup");
	}
};
