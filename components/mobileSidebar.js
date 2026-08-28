"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as Icons from "lucide-react";
import { CalendarDays, X, LogOut, User } from "lucide-react";

import useAuth from "@/hooks/useAuth";
import { menus } from "@/constants/menu";

export default function MobileSidebar({ open, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  if (!open) return null;

  const role = user?.role?.toLowerCase();
  const menuItems = menus[role] || [];

  const handleLogout = async () => {
    await logout();
    onClose?.();
    router.replace("/login");
  };

  return (
    <div
      className="lg:hidden fixed inset-0 z-50 bg-black/30"
      onClick={onClose}
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        className="absolute left-0 top-0 bottom-0 w-[280px] bg-[#F8F1E7] p-5 shadow-2xl flex flex-col"
      >

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">

          <Link
            href="/"
            className="flex items-center gap-2.5"
            onClick={onClose}
          >
            <div className="w-10 h-10 rounded-xl bg-[#5B0F18] flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-[#F8F1E7]" />
            </div>

            <span className="text-xl font-bold text-[#5B0F18]">
              Eventify
            </span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg hover:bg-white flex items-center justify-center"
          >
            <X className="w-5 h-5 text-[#5B0F18]" />
          </button>

        </div>

        {/* MENU */}
        <nav className="space-y-1.5 overflow-y-auto">

          {menuItems.map((item) => {
            const Icon = Icons[item.icon] || Icons.Circle;
            const isActive =
              pathname === item.href ||
              (item.href !== "/" &&
                pathname?.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  isActive
                    ? "bg-[#5B0F18] text-[#F8F1E7] font-medium"
                    : "text-[#5B0F18] hover:bg-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.title}
              </Link>
            );
          })}

        </nav>

        {/* PROFILE + LOGOUT */}
        <div className="mt-auto pt-4 space-y-1.5 border-t border-[#E5D6D0]">

          <Link
            href="/profile"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#5B0F18] hover:bg-white transition"
          >
            <User className="w-5 h-5" />
            Profile
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#5B0F18] hover:bg-white transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>

        </div>

      </aside>
    </div>
  );
}
