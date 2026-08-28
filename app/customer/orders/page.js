// app/customer/orders/page.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    CalendarDays,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Package,
    ChevronRight,
    Ticket
} from "lucide-react";

import { getMyOrders } from "@/services/orderService";
import SectionHeader from "@/components/sectionHeader";
import LoadingSpinner from "@/components/loadingSpinner";
import EmptyState from "@/components/emptyState";
import { currency, formatDate, formatDateTime } from "@/lib/formatter";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadOrders = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getMyOrders();
                setOrders(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Error loading orders:", err);
                setError("Gagal memuat riwayat pesanan. Silakan coba lagi.");
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, []);

    const statusMap = {
        pending: { label: "Pending", icon: Clock, color: "bg-yellow-100 text-yellow-700" },
        paid: { label: "Paid", icon: CheckCircle, color: "bg-green-100 text-green-700" },
        expired: { label: "Expired", icon: XCircle, color: "bg-red-100 text-red-700" },
        cancelled: { label: "Cancelled", icon: AlertCircle, color: "bg-gray-100 text-gray-700" },
    };

    const getStatus = (status) => {
        return statusMap[status?.toLowerCase()] || statusMap.pending;
    };

    return (
        <div>
            <SectionHeader
                title="Riwayat Pesanan"
                description="Lihat semua pesanan tiket Anda"
            />

            <div className="mt-8">
                {loading ? (
                    <LoadingSpinner text="Memuat riwayat pesanan..." />
                ) : error ? (
                    <EmptyState title="Terjadi Kesalahan" description={error} />
                ) : orders.length === 0 ? (
                    <EmptyState
                        icon={Package}
                        title="Belum Ada Pesanan"
                        description="Anda belum memiliki pesanan. Mulai jelajahi event dan pesan tiket sekarang!"
                    />
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => {
                            const status = getStatus(order.status);
                            const StatusIcon = status.icon;

                            return (
                                <Link
                                    key={order.id}
                                    href={`/customer/orders/${order.id}`}
                                    className="block bg-white border border-[#E5D6D0] rounded-2xl p-5 hover:shadow-md transition hover:-translate-y-0.5"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${status.color}`}>
                                                    <StatusIcon className="w-3.5 h-3.5" />
                                                    {status.label}
                                                </span>
                                                <span className="text-xs text-[#737373]">
                                                    #{order.invoice_number}
                                                </span>
                                            </div>

                                            <h3 className="font-bold text-[#1E1E1E] mt-2 truncate">
                                                {order.event_title || "Event"}
                                            </h3>

                                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-[#737373]">
                                                <span className="flex items-center gap-1.5">
                                                    <CalendarDays className="w-4 h-4 text-[#7A1F2B]" />
                                                    {formatDate(order.created_at)}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="w-4 h-4 text-[#7A1F2B]" />
                                                    {formatDateTime(order.created_at)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-right shrink-0">
                                            <p className="text-sm text-[#737373]">Total</p>
                                            <p className="text-lg font-bold text-[#5B0F18]">
                                                {currency(order.final_price)}
                                            </p>
                                            {order.discount_amount > 0 && (
                                                <p className="text-xs text-green-600">
                                                    Diskon {currency(order.discount_amount)}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {order.ticket_count > 0 && (
                                        <div className="mt-4 pt-4 border-t border-[#F0E5DE] flex items-center gap-2 text-sm text-[#737373]">
                                            <Ticket className="w-4 h-4 text-[#7A1F2B]" />
                                            <span>{order.ticket_count} tiket</span>
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}