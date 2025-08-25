import { Tabs, TabsList } from "../../components/ui/tabs.jsx";
import { TabsContent, TabsTrigger } from "../../components/ui/tabs.jsx";
import Background from "../../assets/login2.png"; // OR new one below
import Victory from "../../assets/victory.svg"; // OR new one below
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button.jsx";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client.js"; // Assuming you have an apiClient setup for making API calls
import { SIGNUP, LOGIN } from "@/utils/constants.js";
import { useNavigate } from "react-router-dom"; // Assuming you're using react-router for navigation
import { useAppStore } from "@/store/index.js";
const Auth = () => {
	const navigate = useNavigate();
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [confirmPassword, setConfirmPassword] = React.useState("");
	const { setUserInfo } = useAppStore();

	const validateSignUp = () => {
		if (!email.length) {
			toast.error("Email is required", { closeButton: true });
			return false;
		}
		if (!password.length) {
			toast.error("Password is required", { closeButton: true });
			return false;
		}
		if (!confirmPassword.length) {
			toast.error("Confirm Password is required", { closeButton: true });
			return false;
		}
		if (password !== confirmPassword) {
			toast.error("Passwords do not match", { closeButton: true });
			return false;
		}
		return true;
	};
	const validateLogin = () => {
		if (!email.length) {
			toast.error("Email is required", { closeButton: true });
			return false;
		}
		if (!password.length) {
			toast.error("Password is required", { closeButton: true });
			return false;
		}
		return true;
	};
	const handleLogin = async () => {
		if (validateLogin()) {
			try {
				const response = await apiClient.post(
					LOGIN,
					{
						email,
						password,
					},
					{ withCredentials: true }
				);
				// console.log("Login response:", response);
				// console.log("Login response data:", response.data);
				if (response.data.user && response.data.user._id) {
					setUserInfo(response.data.user);
					if (response.data.user.profileSetup) navigate("/chat");
					else navigate("/profile");
					toast.success("Login successful!", { closeButton: true });
				} else {
					toast.error("Login failed: Invalid credentials or unexpected response.", { closeButton: true });
				}
			} catch (error) {
				// console.log("Login error:", error);
				// console.log("Login error response:", error.response);
				toast.error(error.response?.data?.message || "Login failed: Invalid credentials.", { closeButton: true });
			}
		}
	};
	const handleSignUp = async () => {
		if (validateSignUp()) {
			const response = await apiClient.post(
				SIGNUP,
				{
					email,
					password,
				},
				{ withCredentials: true }
			);
			if (response.status === 201) {
				setUserInfo(response.data.user);
				navigate("/profile");
				toast.success("Sign up successful!", { closeButton: true });
			}
		}
	};

	return (
		<div className="min-h-screen w-full flex items-center justify-center bg-black">
			<div className="bg-black text-white shadow-xl rounded-2xl overflow-hidden flex flex-col xl:flex-row w-[90vw] max-w-6xl border border-white">
				<div className="flex flex-col gap-10 p-10 xl:w-1/2 w-full justify-center">
					<div className="text-center">
						<h1 className="text-4xl md:text-5xl font-bold flex justify-center items-center gap-2">
							Welcome <img src={Victory} alt="victory" className="h-16 md:h-20" />
						</h1>
						<p className="text-gray-300 mt-2 text-base md:text-lg">
							Fill in the details to get started with the chat app
						</p>
					</div>
					<Tabs className="w-full">
						<TabsList className="flex w-full justify-around border-b border-gray-700">
							<TabsTrigger
								value="login"
								className="py-2 px-4 w-full text-center text-black-1000 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:font-semibold border-transparent data-[state=active]:border-white"
							>
								Login
							</TabsTrigger>
							<TabsTrigger
								value="signup"
								className="py-2 px-4 w-full text-center text-black-1000 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:font-semibold border-transparent data-[state=active]:border-white"
							>
								Sign Up
							</TabsTrigger>
						</TabsList>
						<TabsContent className="flex flex-col gap-5 mt-8" value="login">
							<Input
								placeholder="Email"
								type="email"
								className="rounded-xl p-4 bg-black text-white border border-gray-600 placeholder-gray-400"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<Input
								placeholder="Password"
								type="password"
								className="rounded-xl p-4 bg-black text-white border border-gray-600 placeholder-gray-400"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<Button
								className="rounded-xl p-4 bg-white text-black hover:bg-gray-200"
								onClick={handleLogin}
							>
								Login
							</Button>
						</TabsContent>
						<TabsContent className="flex flex-col gap-5 mt-8" value="signup">
							<Input
								placeholder="Email"
								type="email"
								className="rounded-xl p-4 bg-black text-white border border-gray-600 placeholder-gray-400"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<Input
								placeholder="Password"
								type="password"
								className="rounded-xl p-4 bg-black text-white border border-gray-600 placeholder-gray-400"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<Input
								placeholder="Confirm Password"
								type="password"
								className="rounded-xl p-4 bg-black text-white border border-gray-600 placeholder-gray-400"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
							/>
							<Button
								className="rounded-xl p-4 bg-white text-black hover:bg-gray-200"
								onClick={handleSignUp}
							>
								Sign Up
							</Button>
						</TabsContent>
					</Tabs>
				</div>
				<div className="hidden xl:flex items-center justify-center bg-black p-10 border-l border-white">
					<img src={Background} alt="login visual" className="max-h-[600px] object-contain grayscale" />
				</div>
			</div>
		</div>
	);
};

export default Auth;
