import axios from "axios";
import store from "@/store";
import router from "@/router";

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

axiosInstance.interceptors.request.use(
	(config) => {
		const token = store.state.auth.token || localStorage.getItem("token");

		if (token) config.headers.Authorization = `Bearer ${token}`;
		return config;
	},
	(error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response && error.response.status === 401) {
			// Limpa sessão
			store.commit("auth/setUser", null);
			store.commit("auth/setToken", null);
			localStorage.removeItem("token");
			localStorage.removeItem("user");

			// Evita loop se já estiver na tela de login
			if (router.currentRoute.value.name !== "Login") {
				router.push({ name: "Login" });
			}
		}
		return Promise.reject(error);
	}
);

export default axiosInstance;
