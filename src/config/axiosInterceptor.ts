// import axios from "axios";
// import type {
//   AxiosResponse,
//   AxiosError,
//   InternalAxiosRequestConfig,
// } from "axios";

// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_SERVER_BASEURL,
//   timeout: 10000,
//   headers: {
//     "Content-Type": "application/json",
//   },

//   withCredentials:true,
// });


// console.log("Base URL:",import.meta.env.VITE_SERVER_BASEURL)

// axiosInstance.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     console.log("Request url:", config.url);
//     return config;
//   },

//   (error: AxiosError) => {
//     console.error("Request Error:",error.message);
//     return Promise.reject(error)
//   }
// );



// axiosInstance.interceptors.response.use(
//   response=>response,
//   async error=>{
//     const originalRequest = error.config;
//     if(error.response.status === 401 && !originalRequest._retry){
//       originalRequest._retry = true;

//       try {
//         console.log("Attempting to refresh token...");

//         const response = await axiosInstance.post('/refresh-token');

//         const {accessToken} = response.data;


//         axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

//         console.log("Token refreshed successfully");

//         return axiosInstance(originalRequest)
        
//       } catch (refreshError) {
//         console.error("Token refresh failed",refreshError);

//         return Promise.reject(refreshError)
//       }
//     }
//     return Promise.reject(error)
//   }
 
// );

// export default axiosInstance;




// import axios from "axios";
// import type { AxiosError, InternalAxiosRequestConfig } from "axios";

// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_SERVER_BASEURL,
//   withCredentials: true, 
// });

// // Request interceptor (optional – can remove if not needed)
// axiosInstance.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     console.log("Request URL:", config.url);
//     return config;
//   },
//   (error: AxiosError) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor – refresh token logic
// axiosInstance.interceptors.response.use(
//   response => response,
//   async error => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         console.log("Refreshing token...");
//         await axiosInstance.post("/refresh-token");
//         return axiosInstance(originalRequest);
//       } catch (err) {
//         console.error("Refresh token failed");
//         return Promise.reject(err);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;





// axiosInstance.ts
import axios, { AxiosError } from "axios";
import type {InternalAxiosRequestConfig } from "axios";
import { store } from "@/redux/store";
import { removeToken, setAccessToken } from "@/redux/slice/tokenSlice";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_BASEURL,
  withCredentials: true, // sends cookies automatically
});

// Optional: log requests
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {

    const accessToken = store.getState().token.accessToken;

    if(accessToken){
      config.headers.Authorization = `Bearer ${accessToken}`
    }

     console.log(
      "[Axios] Request:",
      config.method?.toUpperCase(),
      config.url,
      accessToken ? "Token attached ✅" : "No token ❌"
    );

    return config;
  },
  (error: AxiosError) => {
    console.error("[Axios] Request error:", error.message);
    return Promise.reject(error);
  }
);

// Response interceptor: refresh token on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Read role from Redux store
        const role = store.getState().auth.role;

        let refreshUrl = "/refresh-token";
        if (role === "user") refreshUrl = "/user/refresh-token";
        else if (role === "vendor") refreshUrl = "/vendor/refresh-token";
        else if (role === "admin") refreshUrl = "/admin/refresh-token";

        console.log("[Axios] Refreshing token...");

        const refreshRes = await axiosInstance.post(refreshUrl,{},{withCredentials:true})
        const newAccessToken = refreshRes.data.accessToken


        store.dispatch(setAccessToken(newAccessToken))

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        console.log("[Axios] Retrying original request with new token ✅");

        
        // Retry original request; cookies automatically sent
        return axiosInstance(originalRequest);
      } catch (err) {
        console.error("[Axios] Refresh token failed:", err);
        // Optionally clear auth state if refresh fails
        // store.dispatch(clearAuth());
        store.dispatch(removeToken())
        return Promise.reject(err)
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
