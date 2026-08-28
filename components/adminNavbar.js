"use client";

import {
  Bell,
  Menu,
  Search,
  User,
} from "lucide-react";

import useAuth from "@/hooks/useAuth";

export default function AdminNavbar({
  onMenuClick,
  searchValue = "",
  onSearchChange,
}) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 h-[76px] bg-[#F8F1E7]/95 backdrop-blur border-b border-[#E5D6D0]">

      <div className="h-full px-5 sm:px-7 lg:px-8 flex items-center justify-between gap-5">

        {/* MOBILE LOGO */}

        <div className="lg:hidden flex items-center gap-2.5">

          <button
            type="button"
            onClick={onMenuClick}
            className="w-10 h-10 rounded-xl bg-[#5B0F18] text-[#F8F1E7] flex items-center justify-center"
          >
            <Menu className="w-5 h-5" />
          </button>

          <span className="font-bold text-[#5B0F18]">
            Eventify
          </span>

        </div>

        {/* SEARCH */}

        <div className="hidden sm:flex items-center relative w-full max-w-[400px]">

          <Search className="absolute left-4 w-4 h-4 text-[#A68C8C]" />

          <input
            type="text"
            value={searchValue}
            onChange={(event) =>
              onSearchChange?.(
                event.target.value
              )
            }
            placeholder="Search anything..."
            className="w-full h-11 rounded-xl border border-[#E5D6D0] bg-white pl-11 pr-4 text-sm text-[#1E1E1E] outline-none focus:border-[#7A1F2B] focus:ring-2 focus:ring-[#D8A7A7]/30 transition"
          />

        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-3">

          <button
            type="button"
            className="relative w-10 h-10 rounded-xl bg-white border border-[#E5D6D0] flex items-center justify-center text-[#5B0F18] hover:bg-[#F8F1E7] transition"
          >
            <Bell className="w-5 h-5" />

            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#7A1F2B]" />
          </button>

          <div className="hidden sm:block w-px h-8 bg-[#E5D6D0]" />

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-full bg-[#D8A7A7] flex items-center justify-center">
              <User className="w-5 h-5 text-[#5B0F18]" />
            </div>

            <div className="hidden sm:block">

              <p className="text-sm font-semibold text-[#1E1E1E]">
                {user?.username || "Administrator"}
              </p>

              <p className="text-[11px] text-[#8C7777]">
                {user?.role || "Admin"}
              </p>

            </div>

          </div>

        </div>

      </div>

    </header>
  );
}