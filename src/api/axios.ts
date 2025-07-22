import axios from "axios";
import { store } from "../store/store";
import { logout } from "../features/authSlice";

const apiBaseURL = axios.create({
    baseURL: "http://localhost:5000/",
    headers: {
        "Content-Type": "application/json",
    },
});

// List of routes where token should NOT be attached
const noAuthRoutes = ["/auth/login", "/auth/register"];

apiBaseURL.interceptors.request.use(
    (config) => {
        const isNoAuthRoute = noAuthRoutes.some((route) =>
            config.url?.includes(route)
        );

        if (!isNoAuthRoute) {
            const state = store.getState();
            const token = state.auth.token;

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

apiBaseURL.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Dispatch logout to clear Redux & trigger notification
            store.dispatch(logout());
        }

        return Promise.reject(error);
    }
);

export default apiBaseURL;
