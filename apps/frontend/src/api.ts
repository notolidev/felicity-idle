import axios from "axios";

export const api = axios.create({
    baseURL: "//localhost:3000",
    withCredentials: true,
});

let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(handler: () => void) {
    onUnauthorized = handler;
}

api.interceptors.response.use(
    (response) => response,
    async (error: any) => {
        const originalRequest: any = error.config ?? {};

        const isAuthError = error.response.status === 401;
        const alreadyRetried = originalRequest._retry === true;
        const isRefreshCall = originalRequest.url?.includes("/auth/refresh");

        if (isAuthError && !alreadyRetried && !isRefreshCall) {
            originalRequest._retry = true;
            try {
                await api.get("/auth/refresh");
                return api(originalRequest);
            } catch (refreshError) {
                onUnauthorized?.();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);
