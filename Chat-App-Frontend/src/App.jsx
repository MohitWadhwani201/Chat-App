import React, { useEffect } from "react";
import { Button } from "./components/ui/button.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/auth/index.jsx";
import Chat from "./pages/chat/index.jsx";
import Profile from "./pages/profile/index.jsx";
import { useAppStore } from "./store/index.js";
import { GET_USER_INFO } from "./utils/constants.js";
import { apiClient } from "./lib/api-client.js"; // Assuming you have an apiClient setup for making API calls
import { toast } from "sonner"; // Assuming you're using sonner for notifications
const PrivateRoute = ({ children }) => {
	const { userInfo } = useAppStore();
	const isAuthenticated = !!userInfo;
	// toast.error("Please Login to first", { closeButton: true });
	return isAuthenticated ? children : <Navigate to="/auth" />;
};
const AuthRoute = ({ children }) => {
	const { userInfo } = useAppStore();
	const isAuthenticated = !userInfo;

	return isAuthenticated ? children : <Navigate to="/chat" />;
};
const App = () => {
	const { userInfo, setUserInfo } = useAppStore();
	const [loading, setLoading] = React.useState(true);
	// console.log("User Info:", userInfo);
	useEffect(() => {
		const getUserData = async () => {
			try {
				const response = await apiClient.get(GET_USER_INFO, {
					withCredentials: true,
				});
				// console.log("User Data Response:", response);
				if (response.status === 200 && response.data._id) {
					setUserInfo(response.data);
				} else {
					setUserInfo(undefined);
				}
			} catch (error) {
				setUserInfo(undefined);
				// console.error("Error fetching user data:", error);
			} finally {
				setLoading(false);
			}
		};
		getUserData();
		// Only run on mount!
	}, []);

	if (loading) {
		return <div>Loading...</div>;
		// console.log(response);
		// You can replace this with a loading spinner or skeleton
	}
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/auth"
					element={
						<AuthRoute>
							<Auth />
						</AuthRoute>
					}
				/>
				<Route
					path="/chat"
					element={
						<PrivateRoute>
							<Chat />
						</PrivateRoute>
					}
				/>
				<Route
					path="/profile"
					element={
						<PrivateRoute>
							<Profile />
						</PrivateRoute>
					}
				/>
				<Route path="*" element={<Navigate to="/auth" />} />
			</Routes>
		</BrowserRouter>
	);
};
export default App;
