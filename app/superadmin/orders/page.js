// app/superadmin/orders/page.js
"use client";

import { useEffect, useMemo, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { toast } from "react-hot-toast";

import { getOrders } from "@/services/orderService";
import LoadingSpinner from "@/components/loadingSpinner";
import EmptyState from "@/components/emptyState";
import { currency, formatDate, formatTime } from "@/lib/formatter";

const STATUS_OPTIONS = [
    { value: "all", label: "Semua Status" },
    { value: "pending", label: "Pending" },
    { value: "paid", label: "Paid" },
    { value: "expired", label: "Expired" },
    { value: "cancelled", label: "Cancelled" },
    { value: "failed", label: "Failed" },
];

const STATUS_BADGES = {
    pending: "bg-[#FDF3D8] text-[#B4841F]",
    paid: "bg-[#E4F3EA] text-[#1E7A4C]",
    expired: "bg-[#F3E4E4] text-[#B3261E]",
    cancelled: "bg-[#F3E4E4] text-[#B3261E]",
    failed: "bg-[#F3E4E4] text-[#B3261E]",
};

export default function SuperadminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("all");

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const data = await getOrders();
                setOrders(data);
            } catch (err) {
                toast.error(err.message || "Gagal memuat pesanan");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const filtered = useMemo(() => {
        if (status === "all") return orders;
        return orders.filter((o) => o.status === status);
    }, [orders, status]);

    const totalRevenue = useMemo(
        () =>
            orders
                .filter((o) => o.status === "paid")
                .reduce((sum, o) => sum + Number(o.final_price || 0), 0),
        [orders]
    );

    return (
        <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="flex items-center gap-2 text-xl font-bold text-[#1E1E1E]">
                        <ShoppingBag className="h-5 w-5 text-[#7A1F2B]" />
                        Pesanan
                    </h1>
                    <p className="mt-1 text-sm text-[#8C7777]">
                        {orders.length} total pesanan • {currency(totalRevenue)} pendapatan (paid)
                    </p>
                </div>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="rounded-xl border border-[#E5D6D0] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#7A1F2B]"
                >
                    {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="flex justify-center py-16">
                    <LoadingSpinner text="Memuat pesanan..." />
                </div>
            ) : filtered.length === 0 ? (
                <EmptyState title="Tidak ada pesanan" description="Belum ada pesanan yang cocok dengan filter ini." />
            ) : (
                <div className="overflow-hidden rounded-2xl border border-[#E5D6D0] bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#F8F1E7] text-xs uppercase tracking-wide text-[#8C7777]">
                                <tr>
                                    <th className="px-5 py-3 font-semibold">Invoice</th>
                                    <th className="px-5 py-3 font-semibold">Customer</th>
                                    <th className="px-5 py-3 font-semibold">Event</th>
                                    <th className="px-5 py-3 font-semibold">Total</th>
                                    <th className="px-5 py-3 font-semibold">Status</th>
                                    <th className="px-5 py-3 font-semibold">Waktu</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E5D6D0]">
                                {filtered.map((o) => (
                                    <tr key={o.id}>
                                        <td className="whitespace-nowrap px-5 py-3 font-medium text-[#1E1E1E]">
                                            {o.invoice_number}
                                        </td>
                                        <td className="px-5 py-3 text-[#1E1E1E]">{o.username}</td>
                                        <td className="px-5 py-3 text-[#8C7777]">{o.event_title}</td>
                                        <td className="whitespace-nowrap px-5 py-3 font-semibold text-[#5B0F18]">
                                            {currency(o.final_price)}
                                        </td>
                                        <td className="px-5 py-3">
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                    STATUS_BADGES[o.status] || "bg-[#F8F1E7] text-[#8C7777]"
                                                }`}
                                            >
                                                {o.status}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-3 text-[#8C7777]">
                                            {formatDate(o.created_at)} {formatTime(o.created_at)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}