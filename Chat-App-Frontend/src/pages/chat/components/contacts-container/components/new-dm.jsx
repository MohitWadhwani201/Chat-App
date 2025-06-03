import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { FaPlus } from "react-icons/fa";
const NewDM = () => {
    const [openNewContact, setOpenNewContact] = React.useState(false);
	return (
		<>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
                        <FaPlus className="text-neutral-500 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer tranistion-all duration-300"
                            onClick={()=>setOpenNewContact(true)}
                        />
					</TooltipTrigger>
					<TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
						Select New Contact 
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</>
	);
};
export default NewDM;
