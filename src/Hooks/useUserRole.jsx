import { useState, useEffect, useContext } from "react";
import useAxiosSecure from "./useAxiosSecure";
import { AuthContext } from "../Provider/AuthContext";

const useUserRole = () => {
    const { user } = useContext(AuthContext); // get logged-in Firebase user
    const axiosSecure = useAxiosSecure();

    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user?.email) {
            setRole(null);
            setLoading(false);
            return;
        }

        const fetchUserRole = async () => {
            setLoading(true);
            try {
                // Get Firebase token
                const token = await user.getIdToken();

                // Fetch user data from backend
                const res = await axiosSecure.get(`/users/email/${user.email}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setRole(res.data.role); // store role
            } catch (err) {
                console.error("Failed to fetch user role:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserRole();
    }, [user, axiosSecure]);

    return { role, loading, error };
};

export default useUserRole;
