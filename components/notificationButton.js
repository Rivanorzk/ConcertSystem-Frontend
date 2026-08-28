// components/notificationButton.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { getUnreadCount } from "@/services/notificationService";
import useAuth from "@/hooks/useAuth";

export default function NotificationButton() {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadUnreadCount = async () => {
      try {
        const count = await getUnreadCount();
        setUnreadCount(count);
      } catch (error) {
        console.error("Error loading unread count:", error);
        // ✅ Fallback: tidak menampilkan error, hanya hide badge
        setUnreadCount(0);
      } finally {
        setLoading(false);
      }
    };

    loadUnreadCount();

    // Refresh setiap 30 detik
    const interval = setInterval(loadUnreadCount, 30000);

    return () => clearInterval(interval);
  }, [user]);

  // ✅ Tentukan URL notifikasi berdasarkan role
  const getNotificationUrl = () => {
    if (!user) return "/login";
    
    switch (user.role?.toLowerCase()) {
      case "admin":
        return "/admin/notification";
      case "superadmin":
        return "/admin/notification";
      default:
        return "/customer/notification";
    }
  };

  // ✅ Tampilkan loading state yang subtle
  if (loading) {
    return (
      <button className="relative p-2 rounded-xl hover:bg-[#F8F1E7] transition">
        <Bell className="w-5 h-5 text-[#A68C8C]" />
      </button>
    );
  }

  return (
    <Link
      href={getNotificationUrl()}
      className="relative p-2 rounded-xl hover:bg-[#F8F1E7] transition"
      aria-label="Notifications"
    >
      <Bell className="w-5 h-5 text-[#7A1F2B]" />
      
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 bg-[#7A1F2B] text-[#F8F1E7] text-[10px] font-bold rounded-full flex items-center justify-center px-1.5">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </Link>
  );
}