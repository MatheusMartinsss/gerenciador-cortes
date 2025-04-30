import { Modal } from "@/components/modal/modal";
import { Toaster } from "@/components/ui/toaster"
import ReactQueryProvider from "../(routes)/ReactQueryProvider";
import { NavBar } from "@/components/nagivation/navBar/NavBar";
import { RequireAuthAdmin } from "@/components/Layout/RequireAuth";
import { Sidebar } from "lucide-react";
import Layout from "@/components/Layout/Layout";
export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <RequireAuthAdmin>
            <ReactQueryProvider>
                <Layout>
                    {children}
                </Layout>
                <Modal />
                <Modal />
                <Toaster />
            </ReactQueryProvider>
        </RequireAuthAdmin >

    );
}
