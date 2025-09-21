import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../Provider/AuthContext";
import Swal from "sweetalert2";

const useAxiosSecure = () => {
    const { user, logout } = useContext(AuthContext);

    const axiosSecure = axios.create({
        baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
        headers: {
            "Content-Type": "application/json",
        },
    });

    // 🔹 Request interceptor: attach Firebase token
    axiosSecure.interceptors.request.use(
        async (config) => {
            if (user) {
                const token = await user.getIdToken(); // Firebase token
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // 🔹 Response interceptor: handle errors globally
    axiosSecure.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (error.response) {
                const status = error.response.status;
                if (status === 401 || status === 403) {
                    // Token expired or unauthorized
                    await Swal.fire({
                        icon: "error",
                        title: "Unauthorized",
                        text: "Your session has expired. Please log in again.",
                        confirmButtonColor: "#6b21a8",
                    });
                    logout(); // Log out the user
                } else {
                    // Other server errors
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: error.response.data?.message || "Something went wrong",
                        confirmButtonColor: "#6b21a8",
                    });
                }
            } else {
                // Network or unknown errors
                Swal.fire({
                    icon: "error",
                    title: "Network Error",
                    text: error.message || "Something went wrong",
                    confirmButtonColor: "#6b21a8",
                });
            }

            return Promise.reject(error);
        }
    );

    return axiosSecure;
};

export default useAxiosSecure;
