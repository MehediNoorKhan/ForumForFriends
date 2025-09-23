import React from "react";
import { Navigate } from "react-router";
import useAuth from "../Hooks/useAuth";
import useUserRole from "../Hooks/useUserRole";
import LoadingSpinner from "../Components/LoadingSpinner";

const AdminRoute = ({ children }) => {
    const { user, loading: authLoading } = useAuth();
    const { role, loading: roleLoading, error } = useUserRole();

    if (authLoading || roleLoading) return <LoadingSpinner />;

    // If not logged in, or role fetching error, or not admin
    if (!user || error || role !== "admin") {
        return <Navigate to="/forbidden" replace />;
    }

    return children;
};

export default AdminRoute;
