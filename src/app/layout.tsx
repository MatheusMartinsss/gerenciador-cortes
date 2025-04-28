import { AuthProvider } from '@/context/AuthContext';
import { Inter as FontSans } from "next/font/google"
import '../app/(routes)/globals.css'
import type { Metadata } from 'next';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
    title: 'Minha App',
    description: 'Exemplo com JWT',
};

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
})


export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR">
            <body className={cn(
                " bg-gray-200 font-sans antialiased",
                fontSans.variable
            )}>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}