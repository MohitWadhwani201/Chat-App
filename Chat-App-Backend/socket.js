import { Server as SocketIOServer } from "socket.io";
import Message from "./models/messages.model.js";
const setupSocket = (server) => {
	const io = new SocketIOServer(server, {
		cors: {
			origin: process.env.ORIGIN, // Adjust this to your frontend URL
			methods: ["GET", "POST"],
			credentials: true, // Allow cookies to be sent
		},
	});
	const userSocketMap = new Map();
	const disconnect = (socket) => {
		console.log(`User ${socket.id} disconnected`);
		for (const [userId, socketId] of userSocketMap.entries()) {
			if (socketId === socket.id) {
				userSocketMap.delete(userId);

				break;
			}
		}
	};
	const sendMessage = async (message) => {
		const senderSocketId = userSocketMap.get(message.sender);
		const recipientSocketId = userSocketMap.get(message.recipient);
		const createdMessages = await Message.create(message);
		const messageData = await Message.findById(createdMessages._id)
			.populate("sender", "id email firstName lastName image color")
			.populate("recipient", "id email firstName lastName image color");
		if (senderSocketId) {
			io.to(senderSocketId).emit("messageSent", messageData);
		}
		if (recipientSocketId) {
			io.to(recipientSocketId).emit("messageReceived", messageData);
		}
	};
	io.on("connection", (socket) => {
		const userId = socket.handshake.query.userId;
		if (userId) {
			userSocketMap.set(userId, socket.id);
			console.log(`User ${userId} connected with socket ID: ${socket.id}`);
		} else {
			console.warn("User ID not provided in handshake query");
		}
		socket.on("sendMessage", sendMessage);
		socket.on("disconnect", () => disconnect(socket));
	});
};
export default setupSocket;
