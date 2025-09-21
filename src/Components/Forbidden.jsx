import React from "react";
import { Link } from "react-router";

const Forbidden = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
            <h2 className="text-2xl font-semibold mb-2">Access Forbidden</h2>
            <p className="mb-6 text-center max-w-md">
                You do not have permission to view this page. Please contact your administrator if you believe this is an error.
            </p>
            <Link to="/" className="btn btn-primary">
                Go to Home
            </Link>
        </div>
    );
};

export default Forbidden;
