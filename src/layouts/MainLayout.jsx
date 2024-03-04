import React, { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { Navbar, Breadcrumbs, Footer, Sidebar } from "../components";
// import { fetchFleets } from "../features/fleets/fleetsSlice";
// import { fetchMasterDatas } from "../features/masterDatas/masterDatasSlice";
import { Transition } from "@headlessui/react";
import { useTimeoutFn } from 'react-use'
import { fetchLocation } from "../features/mapLocation/mapLocationSlice";



const MainLayout = () => {
    const dispatch = useDispatch();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const sideBar = React.useMemo(() => <Sidebar  />, []);

    const updateSideBarState = () => {
        let state = sidebarOpen
        setSidebarOpen(!state)
    }

    useEffect(() => {
    //     // dispatch(fetchMasterDatas());
        dispatch(fetchLocation());
    }, [dispatch]);

    return (
        <div className="bg-0 transition overflow-hidden">
            <header className="fixed top-0 left-0 w-full z-20 bg-white">
                <Navbar sidebarOpen={sidebarOpen} toggleSidebar={updateSideBarState} />
                <div className={(sidebarOpen ? 'w-[250px]' : 'w-[50px]') + ' top-[57px] pb-[65px] bottom-0 p-2 bg-white fixed left-0 h-full border-r overflow-x-hidden overflow-y-auto duration-[300ms] transition-all'}>
                    {sideBar}
                </div>
                {/* <Breadcrumbs sidebarOpen={sidebarOpen}/> */}
            </header>

            <main className={(sidebarOpen ? "ml-[250px]" : "ml-[50px]") + " duration-[300ms] transition-all pt-[56px] min-h-screen"}>
                <Outlet />
            </main>

            {/* <Footer /> */}
            {/* <footer>
                <div className="bg-white p-2">
                    <p>bcxvxc vcxv c</p>
                </div>
            </footer> */}
        </div>
    );
};

export default MainLayout;
