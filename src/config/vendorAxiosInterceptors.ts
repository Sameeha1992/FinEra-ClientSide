import axios, { type InternalAxiosRequestConfig,AxiosError } from 'axios';

const vendorAxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_VENDOR_SERVER_BASEURL,
    timeout: 10000,
    headers:{
        "Content-Type":"application/json",
    },

    withCredentials:true,
});

console.log("Base Vendor URL:",import.meta.env.VITE_VENDOR_SERVER_BASEURL)

vendorAxiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        console.log("Request url:", config.url);
        return config;
    },

    (error: AxiosError) => {
    console.error("Request Error:",error.message);
    return Promise.reject(error)
  }
);


vendorAxiosInstance.interceptors.response.use(
    response=>response,
    async error=>{

        const originalRequest = error.config;
        if(error.response.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;
        

        try {

            console.log("Attempting to refresh token vendor side...");

            const response = await vendorAxiosInstance.post('/refresh-token');

            const {accessToken} = response.data;

            vendorAxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

            console.log("Token refreshed successfully");

            return vendorAxiosInstance(originalRequest)
            
        } catch (refreshError) {
            console.log("Token refresh failed",refreshError);

            return Promise.reject(refreshError)
        }

    }
        return Promise.reject(error)
    });
    


    export default vendorAxiosInstance;