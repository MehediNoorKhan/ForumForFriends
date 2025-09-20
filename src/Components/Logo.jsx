import React from 'react';
import logo from '../assets/convonest.PNG';
import { Link } from 'react-router';

const Logo = () => {
    return (
        <div>
            <Link to="/" className="flex items-center gap-2">
                <img
                    src={logo}
                    alt="ConvoNest Logo"
                    className="w-8 h-8"
                />
                <span className="text-xl font-bold">ConvoNest</span>
            </Link>
        </div>
    );
};

export default Logo;