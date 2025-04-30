import { ReactNode } from "react";
import Sidebar from "../nagivation/siderBar";



const Layout = ({ children }: { children: React.ReactNode }) => {

    return (
        <div className="flex">
            <Sidebar />
            {children}
        </div>
    )
}

export default Layout