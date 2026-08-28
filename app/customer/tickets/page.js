// app/customer/tickets/page.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Ticket,
    CalendarDays,
    MapPin,
    Clock,
    ChevronRight,
    QrCode
} from "lucide-react";

import { getMyTickets } from "@/services/ticketService";
import SectionHeader from "@/components/sectionHeader";
import LoadingSpinner from "@/components/loadingSpinner";
import EmptyState from "@/components/emptyState";
import { formatDate, formatTime } from "@/lib/formatter";

export default function TicketsPage() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadTickets = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getMyTickets();
                setTickets(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Error loading tickets:", err);
                setError("Gagal memuat tiket. Silakan coba lagi.");
            } finally {
                setLoading(false);
            }
        };

        loadTickets();
    }, []);

    const statusMap = {
        active: { label: "Aktif", color: "bg-green-100 text-green-700" },
        used: { label: "Digunakan", color: "bg-gray-100 text-gray-700" },
        expired: { label: "Kadaluarsa", color: "bg-red-100 text-red-700" },
        cancelled: { label: "Dibatalkan", color: "bg-yellow-100 text-yellow-700" },
    };

    const getStatus = (status) => {
        return statusMap[status?.toLowerCase()] || statusMap.active;
    };

    return (
        <div>
            <SectionHeader
                title="Tiket Saya"
                description="Semua tiket yang Anda miliki"
            />

            <div className="mt-8">
                {loading ? (
                    <LoadingSpinner text="Memuat tiket..." />
                ) : error ? (
                    <EmptyState title="Terjadi Kesalahan" description={error} />
                ) : tickets.length === 0 ? (
                    <EmptyState
                        icon={Ticket}
                        title="Belum Ada Tiket"
                        description="Anda belum memiliki tiket. Pesan event sekarang!"
                    />
                ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                        {tickets.map((ticket) => {
                            const status = getStatus(ticket.status);

                            return (
                                <div
                                    key={ticket.id}
                                    className="bg-white border border-[#E5D6D0] rounded-2xl overflow-hidden hover:shadow-md transition"
                                >
                                    <div className="p-5 border-b border-[#E5D6D0] bg-[#F8F1E7]/30">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold ${status.color}`}>
                                                    {status.label}
                                                </span>
                                                <p className="text-xs text-[#737373] mt-1.5 font-mono">
                                                    {ticket.ticket_code}
                                                </p>
                                            </div>
                                            <div className="w-10 h-10 rounded-xl bg-[#5B0F18] flex items-center justify-center">
                                                <QrCode className="w-5 h-5 text-[#F8F1E7]" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        <h3 className="font-bold text-[#1E1E1E]">
                                            {ticket.event_title || "Event"}
                                        </h3>

                                        <div className="mt-3 space-y-2 text-sm text-[#737373]">
                                            <div className="flex items-center gap-2">
                                                <CalendarDays className="w-4 h-4 text-[#7A1F2B]" />
                                                <span>{formatDate(ticket.event_date)}</span>
                                                <span className="text-[#D8A7A7]">•</span>
                                                <span>{formatTime(ticket.start_time)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-[#7A1F2B]" />
                                                <span className="truncate">{ticket.location || "TBA"}</span>
                                            </div>
                                            {ticket.category_name && (
                                                <div className="flex items-center gap-2">
                                                    <Ticket className="w-4 h-4 text-[#7A1F2B]" />
                                                    <span>{ticket.category_name}</span>
                                                </div>
                                            )}
                                        </div>

                                        <Link
                                            href={`/customer/tickets/${ticket.id}`}
                                            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#7A1F2B] hover:underline"
                                        >
                                            Lihat Detail
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}