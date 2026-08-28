"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import useAuth from "@/hooks/useAuth";
import Sidebar from "@/components/sidebar";

export default function AdminLayout({
    children,
}) {
    const router = useRouter();

    const {
        user,
        loading,
    } = useAuth();

    useEffect(() => {
        if (loading) return;

        if (!user) {
            router.replace("/login");
            return;
        }

        const role =
            user.role?.toLowerCase();

        if (
            role !== "admin" &&
            role !== "superadmin"
        ) {
            if (role === "customer") {
                router.replace(
                    "/customer/dashboard"
                );
            } else {
                router.replace("/login");
            }
        }
    }, [
        user,
        loading,
        router,
    ]);

    if (loading) {
        return (
            <main className="min-h-screen bg-[#F8F1E7] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-[#D8A7A7] border-t-[#5B0F18] animate-spin" />

                    <p className="text-sm text-[#7A1F2B]">
                        Checking access...
                    </p>
                </div>
            </main>
        );
    }

    if (!user) {
        return null;
    }

    const role =
        user.role?.toLowerCase();

    if (
        role !== "admin" &&
        role !== "superadmin"
    ) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#F8F1E7]">
            <Sidebar />

            <div className="lg:ml-[250px]">
                {children}
            </div>
        </div>
    );
}