import type {Metadata} from "next";
import {Inter} from "next/font/google";
import {Providers} from '@/app/providers';

import '../styles/globals.css';

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "TRC-404",
    description: "Probably not found.",
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
        <body className={inter.className}>
        <Providers>
            <div className="relative flex h-screen flex-col">
                <main className="container mx-auto max-w-7xl flex-grow ">
                    {children}
                </main>
            </div>
        </Providers>
        </body>
        </html>
    );
}
