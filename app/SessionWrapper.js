// Separate client component for SessionProvider
// This is needed because layout.js must be a server component in Next.js

"use client";

import { SessionProvider } from "next-auth/react";

export default function SessionWrapper({ children }) {
    return <SessionProvider>{children}</SessionProvider>;
}