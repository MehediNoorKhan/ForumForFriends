import React from "react";
import { Link, NavLink } from "react-router";
import { Bell } from "lucide-react";
import logo from '../assets/convonest.PNG';

const Navbar = () => {
    return (
        <div className="navbar bg-base-100 shadow-md px-6">
            {/* Left side - Logo + Name */}
            <div className="navbar-start">
                <Link to="/" className="flex items-center gap-2">
                    <img
                        src={logo} // 👉 replace with your logo in public/
                        alt="ConvoNest Logo"
                        className="w-8 h-8"
                    />
                    <span className="text-xl font-bold">ConvoNest</span>
                </Link>
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

                <button className="btn btn-ghost btn-circle">
                    <Bell className="w-5 h-5" />
                </button>
            </div>

            {/* Right side - Auth Buttons */}
            <div className="navbar-end gap-3">
                <Link to="/login" className="btn btn-outline btn-primary">
                    Join Us
                </Link>
                <Link to="/register" className="btn btn-primary">
                    Register
                </Link>
            </div>
        </div>
    );
};

export default Navbar;
