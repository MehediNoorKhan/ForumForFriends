import { useState, useEffect } from "react";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useUserRole = () => {
    const { user, loading: authLoading } = useAuth(); // wait until Firebase auth is loaded
    const axiosSecure = useAxiosSecure();
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (authLoading) return; // wait until auth state is ready

        if (!user?.email) {
            setRole(null);
            setLoading(false);
            return;
        }

        const fetchRole = async () => {
            try {
                const { data } = await axiosSecure.get(`/users/role?email=${user.email}`);
                setRole(data.role);
            } catch (err) {
                console.error("Error fetching user role:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRole();
    }, [user, authLoading, axiosSecure]);

    return { role, loading, error };
};

export default useUserRole;
