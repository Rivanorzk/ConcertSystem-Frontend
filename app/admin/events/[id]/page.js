"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Pencil,
    MapPin,
    CalendarDays,
    Tag,
} from "lucide-react";

import { getEventById } from "@/services/eventService";
import LoadingSpinner from "@/components/loadingSpinner";
import EmptyState from "@/components/emptyState";

export default function EventDetailPage() {
    const { id } = useParams(); // ✅ Ambil id dari useParams

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // ✅ Tambahkan state error

    useEffect(() => {
        const loadEvent = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // ✅ Gunakan 'id' bukan 'params.id'
                const data = await getEventById(id);
                
                console.log('Event data:', data); // Debug
                
                // Pastikan ticket_categories selalu array
                setEvent({
                    ...data,
                    ticket_categories: data?.ticket_categories || []
                });
                
            } catch (err) {
                console.error('Error loading event:', err);
                setError(err.message || "Failed to load event");
            } finally {
                setLoading(false);
            }
        };

        if (id) { // ✅ Cek 'id' bukan 'params.id'
            loadEvent();
        }
    }, [id]); // ✅ Gunakan 'id' sebagai dependency

    // ✅ Handle loading state
    if (loading) {
        return <LoadingSpinner text="Loading event details..." />;
    }

    // ✅ Handle error state
    if (error) {
        return (
            <div className="min-h-screen p-5 lg:p-8">
                <div className="max-w-5xl mx-auto">
                    <EmptyState 
                        title="Error Loading Event" 
                        description={error}
                    />
                    <Link
                        href="/admin/events"
                        className="mt-4 inline-flex items-center gap-2 text-[#7A1F2B]"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Events
                    </Link>
                </div>
            </div>
        );
    }

    // ✅ Handle event not found
    if (!event) {
        return (
            <div className="min-h-screen p-5 lg:p-8">
                <div className="max-w-5xl mx-auto">
                    <EmptyState 
                        title="Event Not Found" 
                        description="The event you're looking for doesn't exist."
                    />
                    <Link
                        href="/admin/events"
                        className="mt-4 inline-flex items-center gap-2 text-[#7A1F2B]"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Events
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-5 lg:p-8">
            <div className="max-w-5xl mx-auto">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">

                    <Link
                        href="/admin/events"
                        className="flex items-center gap-2 text-sm text-[#7A1F2B]"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Link>

                    <Link
                        href={`/admin/events/${id}/edit`}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#5B0F18] text-[#F8F1E7] rounded-xl text-sm font-semibold hover:bg-[#7A1F2B] transition"
                    >
                        <Pencil className="w-4 h-4" />
                        Edit
                    </Link>

                </div>

                {/* EVENT CARD */}
                <div className="bg-white border border-[#E5D6D0] rounded-2xl overflow-hidden text-black">

                    {/* POSTER */}
                    {event.poster && (
                        <img
                            src={event.poster}
                            alt={event.title}
                            className="w-full h-[280px] object-cover"
                        />
                    )}

                    <div className="p-6">

                        {/* STATUS + CATEGORY */}
                        <div className="flex flex-wrap items-center gap-2">

                            <span className="px-3 py-1 rounded-lg bg-[#F8F1E7] text-xs font-semibold text-[#7A1F2B] capitalize">
                                {event.status || "Draft"}
                            </span>

                            {event.category_name && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F8F1E7] text-xs font-semibold text-[#7A1F2B]">
                                    <Tag className="w-3.5 h-3.5" />
                                    {event.category_name}
                                </span>
                            )}

                        </div>

                        {/* TITLE */}
                        <h1 className="mt-3 text-3xl font-bold">
                            {event.title || "Untitled Event"}
                        </h1>

                        {/* EVENT INFO */}
                        <div className="flex flex-wrap gap-x-6 gap-y-3 mt-5 text-sm text-[#8C7777]">

                            <span className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-[#7A1F2B]" />
                                {event.location || "-"}
                            </span>

                            <span className="flex items-center gap-2">
                                <CalendarDays className="w-4 h-4 text-[#7A1F2B]" />
                                {event.event_date || "-"}
                            </span>

                            {event.start_time && (
                                <span className="flex items-center gap-2">
                                    <CalendarDays className="w-4 h-4 text-[#7A1F2B]" />
                                    {event.start_time}
                                </span>
                            )}

                        </div>

                        {/* DESCRIPTION */}
                        <div className="mt-7">
                            <h2 className="font-semibold">
                                Description
                            </h2>

                            <p className="mt-2 text-sm text-[#8C7777] leading-7 whitespace-pre-line">
                                {event.description || "No description."}
                            </p>
                        </div>

                        {/* TICKET CATEGORIES */}
                        <div className="mt-8">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-lg font-bold">
                                        Ticket Categories
                                    </h2>

                                    <p className="text-sm text-[#8C7777] mt-1">
                                        Manage ticket types for this event.
                                    </p>
                                </div>

                                <Link
                                    href={`/admin/events/${id}/tickets/create`}
                                    className="px-4 py-2.5 rounded-xl bg-[#5B0F18] text-[#F8F1E7] text-sm font-semibold hover:bg-[#7A1F2B] transition"
                                >
                                    Add Ticket
                                </Link>
                            </div>

                            {/* ✅ Safe check untuk ticket_categories */}
                            {!event.ticket_categories || event.ticket_categories.length === 0 ? (
                                <div className="border border-dashed border-[#E5D6D0] rounded-2xl p-8 text-center">
                                    <p className="text-sm text-[#8C7777]">
                                        No ticket categories yet.
                                    </p>
                                    <p className="text-xs text-[#8C7777] mt-1">
                                        Click "Add Ticket" to create one.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {event.ticket_categories.map((ticket) => (
                                        <div
                                            key={ticket.id || ticket.ticket_category_id}
                                            className="border border-[#E5D6D0] rounded-2xl p-5 hover:shadow-md transition"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <h3 className="font-bold">
                                                        {ticket.category_name || "Unnamed"}
                                                    </h3>

                                                    <p className="text-lg font-bold text-[#7A1F2B] mt-1">
                                                        Rp {Number(ticket.price || 0).toLocaleString("id-ID")}
                                                    </p>
                                                </div>

                                                <Link
                                                    href={`/admin/events/${id}/tickets/${ticket.id}/edit`}
                                                    className="text-sm text-[#7A1F2B] font-semibold hover:underline"
                                                >
                                                    Edit
                                                </Link>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 mt-5">
                                                <div className="rounded-xl bg-[#F8F1E7] p-3">
                                                    <p className="text-xs text-[#8C7777]">
                                                        Stock
                                                    </p>

                                                    <p className="font-semibold mt-1">
                                                        {ticket.stock || 0}
                                                    </p>
                                                </div>

                                                <div className="rounded-xl bg-[#F8F1E7] p-3">
                                                    <p className="text-xs text-[#8C7777]">
                                                        Available
                                                    </p>

                                                    <p className="font-semibold mt-1">
                                                        {ticket.remaining_stock || 0}
                                                    </p>
                                                </div>
                                            </div>

                                            {ticket.description && (
                                                <p className="text-sm text-[#8C7777] mt-4">
                                                    {ticket.description}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}