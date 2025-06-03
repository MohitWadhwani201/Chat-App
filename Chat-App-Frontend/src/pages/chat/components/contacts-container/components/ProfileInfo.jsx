import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getColor } from "@/lib/utils";
import { HOST, LOGOUT } from "@/utils/constants";
import { useAppStore } from "@/store/index.js";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { IoLogOut, IoPowerSharp } from "react-icons/io5";
import { apiClient } from "@/lib/api-client";
const ProfileInfo = () => {
	const { userInfo, setUserInfo } = useAppStore();
	// const { userInfo } = useAppStore();
	const navigate = useNavigate();
	const logout = async () => {
		try {
			const response = await apiClient.post(LOGOUT, {}, { withCredentials: true });
			if (response.status === 200) {
				// Remove the session cookie by expiring it (redundant, but safe)
				document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
				setUserInfo(undefined); // Use undefined for consistency
				navigate("/auth");
			}
		} catch (error) {
			console.error("Error logging out:", error);
			setUserInfo(undefined);
			navigate("/auth");
		}
	};
	return (
		<div className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]">
			<div className="flex gap-3 items-center justify-center">
				<div className="w-12 h-12 relative">
					<Avatar className="h-12 w-12 rounded-full overflow-hidden">
						{userInfo.image ? (
							<AvatarImage
								src={`${HOST}/${userInfo.image}`}
								alt="profile"
								className="object-cover w-full h-full bg-black"
							/>
						) : (
							<div
								className={`uppercase  w-12 h-12 text-lg border-[1px] flex items-center justify-center ${getColor(
									userInfo.color
								)}`}
							>
								{userInfo.firstName
									? userInfo.firstName.split("").shift()
									: userInfo.email.split("").shift()}
							</div>
						)}
					</Avatar>
				</div>
				<div>{userInfo.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : ""}</div>
			</div>
			<div className="flex gap-5">
				<Tooltip>
					<TooltipTrigger>
						<FiEdit2
							className="text-red-500 text-xl font medium"
							onClick={() => navigate("/profile")}
						/>
					</TooltipTrigger>
					<TooltipContent className="bg-[#1c1b1e] border-none text-white">
						<p>Edit Profile</p>
					</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger>
						<IoPowerSharp onClick={logout} className="hover:cursor-pointer" />
					</TooltipTrigger>
					<TooltipContent className="bg-[#1c1b1e] border-none text-white">
						<p>Log Out</p>
					</TooltipContent>
				</Tooltip>
			</div>
		</div>
	);
};
export default ProfileInfo;
