import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js";
import contactRouter from "./routes/contact.routes.js";
import setupSocket  from "./socket.js";
import messageRoutes from "./routes/messages.routes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL;

app.use(
	cors({
		origin: process.env.ORIGIN, // Adjust this to your frontend URL
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
		credentials: true, // Allow cookies to be sent
	})
);
app.use("/uploads/profiles", express.static("uploads/profiles"));
const server = app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
setupSocket(server);
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRouter);
app.use("/api/messages",messageRoutes )
// Global error handler
app.use((err, req, res, next) => {
	// console.error("global error ", err);
	res.status(err.statusCode || 500).json({
		success: false,
		message: err.message || "Internal Server Error",
		error: process.env.NODE_ENV === "development" ? err : undefined,
	});
});

mongoose.connect(DATABASE_URL)
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((error) => {
		console.error("Error connecting to MongoDB:", error);
	});
