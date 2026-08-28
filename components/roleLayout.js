"use client";

import { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import { getProfile } from "@/services/profileService";

export default function RoleLayout({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const data = await getProfile();
                setUser(data);
            } catch (error) {
                console.error(
                    "Failed to load user:",
                    error
                );
            }
        };

        loadUser();
    }, []);

    if (!user) {
        return (
            <div className="min-h-screen bg-[#f8f1e8]" />
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f1e8]">
            <Sidebar role={user.role} />

            <main className="ml-64 min-h-screen">
                {children}
            </main>
        </div>
    );
}