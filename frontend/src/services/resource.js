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

			const isFormData = data instanceof FormData;

			const id = isFormData ? data.get("id") : data.id;

            const method = isFormData
                ? (data.get("id") ? "post" : "post") // Laravel tratado pelo backend
                : (data.id ? "patch" : "post");

            const url = `${import.meta.env.VITE_BACKEND_URL}${base}${id ? "/" + id : ""}`;

            return apiRequest({
                method: method,
                url,
                data,
                headers: isFormData ? {} : { "Content-Type": "application/json" },
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
			const url = `${import.meta.env.VITE_BACKEND_URL}${base}/${pathOrId}`;
			return apiRequest({ method: "patch", url, data });
		},
	};
}
