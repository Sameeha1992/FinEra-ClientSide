// axiosInstance.ts
import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { store } from "@/redux/store";
import { removeToken, setAccessToken } from "@/redux/slice/tokenSlice";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_BASEURL,
  withCredentials: true, // sends cookies automatically
});

let isRefreshing = false;

let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Optional: log requests
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = store.getState().token.accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    console.log(
      "[Axios] Request:",
      config.method?.toUpperCase(),
      config.url,
      accessToken ? "Token attached ✅" : "No token ❌",
    );

    return config;
  },
  (error: AxiosError) => {
    console.error("[Axios] Request error:", error.message);
    return Promise.reject(error);
  },
);

// Response interceptor: refresh token on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Read role from Redux store
        const role = store.getState().auth.role;

        let refreshUrl = "/refresh-token";
        if (role === "user") refreshUrl = "/user/refresh-token";
        else if (role === "vendor") refreshUrl = "/vendor/refresh-token";
        else if (role === "admin") refreshUrl = "/admin/refresh-token";

        console.log("[Axios] Refreshing token...");

        const refreshRes = await axiosInstance.post(
          refreshUrl,
          {},
          { withCredentials: true },
        );
        const newAccessToken = refreshRes.data.accessToken;

        store.dispatch(setAccessToken(newAccessToken));

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        console.log("[Axios] Retrying original request with new token ✅");

        // Retry original request; cookies automatically sent
        return axiosInstance(originalRequest);
      } catch (err) {
        console.error("[Axios] Refresh token failed:", err);

        // Reject all queued requests
        processQueue(err, null);

        // Optionally clear auth state if refresh fails
        // store.dispatch(clearAuth());
        store.dispatch(removeToken());
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
