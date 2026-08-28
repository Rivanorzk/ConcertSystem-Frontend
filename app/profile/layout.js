"use client";

import UserLayout from "@/components/userLayout";

export default function ProfileLayout({ children }) {
    return (
        <UserLayout>
            {children}
        </UserLayout>
    );
}