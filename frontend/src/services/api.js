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
        // se o código anterior queria `parameter` incorporado, respeitamos: parameter é opcional
        // Formato antigo: extendedFilter=<field>,<encodeURIComponent(parameter)>:like:%<value>%
        // Vou padronizar para: extendedFilter=field,parameterOrValue:like:%value%
        const paramPart = parameter ? encodeURIComponent(parameter) : '';
        const encoded = `${field},${paramPart}:like:%${value}%`;
        params.append('extendedFilter', encoded);
    }
    if (sort) params.append('sort', sort);

    const qs = params.toString();
    return qs ? `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${qs}` : baseUrl;
}

/**
 * Wrapper genérico para GET
 * Retorna a promise do axios (http)
 */
export const apiGet = (url) => http.get(url);

/**
 * Wrapper genérico para request com method/data
 */
export const apiRequest = ({ method = 'get', url, data = null }) => {
    const cfg = {
        method,
        url,
    };
    if (data) cfg.data = data;
    return http(cfg);
};

export const apiDelete = (url) => http.delete(url);
