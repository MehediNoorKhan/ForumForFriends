import React from 'react';
import useAuth from '../Hooks/useAuth';
import LoadingSpinner from '../Components/LoadingSpinner';
import { Navigate } from 'react-router';
import useUserRole from '../Hooks/useUserRole';

const AdminRoute = ({ children }) => {
    const { user, loading: authLoading } = useAuth();
    const { role, loading: roleLoading, error } = useUserRole();

    // Show loading spinner if auth or role fetching is in progress
    if (authLoading || roleLoading) {
        return <LoadingSpinner />;
    }

    // If user not logged in, role is not 'admin', or error fetching role
    if (!user || error || role !== 'admin') {
        return <Navigate to="/forbidden" replace />;
    }

    return children;
};

export default AdminRoute;
