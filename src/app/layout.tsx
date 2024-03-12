import type {Metadata} from "next";
import {Inter} from "next/font/google";
import {Providers} from '@/app/providers';

import '../styles/globals.css';

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "TRC-404",
    description: "Probably not found.",
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
            {children}
        </Providers>
        </body>
        </html>
    );
}
