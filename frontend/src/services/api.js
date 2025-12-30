import http from '@/services/http.js';

export function buildQuery(baseUrl, { filter, extendedFilter, relationship, sort, parameter } = {}) {
    const params = new URLSearchParams();

    if (relationship) params.append('with', relationship);

    if (filter) params.append('filter', filter);

    if (extendedFilter) {
        // extendedFilter expected like: "field,value"
        const parts = extendedFilter.split(',');
        const field = parts[0];
        const value = parts[1] ?? '';
        const paramPart = parameter ? encodeURIComponent(parameter) : '';
        const encoded = `${field},${paramPart}:like:%${value}%`;
        params.append('extendedFilter', encoded);
    }

    if (sort) params.append('sort', sort);

    const qs = params.toString();
    return qs ? `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${qs}` : baseUrl;
}

export const apiGet = (url) => http.get(url, { skipLoader: false });

export const apiRequest = ({ method = "get", url, data = null, headers = {}, skipLoader = false }) => {
    const cfg = {
        method,
        url,
        headers,
        skipLoader
    };

    if (data !== null) cfg.data = data;

    return http(cfg);
};

export const apiDelete = (url) => http.delete(url, { skipLoader: false });
