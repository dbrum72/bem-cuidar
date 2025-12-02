import { buildQuery, apiGet, apiRequest, apiDelete } from "@/services/api.js";

export function createResource(resourcePath) {
	
	const base = resourcePath.startsWith("/")
		? resourcePath
		: `/${resourcePath}`;

	return {
		list(params = {}) {
			const url = buildQuery(
				`${import.meta.env.VITE_BACKEND_URL}${base}`,
				params
			);
			return apiGet(url);
		},

		get(id) {
			const url = `${import.meta.env.VITE_BACKEND_URL}${base}/${id}`;	
			return apiGet(url);
		},

		save(data) {
			if (!data) throw new Error("Dados são requeridos.");

			const hasFile = Object.values(data).some(
				(v) => v instanceof File || v instanceof Blob
			);

			let payload;
			let headers = {};

			if (hasFile) {
				const formData = new FormData();

				Object.keys(data).forEach((key) => {
					if (data[key] !== null && data[key] !== undefined) {
						formData.append(key, data[key]);
					}
				});

				formData.append('_method', 'PATCH');
				payload = formData;				
			} else {
				payload = JSON.stringify(data);
				headers["Content-Type"] = "application/json";
			}

			const method = hasFile ? 'post' : data.id ? "patch" : "post";

			const url = data.id
				? `${import.meta.env.VITE_BACKEND_URL}${base}/${data.id}`
				: `${import.meta.env.VITE_BACKEND_URL}${base}`;

			return apiRequest({
				method,
				url,
				data: payload,
				headers,
			});
		},

		remove(id) {
			const url = `${import.meta.env.VITE_BACKEND_URL}${base}/${id}`;
			return apiDelete(url);
		},

		post(pathOrData, maybeData) {
			let path = "";
			let data = pathOrData;

			if (typeof pathOrData === "string") {
				path = `/${pathOrData}`;
				data = maybeData;
			}

			const url = `${import.meta.env.VITE_BACKEND_URL}${base}${path}`;
			return apiRequest({ method: "post", url, data });
		},

		patch(pathOrId, data) {
			const url = `${
				import.meta.env.VITE_BACKEND_URL
			}${base}/${pathOrId}`;
			return apiRequest({ method: "patch", url, data });
		},
	};
}
