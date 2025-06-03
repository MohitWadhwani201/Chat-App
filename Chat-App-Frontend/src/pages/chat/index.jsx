import { useAppStore } from "@/store/index.js";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; // Assuming you're using react-toastify for notifications
import ContactsContainer from "./components/contacts-container";
import EmptyChatConatainer from "./components/empty-chat-container";
import ChatConatainer from "./components/chat-container";
const Chat = () => {
	const { userInfo } = useAppStore();
	const navigate = useNavigate();
	useEffect(() => {
		if (!userInfo.profileSetup) {
			toast("Please Setup profile to continue", { closeButton: true });
			navigate("/profile");
		}
	}, [userInfo, navigate]);
	return (
		<div className="flex h-[100vh] text-white overflow-hidden">
			<ContactsContainer />
			{/* <EmptyChatConatainer /> */}
			<ChatConatainer />
		</div>
	);
};
export default Chat;
