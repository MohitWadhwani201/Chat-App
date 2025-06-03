import { useAppStore } from "@/store/index.js";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { FaPlus, FaTrash } from "react-icons/fa";
import { getColor, colors } from "@/lib/utils.js";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { UPDATE_USER_INFO, HOST, PROFILE_IMAGE_ROUTE, REMOVE_PROFILE_IMAGE } from "@/utils/constants";

const Profile = () => {
	const navigate = useNavigate();
	const { userInfo, setUserInfo } = useAppStore();
	const [firstName, setFirstName] = useState(userInfo?.firstName || "");
	const [lastName, setLastName] = useState(userInfo?.lastName || "");
	const [image, setImage] = useState(userInfo?.image || null);
	const [hovered, setHovered] = useState(false);
	const [color, setColor] = useState(userInfo?.color || 0);
	const fileInputRef = useRef(null);

	useEffect(() => {
		if (userInfo && userInfo.profileSetup) {
			setFirstName(userInfo.firstName || "");
			setLastName(userInfo.lastName || "");
			setColor(userInfo.color ?? 0);
		}
		if (userInfo && userInfo.image) {
			setImage(`${HOST}/${userInfo.image}`);
		}
		// Only run when userInfo changes reference, not on every field change
	}, [userInfo]);

	const validateProfile = () => {
		if (!firstName || !lastName) {
			toast.error("First Name and Last Name are required.");
			return false;
		}
		return true;
	};

	const saveChanges = async () => {
		if (validateProfile()) {
			try {
				const response = await apiClient.post(
					UPDATE_USER_INFO,
					{ firstName, lastName, color },
					{ withCredentials: true }
				);
				if (response.status === 200 && response.data) {
					toast.success("Profile updated successfully.");
					setUserInfo({ ...response.data });
					navigate("/chat");
				}
			} catch (error) {
				console.error("Error saving profile:", error);
			}
		}
	};

	const handleNavigate = () => {
		if (userInfo.profileSetup) {
			navigate("/chat");
		} else {
			toast.error("Please complete your profile setup first.");
		}
	};

	const handleFileInput = () => {
		fileInputRef.current.click();
	};

	const handleFileChange = async (event) => {
		const file = event.target.files[0];
		if (file) {
			const formData = new FormData();
			formData.append("profile-image", file);
			const response = await apiClient.post(PROFILE_IMAGE_ROUTE, formData, { withCredentials: true });
			if (response.status === 200 && response.data.image) {
				setUserInfo({ ...userInfo, image: response.data.image });
				toast.success("Profile image updated successfully.");
			}
			const reader = new FileReader();
			reader.onloadend = () => {
				setImage(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleDeleteFile = async () => {
		try {
			const response = await apiClient.delete(REMOVE_PROFILE_IMAGE, { withCredentials: true });
			if (response.status === 200) {
				setUserInfo({ ...userInfo, image: null });
				setImage(null);
				toast.success("Profile image deleted successfully.");
			}
		} catch (error) {
			console.error("Error deleting profile image:", error);
		}
	};

	const selectedColorClass = `${getColor(color)} bg-opacity-80`;

	return (
		<div
			className={`min-h-screen flex items-center justify-center py-12 px-4 transition-all duration-300 bg-[#121212] ${selectedColorClass}`}
		>
			<div className="w-full max-w-4xl bg-[#1e1e2e] rounded-2xl shadow-lg p-8 space-y-10">
				<div className="flex items-center gap-4 cursor-pointer" onClick={handleNavigate}>
					<IoArrowBack className="text-3xl text-white/90 hover:text-white transition" />
					<span className="text-white text-lg font-medium">Back to Chat</span>
				</div>
				<div className="grid md:grid-cols-2 gap-8">
					<div
						className="relative flex items-center justify-center"
						onMouseEnter={() => setHovered(true)}
						onMouseLeave={() => setHovered(false)}
					>
						<Avatar className="h-40 w-40 md:h-56 md:w-56 border-4 border-white shadow-xl">
							{image ? (
								<AvatarImage
									src={image}
									alt="profile"
									className="object-cover w-full h-full rounded-full"
								/>
							) : (
								<div
									className={`uppercase text-6xl w-full h-full flex items-center justify-center rounded-full ${getColor(
										color
									)}`}
								>
									{firstName ? firstName.charAt(0) : userInfo.email.charAt(0)}
								</div>
							)}
						</Avatar>
						{hovered && (
							<div
								onClick={image ? handleDeleteFile : handleFileInput}
								className="absolute inset-y-0 inset-x-20 bg-black/60 flex items-center justify-center rounded-full shadow-inner transition"
							>
								<div className="bg-white/20 backdrop-blur-md p-3 rounded-full shadow-lg">
									{image ? (
										<FaTrash className="text-white text-2xl" />
									) : (
										<FaPlus className="text-white text-2xl" />
									)}
								</div>
							</div>
						)}
						<input
							type="file"
							ref={fileInputRef}
							className="hidden"
							onChange={handleFileChange}
							accept=".png, .jpg, .svg, .jpeg, .webp"
						/>
					</div>
					<div className="space-y-4 text-white">
						<Input
							placeholder="Email"
							type="email"
							disabled
							value={userInfo.email}
							className="bg-[#3a3d4d] border-none placeholder:text-white/60"
						/>
						<Input
							placeholder="First Name"
							type="text"
							onChange={(e) => setFirstName(e.target.value)}
							value={firstName}
							className="bg-[#3a3d4d] border-none placeholder:text-white/60"
						/>
						<Input
							placeholder="Last Name"
							type="text"
							onChange={(e) => setLastName(e.target.value)}
							value={lastName}
							className="bg-[#3a3d4d] border-none placeholder:text-white/60"
						/>
						<div className="flex gap-3 items-center">
							{colors.map((clr, index) => (
								<div
									key={index}
									className={`${clr} h-8 w-8 rounded-full border-2 border-white cursor-pointer hover:scale-110 transition`}
									onClick={() => setColor(index)}
								></div>
							))}
						</div>
					</div>
				</div>
				<Button
					onClick={saveChanges}
					className="w-full h-14 bg-purple-700 hover:bg-purple-900 transition text-white text-lg rounded-xl shadow-md"
				>
					Save Changes
				</Button>
			</div>
		</div>
	);
};

export default Profile;
