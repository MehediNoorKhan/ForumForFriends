import React from 'react';
import Navbar from '../Shared/Navbar';
import { Outlet } from 'react-router';


const RootLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Outlet></Outlet>
        </div>
    );
};

export default RootLayout;