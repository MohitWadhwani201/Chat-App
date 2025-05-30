import { useAppStore } from "@/store/index.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5"; // Assuming you're using react-icons for icons
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { FaPlus, FaTrash } from "react-icons/fa";
import { getColor,colors } from "@/lib/utils.js"; // Assuming you have a utility function to get color based on user info
const Profile = () => {
	const navigate = useNavigate();
	const { userInfo, setUserInfor } = useAppStore();
	const [firstName, setFirstName] = useState(userInfo?.firstName || "");
	const [lastName, setLastName] = useState(userInfo?.lastName || "");
	const [image, setImage] = useState(userInfo?.image || null);
	const [hovered, setHovered] = useState(false);
	const [color, setColor] = useState(userInfo?.color || "#000000");
	// console.log("User Info:", userInfo);
	const saveChanges = async () => {};

	return (
		<div className="bg-[#1b1c24] h-[100vh] flex flex-col items-center justify-center gap-10 ">
			<div className="flex flex-col gap-10 w-[80vw] md:w-max">
				<div>
					<IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer" />
				</div>
				<div className="grid grid-cols-2">
					<div
						className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
						onMouseEnter={() => setHovered(true)}
						onMouseLeave={() => setHovered(false)}
					>
						<Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
							{image ? (
								<AvatarImage
									src={image}
									alt="prodfile"
									className="object-cover w-full h-full bg-black"
								/>
							) : (
								<div
									className={`uppercase h-32 w-32 md:h-48 md:w-48 text-5xl border-1px flex items-center justify-center rounded-full ${getColor(
										color
									)}`}
								>
									{" "}
									{firstName
										? firstName.splut("").shift()
										: userInfo.email.split("").shift()}
								</div>
							)}
						</Avatar>
						{hovered && (
							<div className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full">
								{image ? (
									<FaTrash className="text-white text-3xl cursor-pointer" />
								) : (
									<FaPlus className="text-white text-3xl cursor-pointer" />
								)}
							</div>
						)}
						{/* <input type="text"/> */}
					</div>
					<div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center ">
						<div className="w-full">
              <Input placeholder="Email" type="email" disabled value={ userInfo.email} className="rounded-lg p-g bg-[2c2e3b] border-none" />
            </div>
            <div className="w-full">
              <Input placeholder="First Name" type="text" onChange={e=>setFirstName(e.target.value)}  value={ firstName} className="rounded-lg p-g bg-[2c2e3b] border-none" />
            </div>
            <div className="w-full">
              <Input placeholder="Last Name" type="text" onChange={e=>setLastName(e.target.value)} value={lastName} className="rounded-lg p-g bg-[2c2e3b] border-none" />
            </div>
            <div className="w-full flex gap-5 ">
              {
                colors.map((color, index) => <div className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${color===index ? " outline outline-white outline-4":""}`} key={index}></div>)
              }
            </div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Profile;
