import ChatHeader from "./sub-componenets/Chatheader";
import MessageBar from "./sub-componenets/MessageBar";
import MessageContainer from "./sub-componenets/MessageConatiner";
const ChatConatainer = () => {
	return (
		<div className="fixed top-0 h-[100vh] w-[100vw] bg-[#1c1d25] flex flex-col md:static md:flex-1">
			<ChatHeader />
			<MessageContainer />
			<MessageBar />
		</div>
	);
};
export default ChatConatainer;
