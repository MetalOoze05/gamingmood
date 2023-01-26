import React from 'react';

import Navbar from './Navbar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="px-10">
            <Navbar />
            <main>{children}</main>
        </div>
    )
}

export default Layout;