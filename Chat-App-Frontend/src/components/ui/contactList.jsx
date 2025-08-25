import React from "react";
import { useAppStore } from "@/store/index.js";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { HOST } from "@/utils/constants";
import { getColor } from "@/lib/utils";
const ContactList = ({ contacts }) => { 
    const { selectedChatData, setSelectedChatData, setSelectedChatType, selectedChatType,setSelectedChatMessages } = useAppStore();
    const handleClick = (contact) => {
        setSelectedChatData(contact);
        setSelectedChatType("contact");
        if (selectedChatData && selectedChatData._id !== contact._id) {
            setSelectedChatMessages([]);
        }
    };
    return <div className="mt-5">{
        contacts.map(contact => (
            <div key={contact._id} className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${selectedChatData && selectedChatData._id === contact._id ? "bg-[#8417ff] hover:bg-[#8417ff]" : "hover:bg-[#f1f1f111]"} `}
                onClick={() => handleClick(contact)}
            >
                <div className="flex gap-5 items-center justify-start text-neutral-300">
                    {
                        <Avatar className="h-10 w-1Fg0 rounded-full overflow-hidden">
							{contact.image ? (
								<AvatarImage
									src={`${HOST}/${contact.image}`}
									alt="profile"
									className="object-cover w-full h-full bg-black"
								/>
							) : (
								<div
									className={`uppercase  w-10 h-10 text-lg border-[1px] flex items-center justify-center ${getColor(
										contact.color
									)}`}
								>
									{contact.firstName
										? contact.firstName.split("").shift()
										: contact.email.split("").shift()}
								</div>
							)}
						</Avatar>
                    }
                    
                        {/* <div className="bg-[ffffff22] h-10 w-10 flex items-center justify-center rounded-full">#</div> */}
                    <span>{contact.firstName} { contact.lastName }</span>
                     

                    
            </div>
            </div>
        ))}
    </div>
}
export default ContactList;