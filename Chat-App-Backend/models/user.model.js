import mongoose from "mongoose";
import { genSalt } from "bcrypt";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: [true, "email is required"],
		unique: true,
		trim: true,
		lowercase: true,
	},
	password: {
		type: String,
		required: [true, "Password is required"],
	},
	firstName: {
		type: String,
		required: [false, "First name is required"],
	},
	lastName: {
		type: String,
		required: [false, "Last name is required"],
	},
	image: {
		type: String,
		required: false,
	},
	color: {
		type: Number,
		required: false,
	},
	profileSetup: {
		type: Boolean,
		default: false,
	},
});

userSchema.pre("save", async function (next) {
	const salt = await genSalt();
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

export const User = mongoose.model("User", userSchema);
