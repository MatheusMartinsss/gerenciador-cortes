import { Modal } from "@/components/modal/modal";
import { Toaster } from "@/components/ui/toaster"
import ReactQueryProvider from "./ReactQueryProvider";
import { RequireAuth } from "@/components/Layout/RequireAuth";
import Layout from "@/components/Layout/Layout";






export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <RequireAuth>
      <ReactQueryProvider>
        <Layout>
          <div className="flex w-full flex-col items-center p-10 mx-auto">
            {children}
          </div>
        </Layout>
        <Modal />
        <Toaster />
      </ReactQueryProvider>
    </RequireAuth>

  );
}
