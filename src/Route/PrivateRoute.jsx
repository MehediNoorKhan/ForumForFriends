import React from 'react';

import { Navigate, useLocation } from 'react-router';
import useAuth from '../Hooks/useAuth';
import LoadingSpinner from '../Components/LoadingSpinner';

const PrivateRoute = ({ children }) => {

    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <LoadingSpinner></LoadingSpinner>;
    }

    if (!user) {
        return <Navigate to={'/joinus'} state={{ from: location }}></Navigate>;
    }

    return children;
};

export default PrivateRoute;