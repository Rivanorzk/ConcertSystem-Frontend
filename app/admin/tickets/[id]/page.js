"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Ticket,
    CalendarDays,
    MapPin,
    User,
    QrCode,
} from "lucide-react";

import { getTicketById } from "@/services/ticketService";

export default function TicketDetailPage() {
    const { id } = useParams();

    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const loadTicket = async () => {
            try {
                const data =
                    await getTicketById(id);

                setTicket(data);
            } catch (error) {
                console.error(
                    "Failed to load ticket:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        loadTicket();
    }, [id]);

    if (loading) {
        return <Loading />;
    }

    if (!ticket) {
        return (
            <div className="min-h-screen p-8 flex items-center justify-center">
                <div className="text-center">

                    <Ticket className="w-10 h-10 mx-auto text-[#A68C8C]" />

                    <h2 className="mt-4 font-semibold text-[#2D1719]">
                        Ticket not found
                    </h2>

                    <Link
                        href="/admin/tickets"
                        className="inline-flex items-center gap-2 mt-4 text-sm text-[#7A1F2B]"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Tickets
                    </Link>

                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-5 lg:p-8">
            <div className="max-w-5xl mx-auto">

                {/* BACK */}
                <Link
                    href="/admin/tickets"
                    className="inline-flex items-center gap-2 text-sm text-[#7A1F2B] mb-6 hover:underline"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Tickets
                </Link>

                <div className="grid lg:grid-cols-[1fr_320px] gap-6">

                    {/* INFORMATION */}
                    <div className="bg-white border border-[#E5D6D0] rounded-2xl overflow-hidden">

                        <div className="p-6 border-b border-[#E5D6D0]">

                            <div className="flex items-start justify-between gap-4">

                                <div className="flex items-center gap-3">

                                    <div className="w-12 h-12 rounded-xl bg-[#F8F1E7] flex items-center justify-center">
                                        <Ticket className="w-6 h-6 text-[#5B0F18]" />
                                    </div>

                                    <div>
                                        <p className="text-xs text-[#A68C8C]">
                                            Ticket Code
                                        </p>

                                        <h1 className="text-xl font-bold text-[#2D1719] break-all">
                                            {ticket.ticket_code}
                                        </h1>
                                    </div>

                                </div>

                                <StatusBadge
                                    status={ticket.status}
                                />

                            </div>

                        </div>

                        <div className="p-6 space-y-6">

                            <InfoItem
                                icon={Ticket}
                                label="Event"
                                value={
                                    ticket.event_title
                                }
                            />

                            <InfoItem
                                icon={Ticket}
                                label="Ticket Category"
                                value={
                                    ticket.category_name
                                }
                            />

                            <InfoItem
                                icon={User}
                                label="Customer"
                                value={
                                    ticket.username ||
                                    "-"
                                }
                            />

                            <InfoItem
                                icon={CalendarDays}
                                label="Event Date"
                                value={
                                    formatDate(
                                        ticket.event_date
                                    )
                                }
                            />

                            <InfoItem
                                icon={CalendarDays}
                                label="Start Time"
                                value={
                                    formatTime(
                                        ticket.start_time
                                    )
                                }
                            />

                            <InfoItem
                                icon={MapPin}
                                label="Location"
                                value={
                                    ticket.location ||
                                    "-"
                                }
                            />

                        </div>

                    </div>

                    {/* QR */}
                    <div className="bg-white border border-[#E5D6D0] rounded-2xl p-6">

                        <div className="flex items-center gap-2 mb-5">

                            <QrCode className="w-5 h-5 text-[#7A1F2B]" />

                            <h2 className="font-semibold text-[#2D1719]">
                                Ticket QR Code
                            </h2>

                        </div>

                        <div className="flex flex-col items-center">

                            {ticket.qr_code ? (
                                <div className="p-4 border border-[#E5D6D0] rounded-2xl bg-white">

                                    <img
                                        src={ticket.qr_code}
                                        alt="Ticket QR Code"
                                        className="w-56 h-56"
                                    />

                                </div>
                            ) : (
                                <div className="w-56 h-56 rounded-2xl bg-[#FCF9F6] flex items-center justify-center">

                                    <p className="text-sm text-[#8C7777]">
                                        QR unavailable
                                    </p>

                                </div>
                            )}

                            <p className="text-xs text-[#8C7777] text-center mt-4">
                                Scan this QR code to verify
                                the ticket.
                            </p>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}

function InfoItem({
    icon: Icon,
    label,
    value,
}) {
    return (
        <div className="flex items-start gap-3">

            <div className="w-9 h-9 rounded-lg bg-[#F8F1E7] flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-[#7A1F2B]" />
            </div>

            <div className="min-w-0">

                <p className="text-xs text-[#A68C8C]">
                    {label}
                </p>

                <p className="text-sm font-medium text-[#2D1719] mt-1 break-words">
                    {value || "-"}
                </p>

            </div>

        </div>
    );
}

function StatusBadge({ status }) {
    const config = {
        active: "bg-green-50 text-green-700",
        used: "bg-blue-50 text-blue-700",
        expired: "bg-gray-100 text-gray-600",
        cancelled: "bg-red-50 text-red-700",
    };

    return (
        <span
            className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                config[status] ||
                "bg-gray-100 text-gray-600"
            }`}
        >
            {status || "Unknown"}
        </span>
    );
}

function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center">

            <div className="flex flex-col items-center gap-3">

                <div className="w-8 h-8 rounded-full border-2 border-[#D8A7A7] border-t-[#5B0F18] animate-spin" />

                <p className="text-sm text-[#8C7777]">
                    Loading ticket...
                </p>

            </div>

        </div>
    );
}

function formatDate(date) {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
        "en-US",
        {
            day: "2-digit",
            month: "long",
            year: "numeric",
        }
    );
}

function formatTime(time) {
    if (!time) return "-";

    return String(time).slice(0, 5);
}