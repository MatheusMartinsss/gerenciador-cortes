import '../app/(routes)/globals.css'
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Minha App',
    description: 'Exemplo com JWT',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR">
            <body>{children}</body>
        </html>
    );
}