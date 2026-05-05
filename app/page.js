// The landing page. If user is already logged in, redirect to dashboard.
// If not, show a sign in with Google button.

"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) router.push("/dashboard");
    }, [session]);

    if (status === "loading") return <p className="text-center mt-20">Loading...</p>;

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md w-full text-center">
                <h1 className="text-4xl font-bold text-indigo-600 mb-4">📚 Study Planner</h1>
                <p className="text-gray-500 mb-8">AI powered study schedules personalized just for you</p>
                <button
                    onClick={() => signIn("google")}
                    className="w-full bg-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-indigo-700 transition"
                >
                    Sign in with Google
                </button>
            </div>
        </main>
    );
}