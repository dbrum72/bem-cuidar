// src/services/api.js
import http from '@/services/http.js';

/**
 * Constrói query string com parâmetros opcionais.
 * extendedFilter: string no formato "field,value"
 * parameter: parâmetro extra usado para montar filtros dinâmicos (mantive compatibilidade com uso anterior)
 */
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

export const apiGet = (url) => http.get(url);

export const apiRequest = ({ method = "get", url, data = null, headers = {} }) => {
    const cfg = {
        method,
        url,
        headers
    };

    if (data !== null) cfg.data = data;

    return http(cfg);
};


export const apiDelete = (url) => http.delete(url);
