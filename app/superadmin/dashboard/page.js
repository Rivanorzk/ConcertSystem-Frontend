// app/superadmin/dashboard/page.js
"use client";

import { useEffect, useState } from "react";
import {
    CalendarDays,
    Loader2,
    ShoppingBag,
    Ticket,
    Users,
    Wallet,
} from "lucide-react";

import { getEvents } from "@/services/eventService";
import { getOrders } from "@/services/orderService";
import { getUsers } from "@/services/userService";
import { currency } from "@/lib/formatter";

function StatCard({ icon: Icon, label, value, hint }) {
    return (
        <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F8F1E7] text-[#7A1F2B]">
                    <Icon className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-xs text-[#8C7777]">{label}</p>
                    <p className="text-xl font-bold text-[#1E1E1E]">{value}</p>
                </div>
            </div>
            {hint && <p className="mt-3 text-xs text-[#8C7777]">{hint}</p>}
        </div>
    );
}

export default function SuperadminDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalEvents: 0,
        publishedEvents: 0,
        totalOrders: 0,
        paidOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
    });

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);

                const [events, orders, users] = await Promise.all([
                    getEvents({ status: "all" }),
                    getOrders(),
                    getUsers(),
                ]);

                const paidOrders = orders.filter((o) => o.status === "paid");
                const totalRevenue = paidOrders.reduce(
                    (sum, o) => sum + Number(o.final_price || 0),
                    0
                );

                setStats({
                    totalEvents: events.length,
                    publishedEvents: events.filter((e) => e.status === "published").length,
                    totalOrders: orders.length,
                    paidOrders: paidOrders.length,
                    totalUsers: users.length,
                    totalRevenue,
                });
            } catch (err) {
                console.error("Error loading dashboard stats:", err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-[#7A1F2B]" />
            </div>
        );
    }

    return (
        <div>
            <h1 className="mb-1 text-xl font-bold text-[#1E1E1E]">Dashboard</h1>
            <p className="mb-6 text-sm text-[#8C7777]">
                Ringkasan aktivitas seluruh platform.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    icon={CalendarDays}
                    label="Total Event"
                    value={stats.totalEvents}
                    hint={`${stats.publishedEvents} sedang published`}
                />
                <StatCard
                    icon={ShoppingBag}
                    label="Total Pesanan"
                    value={stats.totalOrders}
                    hint={`${stats.paidOrders} sudah dibayar`}
                />
                <StatCard
                    icon={Users}
                    label="Total User"
                    value={stats.totalUsers}
                />
                <StatCard
                    icon={Wallet}
                    label="Total Pendapatan"
                    value={currency(stats.totalRevenue)}
                    hint="Dari order berstatus paid"
                />
                <StatCard
                    icon={Ticket}
                    label="Rata-rata Nilai Order"
                    value={
                        stats.paidOrders > 0
                            ? currency(stats.totalRevenue / stats.paidOrders)
                            : currency(0)
                    }
                />
            </div>
        </div>
    );
}