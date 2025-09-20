import React, { useState } from "react";
import { Link, NavLink } from "react-router";
import { Bell } from "lucide-react";
import Logo from "../Components/Logo";
import useAuth from "../Hooks/useAuth";

const Navbar = () => {
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout().then(() => {

            }).catch((error) => {
                console.log(error.message);
            });;
            setDropdownOpen(false);
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <div className="navbar bg-base-100 shadow-md px-6">
            {/* Left side - Logo */}
            <div className="navbar-start">
                <Logo />
            </div>

            {/* Center - Navigation Links */}
            <div className="navbar-center hidden md:flex gap-6">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive ? "text-primary font-semibold" : "hover:text-primary"
                    }
                >
                    Home
                </NavLink>

                <NavLink
                    to="/membership"
                    className={({ isActive }) =>
                        isActive ? "text-primary font-semibold" : "hover:text-primary"
                    }
                >
                    Membership
                </NavLink>

                <button className="btn btn-ghost btn-circle" aria-label="notifications">
                    <Bell className="w-5 h-5" />
                </button>
            </div>

            {/* Right side - Auth Buttons / Profile */}
            <div className="navbar-end gap-3 relative">
                {!user ? (
                    <>
                        <Link to="/joinus" className="btn btn-outline btn-primary">
                            Join Us
                        </Link>
                        <Link to="/register" className="btn btn-primary">
                            Register
                        </Link>
                    </>
                ) : (
                    <div className="relative">
                        <img
                            src={user.photoURL || "https://i.ibb.co/MBtjqXQ/default-avatar.png"}
                            alt="profile"
                            className="w-10 h-10 rounded-full cursor-pointer border-2 border-primary"
                            onClick={() => setDropdownOpen((v) => !v)}
                        />

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden z-50">
                                <div className="px-4 py-2 text-gray-700 font-semibold border-b">
                                    {user.displayName || "User"}
                                </div>

                                <Link
                                    to="/dashboard"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    Dashboard
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
