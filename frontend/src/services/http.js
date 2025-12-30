import axios from "axios";
import store from "@/store";
import router from "@/router";

import { startLoader, stopLoader } from "@/helpers/loader.helper";

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	headers: {
		Accept: "application/json",
	},
});

axiosInstance.interceptors.request.use(
	(config) => {
		if (!config.skipLoader) {
			startLoader();
		}

		const token = store.state.auth.token || localStorage.getItem("token");

		if (token) config.headers.Authorization = `Bearer ${token}`;
		return config;
	},
	(error) => {
		if (!error.config?.skipLoader) {
			stopLoader();
		}

		return Promise.reject(error);
	}
);

axiosInstance.interceptors.response.use(
	(response) => {
		if (!response.config.skipLoader) {
			stopLoader();
		}
		return response;
	},
	(error) => {
		if (!error.config?.skipLoader) {
			stopLoader();
		}

		if (error.response && error.response.status === 401) {
			store.commit("auth/setUser", null);
			store.commit("auth/setToken", null);
			localStorage.removeItem("token");
			localStorage.removeItem("user");

			if (router.currentRoute.value.name !== "Login") {
				router.push({ name: "Login" });
			}
		}

		return Promise.reject(error);
	}
);

export default axiosInstance;
