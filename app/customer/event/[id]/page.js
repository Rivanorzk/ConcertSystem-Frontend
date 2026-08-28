// app/customer/event/[id]/page.js
"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    CalendarDays,
    ChevronRight,
    Clock,
    Info,
    Loader2,
    MapPin,
    Music,
    Ticket,
    Users,
} from "lucide-react";
import { toast } from "react-hot-toast";

import { getEventById } from "@/services/eventService";
import { isAuthenticated } from "@/lib/auth";
import LoadingSpinner from "@/components/loadingSpinner";
import EmptyState from "@/components/emptyState";
import { currency, formatDate, formatTime } from "@/lib/formatter";

function initialsOf(name = "") {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "EV";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
}

function getStatusColor(status) {
    switch (status?.toLowerCase()) {
        case "published":
            return "bg-white/95 text-[#1E7A4C]";
        case "finished":
            return "bg-white/95 text-[#737373]";
        case "cancelled":
            return "bg-white/95 text-[#B3261E]";
        case "draft":
            return "bg-white/95 text-[#B4841F]";
        default:
            return "bg-white/95 text-[#737373]";
    }
}

function getStatusLabel(status) {
    switch (status?.toLowerCase()) {
        case "published":
            return "Available";
        case "finished":
            return "Finished";
        case "cancelled":
            return "Cancelled";
        case "draft":
            return "Draft";
        default:
            return status || "Unknown";
    }
}

export default function CustomerEventDetailPage() {
    const { id } = useParams();
    const router = useRouter();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isBooking, setIsBooking] = useState(false);
    const [activeTab, setActiveTab] = useState("details");
    const [now, setNow] = useState(() => new Date());

    const ticketSectionRef = useRef(null);

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(isAuthenticated());
    }, []);

    // Perbarui waktu tiap menit supaya label "Starts in..." tetap akurat
    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const loadEvent = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getEventById(id);

                setEvent({
                    ...data,
                    ticket_categories: data?.ticket_categories || [],
                });

                if (data?.ticket_categories?.length > 0) {
                    setSelectedTicket(data.ticket_categories[0]);
                }
            } catch (err) {
                console.error("Error loading event:", err);
                setError(err.message || "Failed to load event details");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadEvent();
        }
    }, [id]);

    const handleBooking = async () => {
        if (!isLoggedIn) {
            toast.error("Please login to book tickets");
            localStorage.setItem("redirectAfterLogin", window.location.pathname);
            router.push("/login");
            return;
        }

        if (!selectedTicket) {
            toast.error("Please select a ticket category");
            return;
        }

        if (quantity < 1) {
            toast.error("Minimum quantity is 1");
            return;
        }

        if (quantity > selectedTicket.remaining_stock) {
            toast.error(`Only ${selectedTicket.remaining_stock} tickets available`);
            return;
        }

        try {
            setIsBooking(true);
            router.push(
                `/customer/checkout?event_id=${event.id}&ticket_id=${selectedTicket.id}&quantity=${quantity}`
            );
        } catch (error) {
            console.error("Booking error:", error);
            toast.error("Failed to book ticket. Please try again.");
        } finally {
            setIsBooking(false);
        }
    };

    const goToTickets = () => {
        setActiveTab("tickets");
        requestAnimationFrame(() => {
            ticketSectionRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        });
    };

    /* =========================
       LOADING
    ========================= */
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <LoadingSpinner text="Loading event details..." />
            </div>
        );
    }

    /* =========================
       ERROR
    ========================= */
    if (error || !event) {
        return (
            <div className="min-h-screen bg-white p-5 lg:p-8">
                <div className="mx-auto max-w-5xl">
                    <EmptyState
                        title="Event Not Found"
                        description={error || "The event you're looking for doesn't exist."}
                    />
                    <Link
                        href="/customer/event"
                        className="mt-4 inline-flex items-center gap-2 text-[#7A1F2B] hover:underline"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Events
                    </Link>
                </div>
            </div>
        );
    }

    const isAvailable = event.status?.toLowerCase() === "published";
    const hasTickets = event.ticket_categories?.length > 0;

    // Label hitung mundur, dihitung dari tanggal + jam mulai event
    let countdownLabel = null;
    if (event.event_date) {
        const eventDateTime = new Date(
            `${event.event_date}T${event.start_time || "00:00"}`
        );
        if (!Number.isNaN(eventDateTime.getTime())) {
            const diffMs = eventDateTime - now;
            if (diffMs <= 0) {
                countdownLabel = "Sedang berlangsung";
            } else {
                const diffMinutes = Math.round(diffMs / 60000);
                if (diffMinutes < 60) {
                    countdownLabel = `Mulai dalam ${Math.max(1, diffMinutes)}m`;
                } else if (diffMinutes < 60 * 24) {
                    countdownLabel = `Mulai dalam ${Math.round(diffMinutes / 60)}j`;
                } else {
                    countdownLabel = `Mulai dalam ${Math.round(diffMinutes / (60 * 24))}h`;
                }
            }
        }
    }

    const tabs = [
        { id: "details", label: "Details", icon: Info },
        { id: "tickets", label: "Tickets", icon: Ticket },
    ];

    return (
        // Halaman penuh (fullscreen): "melawan" padding bawaan dari UserLayout
        // (px-4 py-6 sm:px-6 lg:px-8) dengan negative margin yang sama persis,
        // supaya hero benar-benar full-bleed sampai ke tepi area konten.
        // Background dasar putih; foto blur hanya mengisi area hero di bagian atas.
        <div className="relative -mx-4 -mt-6 min-h-screen bg-white sm:-mx-6 lg:-mx-8">
            {/* HERO BACKGROUND — poster event yang di-blur, HANYA di bagian atas layar */}
            <div className="absolute inset-x-0 top-0 h-[260px] overflow-hidden sm:h-[340px] lg:h-[380px]">
                {event.poster ? (
                    <img
                        src={event.poster}
                        alt=""
                        aria-hidden="true"
                        className="h-full w-full scale-110 object-cover opacity-60 blur-2xl"
                    />
                ) : (
                    <div className="h-full w-full bg-gradient-to-br from-[#5B0F18] via-[#7A1F2B] to-[#3A0810]" />
                )}
                <div className="absolute inset-0 bg-[#1E1E1E]/45" />
                {/* fade halus ke putih supaya transisi ke konten di bawah tidak terpotong tajam */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white" />
            </div>

            <div className="relative mx-auto flex w-full max-w-3xl flex-col">
                {/* TOP BAR — full width, tanpa margin luar */}
                <div className="animate-fade-up flex items-center justify-between p-4 sm:p-5">
                    <Link
                        href="/customer/event"
                        className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-[#1E1E1E] shadow-sm backdrop-blur transition hover:bg-white"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </Link>
                </div>

                {/* CARD — full width, tanpa margin/padding samping */}
                <div
                    className="animate-fade-up w-full overflow-hidden bg-white shadow-2xl sm:rounded-3xl"
                    style={{ animationDelay: "80ms" }}
                >
                    {/* POSTER */}
                    <div className="relative">
                        {event.poster ? (
                            <img
                                src={event.poster}
                                alt={event.title}
                                className="h-[240px] w-full object-cover sm:h-[320px]"
                            />
                        ) : (
                            <div className="flex h-[240px] w-full items-center justify-center bg-gradient-to-br from-[#5B0F18] to-[#7A1F2B] sm:h-[320px]">
                                <Music className="h-16 w-16 text-white/30" />
                            </div>
                        )}

                        <span
                            className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm ${getStatusColor(
                                event.status
                            )}`}
                        >
                            {getStatusLabel(event.status)}
                        </span>

                        {countdownLabel && (
                            <span className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#1E1E1E] shadow-sm">
                                {countdownLabel}
                            </span>
                        )}
                    </div>

                    <div className="p-6 sm:p-8">
                        {/* TITLE */}
                        <h1 className="text-2xl font-bold text-[#1E1E1E] sm:text-3xl">
                            {event.title || "Untitled Event"}
                        </h1>

                        {/* META LINE */}
                        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#8C7777]">
                            <span>{formatDate(event.event_date)}</span>
                            <span>•</span>
                            <span>{formatTime(event.start_time)}</span>
                            {event.category_name && (
                                <>
                                    <span>•</span>
                                    <span>{event.category_name}</span>
                                </>
                            )}
                        </div>

                        {/* ORGANIZER */}
                        {event.admin_username && (
                            <div className="mt-4 flex items-center gap-2 text-sm">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#5B0F18] text-[10px] font-bold text-white">
                                    {initialsOf(event.admin_username)}
                                </div>
                                <span className="text-[#737373]">
                                    Diselenggarakan oleh{" "}
                                    <span className="font-semibold text-[#1E1E1E]">
                                        {event.admin_username}
                                    </span>
                                </span>
                            </div>
                        )}

                        {/* LOCATION */}
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[#8C7777]">
                            <MapPin className="h-4 w-4 shrink-0 text-[#7A1F2B]" />
                            <span>{event.location || "To be announced"}</span>
                            {event.latitude && event.longitude && (
                                <a
                                    href={`https://maps.google.com/maps?q=${event.latitude},${event.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#7A1F2B] hover:underline"
                                >
                                    View on map
                                    <ChevronRight className="h-3 w-3" />
                                </a>
                            )}
                        </div>

                        {/* CTA UTAMA — pengganti "Check In" (khusus organizer) */}
                        {isAvailable && hasTickets && (
                            <button
                                onClick={goToTickets}
                                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1E1E1E] py-3.5 text-sm font-bold text-white transition hover:bg-[#3A0810] sm:w-auto sm:px-8"
                            >
                                <Ticket size={16} />
                                Pilih Tiket
                            </button>
                        )}

                        {/* TABS */}
                        <div className="mt-8 flex gap-6 border-b border-[#E5D6D0]">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-1.5 border-b-2 pb-3 text-sm font-semibold transition ${
                                            isActive
                                                ? "border-[#7A1F2B] text-[#7A1F2B]"
                                                : "border-transparent text-[#A68C8C] hover:text-[#5B0F18]"
                                        }`}
                                    >
                                        <Icon size={15} />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* TAB CONTENT */}
                        <div ref={ticketSectionRef} className="mt-6 scroll-mt-8">
                            {activeTab === "details" ? (
                                <div>
                                    <h2 className="font-semibold text-[#1E1E1E]">Description</h2>
                                    <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[#8C7777]">
                                        {event.description || "No description provided for this event."}
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <div className="mb-4">
                                        <h2 className="text-lg font-bold text-[#1E1E1E]">
                                            Ticket Categories
                                        </h2>
                                        <p className="mt-1 text-sm text-[#8C7777]">
                                            Select your ticket type
                                        </p>
                                    </div>

                                    {!isAvailable ? (
                                        <div className="rounded-2xl border border-dashed border-[#E5D6D0] p-8 text-center">
                                            <Info className="mx-auto h-8 w-8 text-gray-400" />
                                            <p className="mt-2 text-sm text-[#8C7777]">
                                                This event is not available for booking
                                            </p>
                                        </div>
                                    ) : !hasTickets ? (
                                        <div className="rounded-2xl border border-dashed border-[#E5D6D0] p-8 text-center">
                                            <Ticket className="mx-auto h-8 w-8 text-gray-400" />
                                            <p className="mt-2 text-sm text-[#8C7777]">
                                                No ticket categories available
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                {event.ticket_categories.map((ticket) => (
                                                    <button
                                                        key={ticket.id}
                                                        onClick={() => setSelectedTicket(ticket)}
                                                        disabled={ticket.remaining_stock === 0}
                                                        className={`rounded-2xl border p-5 text-left transition ${
                                                            selectedTicket?.id === ticket.id
                                                                ? "border-[#5B0F18] bg-[#F8F1E7]"
                                                                : "border-[#E5D6D0] hover:border-[#D8A7A7]"
                                                        } ${
                                                            ticket.remaining_stock === 0
                                                                ? "cursor-not-allowed opacity-50"
                                                                : ""
                                                        }`}
                                                    >
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div>
                                                                <h3 className="font-bold text-[#1E1E1E]">
                                                                    {ticket.category_name || "Regular"}
                                                                </h3>
                                                                <p className="mt-1 text-sm text-[#8C7777]">
                                                                    {ticket.remaining_stock} tickets left
                                                                </p>
                                                            </div>
                                                            <p className="text-lg font-bold text-[#7A1F2B]">
                                                                {currency(ticket.price)}
                                                            </p>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>

                                            {selectedTicket && (
                                                <div className="mt-4 border-t border-[#E5D6D0] pt-6">
                                                    <div className="flex flex-wrap items-end justify-between gap-4">
                                                        <div>
                                                            <label className="mb-1.5 block text-sm font-medium text-[#1E1E1E]">
                                                                Quantity
                                                            </label>
                                                            <div className="flex items-center gap-3">
                                                                <button
                                                                    onClick={() =>
                                                                        setQuantity(Math.max(1, quantity - 1))
                                                                    }
                                                                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E5D6D0] transition hover:bg-[#F8F1E7]"
                                                                >
                                                                    -
                                                                </button>
                                                                <span className="w-12 text-center font-medium text-[#1E1E1E]">
                                                                    {quantity}
                                                                </span>
                                                                <button
                                                                    onClick={() => {
                                                                        const max =
                                                                            selectedTicket?.remaining_stock || 0;
                                                                        setQuantity(Math.min(max, quantity + 1));
                                                                    }}
                                                                    disabled={
                                                                        quantity >=
                                                                        (selectedTicket?.remaining_stock || 0)
                                                                    }
                                                                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E5D6D0] transition hover:bg-[#F8F1E7] disabled:cursor-not-allowed disabled:opacity-40"
                                                                >
                                                                    +
                                                                </button>
                                                                <span className="text-xs text-[#8C7777]">
                                                                    Max {selectedTicket?.remaining_stock || 0}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="text-right">
                                                            <p className="text-sm text-[#8C7777]">Total</p>
                                                            <p className="text-2xl font-bold text-[#5B0F18]">
                                                                {currency(selectedTicket.price * quantity)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={handleBooking}
                                                        disabled={
                                                            isBooking || selectedTicket.remaining_stock === 0
                                                        }
                                                        className={`mt-4 w-full rounded-xl py-3.5 font-semibold text-[#F8F1E7] transition ${
                                                            isBooking || selectedTicket.remaining_stock === 0
                                                                ? "cursor-not-allowed bg-gray-400"
                                                                : "bg-[#5B0F18] hover:bg-[#7A1F2B]"
                                                        }`}
                                                    >
                                                        {isBooking ? (
                                                            <div className="flex items-center justify-center gap-2">
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                                Processing...
                                                            </div>
                                                        ) : !isLoggedIn ? (
                                                            "Login to Book"
                                                        ) : selectedTicket?.remaining_stock === 0 ? (
                                                            "Sold Out"
                                                        ) : (
                                                            "Book Now"
                                                        )}
                                                    </button>
                                                    {!isLoggedIn && (
                                                        <p className="mt-2 text-center text-xs text-[#8C7777]">
                                                            Please login to book tickets
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* spacer bawah agar card tidak mepet ke ujung layar */}
                <div className="h-8 sm:h-12" />
            </div>

            <style jsx global>{`
                @keyframes fadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(16px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-up {
                    opacity: 0;
                    animation: fadeUp 0.6s ease-out forwards;
                }
            `}</style>
        </div>
    );
}