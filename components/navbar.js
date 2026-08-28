"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, Menu, Search } from "lucide-react";
import SearchBar from "./searchBar";
import NotificationButton from "./notificationButton";
import UserMenu from "./userMenu";
import { useSearch } from "@/contexts/searchContext";
import useAuth from "@/hooks/useAuth";
import { useState } from "react";

export default function Navbar({ onMenuClick }) {
  const { search, setSearch } = useSearch();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Tentukan dashboard URL berdasarkan role
  const getDashboardUrl = () => {
    if (!user) return "/login";
    
    switch (user.role?.toLowerCase()) {
      case "admin":
        return "/admin/dashboard";
      case "superadmin":
        return "/admin/dashboard";
      default:
        return "/customer/dashboard";
    }
  };

  // Tentukan warna/theme berdasarkan role
  const getThemeColor = () => {
    if (!user) return "#5B0F18";
    
    switch (user.role?.toLowerCase()) {
      case "admin":
        return "#1a365d"; // Biru untuk admin
      case "superadmin":
        return "#9b2c2c"; // Merah untuk superadmin
      default:
        return "#5B0F18"; // Coklat untuk customer
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E5D6D0] bg-[#F8F1E7]/95 backdrop-blur">
      
      {/* ==================== DESKTOP ==================== */}
      <div className="hidden lg:flex h-[82px] w-full items-center justify-between px-8 xl:px-10">
        

        {/* Search - Desktop */}
        <div className="flex-1 max-w-[500px] mx-8">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search events, artists, locations..."
          />
        </div>

        {/* Right Side - Desktop */}
        <div className="flex items-center gap-4 shrink-0">
          
          {/* ✅ Hanya tampilkan notifikasi jika user login */}
          {user && !loading && (
            <>
              <NotificationButton />
              <div className="h-8 w-px bg-[#E5D6D0]" />
            </>
          )}

          <UserMenu
            name={user?.username || "Guest"}
            subtitle={user?.email || "Sign in to continue"}
            isLoggedIn={!!user}
            avatar={user?.profile_image} // ✅ tambahkan ini
          />

        </div>
      </div>

      {/* ==================== MOBILE ==================== */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <div className="h-16 px-4 flex items-center justify-between">
          
          {/* Logo */}
          <Link
            href={getDashboardUrl()}
            className="flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5B0F18]">
              <CalendarDays className="h-5 w-5 text-[#F8F1E7]" />
            </div>
            <span className="text-xl font-bold text-[#5B0F18]">
              Eventify
            </span>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5">
            
            {/* ✅ Toggle search button */}
            <button
              type="button"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-[#5B0F18]/10 transition"
              aria-label="Toggle search"
            >
              <Search className="h-5 w-5 text-[#5B0F18]" />
            </button>

            {/* ✅ Notification - hanya jika login */}
            {user && !loading && <NotificationButton />}

            {/* Menu Toggle */}
            <button
              type="button"
              onClick={onMenuClick}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5B0F18] text-[#F8F1E7] hover:bg-[#7A1F2B] transition"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </button>

          </div>
        </div>

        {/* ✅ Mobile Search Bar - Expandable */}
        {showMobileSearch && (
          <div className="px-4 pb-3">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search events..."
              autoFocus
              onBlur={() => {
                // Sembunyikan search setelah beberapa detik jika kosong
                if (!search) {
                  setTimeout(() => setShowMobileSearch(false), 3000);
                }
              }}
            />
          </div>
        )}
      </div>

    </header>
  );
}