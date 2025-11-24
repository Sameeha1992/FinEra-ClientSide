import axios from "axios"

import type {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

const adminAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_SERVER_BASEURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },

  withCredentials:true,
});



console.log("Base URL:",import.meta.env.VITE_ADMIN_SERVER_BASEURL)

adminAxiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log("Request url:", config.url);
    return config;
  },

  (error: AxiosError) => {
    console.error("Request Error:",error.message);
    return Promise.reject(error)
  }
);





adminAxiosInstance.interceptors.response.use(
  response=>response,
  async error=>{
    const originalRequest = error.config;
    if(error.response.status === 401 && !originalRequest._retry){
      originalRequest._retry = true;

      try {
        console.log("Attempting to refresh token...");

        const response = await adminAxiosInstance.post('/refresh-token');

        const {accessToken} = response.data;

        adminAxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

        console.log("Token refreshed successfully");

        return adminAxiosInstance(originalRequest)
        
      } catch (refreshError) {
        console.error("Token refresh failed",refreshError);

        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
 
);

export default adminAxiosInstance;
