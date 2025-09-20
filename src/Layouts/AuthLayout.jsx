import React from "react";
import Logo from "../Components/Logo"; // adjust path if needed
import Lottie from "lottie-react";

// ✅ Import JSON file from public folder
import credentialsAnimation from "../assets/credentials.json";
import { Outlet } from "react-router";

const AuthLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Top Logo */}
            <div className="p-4">
                <Logo />
            </div>

            {/* Two column layout */}
            <div className="flex flex-1">
                {/* Left side */}
                <div className="flex-1 bg-purple-50 flex items-center justify-center">
                    <Outlet />
                </div>

                {/* Right side */}
                <div className="flex-1 bg-gray-50 flex items-center justify-center">
                    <Lottie
                        animationData={credentialsAnimation}
                        loop={true}
                        className="w-3/4 max-w-md"
                    />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
