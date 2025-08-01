import EmojiPicker from "emoji-picker-react";
import React from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
const MessageBar = () => {
	const emojiRef = React.useRef();
	const [emojiPickerOpen, setEmojiPickerOpen] = React.useState(false);
	const handleEmoji = (emoji) => {
		setMessage((prev) => prev + emoji.emoji);
	};
	React.useEffect(() => { 
		function handleClickOutside(event) {
			if (emojiRef.current && !emojiRef.current.contains(event.target)) {
				setEmojiPickerOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	},[emojiRef])
	const [message, setMessage] = React.useState("");
	const handleSendMessage = async () => {};
	return (
		<div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-5 gap-6">
			<div className="flex-1 flex bg-[#2a2b33] items-center gap-5 pr-5">
				<input
					type="text"
					className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
					placeholder="Enter Message"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				<button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
					<GrAttachment className="text-2xl" />
				</button>
				<div className="relative">
					<button
						className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
						onClick={() => setEmojiPickerOpen(true)}
					>
						<RiEmojiStickerLine className="text-2xl" />
					</button>
					<div className="absolute bottom-16 right-0 "ref={emojiRef}>
						<EmojiPicker
							theme="dark"
							open={emojiPickerOpen}
							onEmojiClick={handleEmoji}
							autoFocusSearch={false}
						/>
					</div>
				</div>
			</div>
			<button
				className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 focus:border-none hover:bg-[#741bda] focus:bg-[#741bda]  focus:outline-none focus:text-white duration-300 transition-all"
				onClick={handleSendMessage}
			>
				<IoSend className="text-2xl" />
			</button>
		</div>
	);
};
export default MessageBar;
