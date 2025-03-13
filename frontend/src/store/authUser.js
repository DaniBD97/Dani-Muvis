import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
	user: null,
	isSignUp: false,
	isAuthenticated: true,
	isLogout: false,
	isLogin: false,
	signup: async (credentials) => {
		set({ isSignUp: true });
		try {
			const response = await axios.post("/api/auth/signup ", credentials);
			set({ user: response.data.user, isSignUp: false });
			toast.success("Account created successfully");
		} catch (error) {
			toast.error(error.response.data.message || "Signup failed");
			set({ isSignUp: false, user: null });
		}
	},
	login: async (credentials) => {
		set({ isLogin: true });
		try {
			const response = await axios.post("/api/auth/login", credentials);
			set({ user: response.data.user, isLogin: false });
		} catch (error) {
			set({ isLogin: false, user: null });
			toast.error(error.response.data.message || "Login failed");
		}
	},
	logout: async () => {
		set({ isLogout: true });
		try {
			await axios.post("/api/auth/logout");
			set({ user: null, isLogout: false });
			toast.success("Logged out successfully");
		} catch (error) {
			set({ isLogout: false });
			toast.error(error.response.data.message || "Logout failed");
		}
	},
	authCheck: async () => {
		set({ isAuthenticated: true });
	
		try {
			const response = await axios.get("/api/auth/authCheck");

			set({ user: response.data.user, isAuthenticated: false });
		} catch (error) {
			set({ isAuthenticated: false, user: null });
			// toast.error(error.response.data.message || "An error occurred");
		}
	},
}));