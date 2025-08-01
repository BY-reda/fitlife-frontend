import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../pages/Navbar'; // ✅ Import de la navbar stylisée

const Layout = () => {
    return (
        <div>
            <Navbar />  {/* ✅ Navbar fixée et réutilisable */}
            <Outlet />
        </div>
    );
};

export default Layout;
