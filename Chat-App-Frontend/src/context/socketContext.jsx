import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAppStore } from "../store/index.js";
import { HOST } from "@/utils/constants";
const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
	const socket = useRef(null);
	const { userInfo } = useAppStore();

	useEffect(() => {
		if (userInfo) {
			socket.current = io(HOST, { withCredentials: true, query: { userId: userInfo._id } });
			socket.current.on("connect", () => {
				// console.log("Socket connected:", socket.current.id);
			});
			const handleMessage = (message) => {
				const { selectedChatData, selectedChatType, addMessage } = useAppStore.getState();
				// console.log("Received message:", message);
				// console.log(selectedChatData, selectedChatType);
				if (
					selectedChatType !== undefined &&
					(selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id)
				) {
					// If the message is for the currently selected chat, update the chat state
					// console.log("Received message for selected chat:", message);
					addMessage(message);
				}
			};
			socket.current.on("messageReceived", handleMessage);
			
			socket.current.on("messageSent", handleMessage);
			return () => {
				socket.current.disconnect();
			};		}
	}, [userInfo]);

	return <SocketContext.Provider value={socket.current}>{children}</SocketContext.Provider>;
};
