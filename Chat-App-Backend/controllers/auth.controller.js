import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { renameSync, unlinkSync } from "fs";
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
		// console.log("User created:", user);
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
			return res.status(404).json({ message: "User not found" });
		}
		// console.log(user.password, "user password");
		const authenticated = await bcrypt.compare(password, user.password);
		// console.log(authenticated, "authenticated");
		if (!authenticated) {
			return res.status(401).json({ message: "Password is incorrect" });
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
				profileSetup: user.profileSetup,
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
export const getUserInfo = async (req, res, next) => {
	try {
		const userData = await User.findById(req.userId).select("-password");
		if (!userData) {
			throw new ApiError(404, "User not found");
		}
		return res.status(200).json({
			_id: userData._id,
			email: userData.email,
			profileSetup: userData.profileSetup,
			image: userData.image,
			firstName: userData.firstName,
			lastName: userData.lastName,
			color: userData.color,
		});
	} catch (error) {
		throw new ApiError(500, "Something went wrong during signup");
	}
};
export const updateProfile = async (req, res, next) => {
	try {
		const userId = req.userId;
		// console.log("updateProfile userId:", userId);
		if (!userId) {
			return res.status(401).json({ message: "Unauthorized: userId missing from request." });
		}
		const { firstName, lastName, color } = req.body;
		if (!firstName || !lastName || color === undefined || color === null) {
			throw new ApiError(400, "All fields are required");
		}
		const userData = await User.findByIdAndUpdate(
			userId,
			{ firstName, lastName, color, profileSetup: true },
			{ new: true, runValidators: true }
		).select("-password");
		return res.status(200).json({
			_id: userData._id,
			email: userData.email,
			profileSetup: userData.profileSetup,
			image: userData.image,
			firstName: userData.firstName,
			lastName: userData.lastName,
			color: userData.color,
		});
	} catch (error) {
		throw new ApiError(500, "Something went wrong during Update");
	}
};
export const addProfileImage = async (req, res, next) => {
	try {
		if (!req.file) {
			throw new ApiError(400, "Profile image is required");
		}
		const date = Date.now();
		let filename = "uploads/profiles/" + date + req.file.originalname;
		renameSync(req.file.path, filename);
		const updatedUser = await User.findByIdAndUpdate(
			req.userId,
			{ image: filename, profileSetup: true },
			{ new: true, runValidators: true }
		).select("-password");
		return res.status(200).json({
			image: updatedUser.image,
		});
	} catch (error) {
		throw new ApiError(500, "Something went wrong during Update");
	}
};
export const removerProfileImage = async (req, res, next) => {
	try {
		const userId = req.userId;
		const user = await User.findById(userId);
		if (!user) {
			throw new ApiError(404, "User not found");
		}
		if (user.image) {
			try {
				unlinkSync(user.image); // Remove the image file from the server
			} catch (err) {
				throw new ApiError(500, "Failed to remove image file from server");
			}
		}
		user.image = null; // Clear the image field in the database
		await user.save(); // Save the updated user document
		return res.status(200).json({ message: "Profile image removed successfully" });
	} catch (error) {
		throw new ApiError(500, "Something went wrong during Update");
	}
};
export const logout = async (req, res, next) => {
	try {
		// Set the cookie to expire in the past to ensure removal
		res.cookie("jwt", "", {
			httpOnly: true,
			secure: true,
			sameSite: "None",
			expires: new Date(0), // Expire immediately
			path: "/", // Ensure path matches where it was set
		});
		return res.status(200).json({ message: "User logged out successfully" });
	} catch (error) {
		throw new ApiError(500, "Something went wrong during logout");
	}
};
