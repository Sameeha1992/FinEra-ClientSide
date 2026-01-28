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



import axios from "axios";
import { store } from "@/redux/store";
// import { logout } from "@/redux/slice/auth.slice"; // adjust if needed

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_BASEURL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const role = store.getState().auth.role;

        let refreshUrl = "";

        if (role === "user") refreshUrl = "/user/refresh-token";
        else if (role === "vendor") refreshUrl = "/vendor/refresh-token";
        else throw new Error("Invalid role");

        console.log("Refreshing token for:", role);

        await axiosInstance.post(refreshUrl);

        return axiosInstance(originalRequest);
      } catch (err) {
        console.error("Refresh token failed");

        // store.dispatch(logout());
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
