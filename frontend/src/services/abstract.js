import http from '@/services/http.js' 

export const getCollection = (url, filter, extendedFilter, relationship, sort) => {

    let queryUrl = url;

     if (relationship) {
        
        queryUrl += `${queryUrl.includes('?') ? '&' : '?'}with=${relationship}`
    }
    
    if (filter) {
        
        queryUrl += `${queryUrl.includes('?') ? '&' : '?'}filter=${filter}`
    }

    if (extendedFilter) {
        
        const extendParameter = extendedFilter.split(',')
        
        queryUrl += `${queryUrl.includes('?') ? '&' : '?'}extendedFilter=${extendParameter[0]},${encodeURIComponent(parameter)}:like:%${extendParameter[1]}%`
    }

    if (sort) {
        queryUrl += `${queryUrl.includes('?') ? '&' : '?'}sort=${sort}`
    }
    
    return http.get(queryUrl)
}

export const getData = (url) => {
    return http.get(url)
}

export const upstoreData = (url, id, data) => {
    let method = id ? 'PATCH' : 'POST'
    let urlSelected = id ? `${url}/${id}` : url
    
    return http({ method, url: urlSelected, data });
}

export const deleteData = (url, id) => http.delete(`${url}/${id}`);