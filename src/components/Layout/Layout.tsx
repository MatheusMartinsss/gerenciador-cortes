"use client"
import { ReactNode, useState } from "react";
import Sidebar from "../nagivation/siderBar";
import { NavBar } from "../nagivation/navBar/NavBar";
import Breadcrumb from "../ui/breadcrumb";



const Layout = ({ children }: { children: React.ReactNode }) => {
    const [toggleSideBar, setToggleSideBar] = useState(false)

    const toggleBar = () => setToggleSideBar((state) => !state)
    return (
        <div className="flex w-full flex-col min-h-screen">
            <NavBar toggleSidebar={toggleBar} />
            <div className="flex w-full flex-1">
                <Sidebar collapsed={toggleSideBar} />
                <div className="flex flex-col w-full">
                    <Breadcrumb />
                    <main className="flex-1 bg-gray-100 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Layout