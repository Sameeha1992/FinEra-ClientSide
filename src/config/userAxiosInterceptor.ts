import axios from "axios";
import type {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

const userAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_BASEURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },

  withCredentials:true,
});


console.log("Base URL:",import.meta.env.VITE_SERVER_BASEURL)

userAxiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log("Request url:", config.url);
    return config;
  },

  (error: AxiosError) => {
    console.error("Request Error:",error.message);
    return Promise.reject(error)
  }
);



userAxiosInstance.interceptors.response.use(
  response=>response,
  async error=>{
    const originalRequest = error.config;
    if(error.response.status === 401 && !originalRequest._retry){
      originalRequest._retry = true;

      try {
        console.log("Attempting to refresh token...");

        const response = await userAxiosInstance.post('/refresh-token');

        const {accessToken} = response.data;

        userAxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

        console.log("Token refreshed successfully");

        return userAxiosInstance(originalRequest)
        
      } catch (refreshError) {
        console.error("Token refresh failed",refreshError);

        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
 
);

export default userAxiosInstance;
