import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';

const SidebarLayout = () => {
    const [show, setShow] = useState(true);

    function handleDataFromChild(data) {
        setShow(data);
    }

    return (
        <>
            <main className={show ? null : 'space-toggle'}>
                <Sidebar sendDataToParent={handleDataFromChild} />
                <Outlet />
            </main>
        </>
    );
};

export default SidebarLayout;
