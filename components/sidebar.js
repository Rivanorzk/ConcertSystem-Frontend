"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as Icons from "lucide-react";
import {
    CalendarDays,
    User,
    LogOut,
} from "lucide-react";

import useAuth from "@/hooks/useAuth";
import { menus } from "@/constants/menu";

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    const role = user?.role?.toLowerCase();

    const menuItems =
        menus[role] ||
        menus[role?.toUpperCase()] ||
        [];

    const normalizePath = (path) => {
        if (!path) return "/";

        const normalized = path
            .replace(/\/+$/, "")
            .toLowerCase();

        return normalized || "/";
    };

    const currentPath = normalizePath(pathname);

    /*
     * Cari menu yang paling cocok dengan URL sekarang.
     * Menu dengan href paling panjang diprioritaskan.
     */
    const activeItem = [...menuItems]
        .sort(
            (a, b) =>
                normalizePath(b.href).length -
                normalizePath(a.href).length
        )
        .find((item) => {
            const href = normalizePath(item.href);

            if (href === "/") {
                return currentPath === "/";
            }

            return (
                currentPath === href ||
                currentPath.startsWith(
                    `${href}/`
                )
            );
        });

    const handleLogout = async () => {
        await logout();
        router.replace("/login");
    };

    return (
        <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 z-40 w-[250px] bg-[#5B0F18] text-[#F8F1E7] flex-col px-5 py-6">

            {/* LOGO */}
            <Link
                href="/"
                className="flex items-center gap-3 px-3 mb-10"
            >
                <div className="w-11 h-11 rounded-xl bg-[#F8F1E7] flex items-center justify-center">
                    <CalendarDays className="w-6 h-6 text-[#5B0F18]" />
                </div>

                <div>
                    <span className="text-2xl font-bold tracking-tight">
                        Eventify
                    </span>

                    <p className="text-[9px] text-[#D8A7A7] uppercase tracking-[0.18em]">
                        {user?.role || "Account"}
                    </p>
                </div>
            </Link>

            {/* MENU */}
            <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar">

                {menuItems.map((item) => {
                    const Icon =
                        Icons[item.icon] ||
                        Icons.Circle;

                    const isActive =
                        activeItem?.href ===
                        item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                isActive
                                    ? "bg-[#7A1F2B] text-[#F8F1E7] font-semibold shadow-sm"
                                    : "text-[#D8A7A7] hover:bg-[#7A1F2B]/70 hover:text-[#F8F1E7]"
                            }`}
                        >
                            <Icon className="w-5 h-5 shrink-0" />

                            <span className="text-sm">
                                {item.title}
                            </span>
                        </Link>
                    );
                })}

            </nav>

            {/* LOGOUT */}
            <div className="mt-auto space-y-2">

                <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#D8A7A7] hover:bg-[#7A1F2B] hover:text-[#F8F1E7] transition"
                >
                    <LogOut className="w-4 h-4" />

                    <span className="text-sm font-medium">
                        Logout
                    </span>
                </button>

            </div>

        </aside>
    );
}