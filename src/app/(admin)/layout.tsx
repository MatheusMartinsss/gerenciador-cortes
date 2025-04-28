import { Modal } from "@/components/modal/modal";
import { Toaster } from "@/components/ui/toaster"
import ReactQueryProvider from "../(routes)/ReactQueryProvider";
import { NavBar } from "@/components/nagivation/navBar/NavBar";
import { RequireAuthAdmin } from "@/components/Layout/RequireAuth";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <RequireAuthAdmin>
            <ReactQueryProvider>
                <div>
                    <NavBar />
                    <div className="flex-grow">
                        <div className="flex w-full flex-col items-center p-10 mx-auto">
                            {children}
                        </div>
                    </div>
                    <Modal />
                    <Toaster />
                </div>
            </ReactQueryProvider>
        </RequireAuthAdmin>

    );
}
