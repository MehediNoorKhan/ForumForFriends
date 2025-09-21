import React from 'react';
import useAuth from '../Hooks/useAuth';
import LoadingSpinner from '../Components/LoadingSpinner';
import { Navigate } from 'react-router';
import useUserRole from '../Hooks/useUserRole';

const UserRoute = ({ children }) => {
    const { user, loading: authLoading } = useAuth();
    const { role, loading: roleLoading, error } = useUserRole();

    // Show loading spinner while auth or role is being fetched
    if (authLoading || roleLoading) {
        return <LoadingSpinner />;
    }

    // If user not logged in, role is not 'user', or error fetching role
    if (!user || error || role !== 'user') {
        return <Navigate to="/joinus" replace />;
    }

    return children;
};

export default UserRoute;
