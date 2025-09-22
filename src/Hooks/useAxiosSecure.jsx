import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../Provider/AuthContext";
import Swal from "sweetalert2";

const useAxiosSecure = () => {
    const { user, logout } = useContext(AuthContext);

    const axiosSecure = axios.create({
        baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
        headers: { "Content-Type": "application/json" },
    });

    // Request interceptor
    axiosSecure.interceptors.request.use(
        async (config) => {
            if (user) {
                try {
                    // Use cached token; do NOT force refresh
                    const token = await user.getIdToken();
                    config.headers.Authorization = `Bearer ${token}`;
                } catch (err) {
                    console.error("Failed to get token:", err);
                }
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Response interceptor
    axiosSecure.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (error.response?.status === 401 || error.response?.status === 403) {
                Swal.fire({
                    icon: "error",
                    title: "Unauthorized",
                    text: "Your session has expired. Please log in again.",
                    confirmButtonColor: "#6b21a8",
                });
                logout();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: error.response?.data?.message || error.message,
                    confirmButtonColor: "#6b21a8",
                });
            }
            return Promise.reject(error);
        }
    );

    return axiosSecure;
};

export default useAxiosSecure;
