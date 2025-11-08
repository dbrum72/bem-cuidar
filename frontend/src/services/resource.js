import { buildQuery, apiGet, apiRequest, apiDelete } from '@/services/api.js';

/**
 * createResource: factory para criar client REST padrão para um recurso (ex: 'dependent')
 * basePath pode ser string absoluta ou relativa (sem slash inicial).
 *
 * Uso:
 * const dependentResource = createResource('dependent', '/dependent');
 * await dependentResource.list({ filter: 'x' });
 */
export function createResource(resourcePath) {
    // se o usuário passar 'dependent' transformamos em '/dependent'
    const base = resourcePath.startsWith('/') ? resourcePath : `/${resourcePath}`;

    return {
        /**
         * list({ filter, extendedFilter, relationship, sort, parameter })
         * retorna Promise (axios)
         */
        list(params = {}) {
            const url = buildQuery(`${import.meta.env.VITE_BACKEND_URL}${base}`, params);
            return apiGet(url);
        },

        /**
         * get(id)
         */
        get(id) {
            const url = `${import.meta.env.VITE_BACKEND_URL}${base}/${id}`;
            return apiGet(url);
        },

        /**
         * save(data) -> POST
         * update(id, data) -> PATCH
         * saveOrUpdate(data) -> detecta presença de id e usa POST/PATCH
         */
        saveOrUpdate(data) {
            if (!data) throw new Error('data is required');
            if (data.id) {
                const url = `${import.meta.env.VITE_BACKEND_URL}${base}/${data.id}`;
                return apiRequest({ method: 'patch', url, data });
            } else {
                const url = `${import.meta.env.VITE_BACKEND_URL}${base}`;
                return apiRequest({ method: 'post', url, data });
            }
        },

        remove(id) {
            const url = `${import.meta.env.VITE_BACKEND_URL}${base}/${id}`;
            return apiDelete(url);
        },

        // Caso queria chamar explicitamente POST ou PATCH:
        post(data) {
            const url = `${import.meta.env.VITE_BACKEND_URL}${base}`;
            return apiRequest({ method: 'post', url, data });
        },
        patch(id, data) {
            const url = `${import.meta.env.VITE_BACKEND_URL}${base}/${id}`;
            return apiRequest({ method: 'patch', url, data });
        }
    };
}
