// import { useEffect } from "react";
import axios from "axios";
// import { getAuth } from "firebase/auth";
import Swal from "sweetalert2";

// const auth = getAuth();

const useAxiosSecure = () => {
    const axiosSecure = axios.create({
        baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
    });


    //   axiosSecure.interceptors.request.use(async (config) => {
    //     const user = auth.currentUser;
    //     if (user) {
    //       const token = await user.getIdToken();
    //       config.headers.Authorization = `Bearer ${token}`;
    //     }
    //     return config;
    //   });


    //   axiosSecure.interceptors.response.use(
    //     (response) => response,
    //     (error) => {
    //       if (error.response && (error.response.status === 401 || error.response.status === 403)) {
    //         Swal.fire({
    //           icon: "error",
    //           title: "Unauthorized",
    //           text: "You are not authorized to access this resource.",
    //           confirmButtonColor: "#6b21a8",
    //         });
    //       }
    //       return Promise.reject(error);
    //     }
    //   );

    return axiosSecure;
};

export default useAxiosSecure;
