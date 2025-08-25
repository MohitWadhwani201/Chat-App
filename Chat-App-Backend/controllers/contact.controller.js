import {User} from "../models/user.model.js";
import mongoose from "mongoose";
import {ApiError} from "../utils/ApiErrors.js";
import Message from "../models/messages.model.js";
export const searchContacts = async (req, res, next) => {
	try {
		const { searchTerm } = req.body;
		if (!searchTerm || searchTerm === null || searchTerm.trim() === "") {
			return res.status(400).send("Search term is required");
		}
		const sanitizedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special characters
		const regex = new RegExp(sanitizedSearchTerm, "i"); // Case-insensitive search
		const contacts = await User.find({
			$and: [
				{
					_id: { $ne: req.userId },
				},
				{
					$or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
				},
			],
		});
		return res.status(200).json({ contacts });
		return res.status(200).json({ message: "User logged out successfully" });
	} catch (error) {
		throw new ApiError(500, "Something went wrong during logout");
	}
};


export const getContactsforDMList = async (req, res, next) => {
	try {
		let { userId } = req;
		userId = new mongoose.Types.ObjectId(userId);
		const contacts = await Message.aggregate([
			{
				$match: {
					$or: [{ sender: userId }, { recipient: userId }],
				},
			},
			{
				$sort: { timestamp: -1 },
			},
			{
				$group: {
					_id: {
						$cond: { if: { $eq: ["$sender", userId] }, then: "$recipient", else: "$sender" }
					},
					lastMessageTime: { $first: "$timestamp"},
				},
			},
			{
				$lookup: {
					from: "users",
					localField: "_id",
					foreignField: "_id",
					as: "contactInfo",
				},
			},
			{
				$unwind: "$contactInfo",
			},
			{
				$project: {
					_id: 1,
					lastMessageTime: 1,
					email: "$contactInfo.email",
					firstName: "$contactInfo.firstName",
					lastName: "$contactInfo.lastName",
					image: "$contactInfo.image",
					color: "$contactInfo.color",
				},
			},
			{
				$sort: { lastMessageTime: -1 },
			},
		]);
		return res.status(200).json({ contacts });
		// return res.status(200).json({ message: "User logged out successfully" });
	} catch (error) {
		throw new ApiError(500, "Something went wrong during search");
	}
};
