import { buildQuery, apiGet, apiRequest, apiDelete } from "@/services/api.js";

export function createResource(resourcePath) {
	// se o usuário passar 'dependent' transformamos em '/dependent'
	const base = resourcePath.startsWith("/")
		? resourcePath
		: `/${resourcePath}`;

	return {
		/**
		 * list({ filter, extendedFilter, relationship, sort, parameter })
		 * retorna Promise (axios)
		 */
		list(params = {}) {
			const url = buildQuery(
				`${import.meta.env.VITE_BACKEND_URL}${base}`,
				params
			);
			return apiGet(url);
		},

		/**
		 * get(id)
		 */
		get(id) {
			const url = `${import.meta.env.VITE_BACKEND_URL}${base}/${id}`;
			return apiGet(url);
		},

		saveOrUpdate(data) {
			
			if (!data) throw new Error("Dados são requeridos.");

			const formData = new FormData();

			Object.keys(data).forEach((key) => {
				if (data[key] !== null && data[key] !== undefined) {
					formData.append(key, data[key]);
				}
			});

			const url = data.id
				? `${import.meta.env.VITE_BACKEND_URL}${base}/${data.id}`
				: `${import.meta.env.VITE_BACKEND_URL}${base}`;

			return apiRequest({
				method: data.id ? "patch" : "post",
				url,
				data: formData,
				headers: { "Content-Type": "multipart/form-data" },
			});
		},

		remove(id) {
			const url = `${import.meta.env.VITE_BACKEND_URL}${base}/${id}`;
			return apiDelete(url);
		},

		post(pathOrData, maybeData) {
			let path = "";
			let data = pathOrData;

			// se o primeiro argumento for string, é um subpath
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
