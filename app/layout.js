// Root layout - wraps entire app with SessionProvider for auth

import { Geist } from "next/font/google";
import "./globals.css";
import SessionWrapper from "./SessionWrapper";

const geist = Geist({ subsets: ["latin"] });

export const metadata = {
    title: "AI Study Planner",
    description: "AI powered study schedules",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={geist.className}>
                <SessionWrapper>
                    {children}
                </SessionWrapper>
            </body>
        </html>
    );
}