import axios from "axios";

const useAxios = () => {
    const axiosSecure = axios.create({
        baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
    });

    return axiosSecure;
};

export default useAxios;
