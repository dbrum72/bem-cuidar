// src/services/http.js
import axios from "axios";
import AuthMixin from "@/mixins/AuthMixin.js";

const http = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/",
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

// instancia temporária do AuthMixin (sem Vue, só para token)
const authHelper = {
	getAuthToken: AuthMixin.methods.getAuthToken,
	clearSession: AuthMixin.methods.clearSession,
	logoutUser: AuthMixin.methods.logoutUser,
};

// Adiciona token em cada requisição
http.interceptors.request.use(
	(config) => {
		const token = authHelper.getAuthToken();
		if (token) config.headers.Authorization = `Bearer ${token}`;
		return config;
	},
	(error) => Promise.reject(error)
);

// Intercepta respostas não autorizadas
http.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response && error.response.status === 401) {
			console.warn("Sessão expirada ou não autorizada. Limpando sessão.");
			authHelper.clearSession();
			if (window.location.pathname !== "/login") {
				window.location.href = "/login";
			}
		}
		return Promise.reject(error);
	}
);

export default http;
