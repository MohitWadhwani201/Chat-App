import { useAppStore } from "@/store/index.js";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; // Assuming you're using react-toastify for notifications
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
		<div>
			<h1>Chat</h1>
		</div>
	);
};
export default Chat;
