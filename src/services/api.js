import axios from 'axios'; 
import auth from '@/services/auth';
import customNotify from '@/utils/custom-notify'; 

export const api = axios.create({ 
    baseURL: process.env.VUE_APP_API_BASE_URL,
});

export const validateApiError = (err, router) => {
    if (err.response.status === 401) { 
        auth.logout(router);
    } else {
        const message = err.response.data ? err.response.data : "Ocorreu um erro ao processar a requisição";  
        customNotify(message, "error");
    }
}