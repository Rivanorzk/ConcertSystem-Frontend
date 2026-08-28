// components/NotificationBadge.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { getUnreadCount } from "@/services/notificationService";
import useAuth from "@/hooks/useAuth";

export default function NotificationBadge() {
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
                console.error('Error loading unread count:', error);
            } finally {
                setLoading(false);
            }
        };

        loadUnreadCount();

        // Refresh every 30 seconds
        const interval = setInterval(loadUnreadCount, 30000);
        
        // Listen untuk notifikasi baru (jika menggunakan WebSocket)
        // window.addEventListener('new-notification', loadUnreadCount);

        return () => {
            clearInterval(interval);
            // window.removeEventListener('new-notification', loadUnreadCount);
        };
    }, [user]);

    if (!user || user.role?.toLowerCase() !== "customer") return null;

    return (
        <Link 
            href="/customer/notifications" 
            className="relative p-2 rounded-xl hover:bg-[#F8F1E7] transition"
        >
            <Bell className="w-5 h-5 text-[#7A1F2B]" />
            {!loading && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#7A1F2B] text-[#F8F1E7] text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                </span>
            )}
        </Link>
    );
}