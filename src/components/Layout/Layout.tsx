import { ReactNode } from "react";
import Sidebar from "../nagivation/siderBar";
import { NavBar } from "../nagivation/navBar/NavBar";
import Breadcrumb from "../ui/breadcrumb";



const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex w-full flex-col min-h-screen">
            <div className="flex w-full flex-1">
                <Sidebar />
                <main className="flex-1 bg-gray-100 overflow-y-auto">
                    <NavBar />

                    <div className="max-w-6xl mx-auto p-6">
                        <Breadcrumb />
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout