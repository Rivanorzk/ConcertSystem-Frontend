import Link from "next/link";
import {
    CalendarDays,
    MapPin,
    ArrowRight,
} from "lucide-react";

export default function AdminRecentEvent({
    events = [],
}) {
    return (
        <div className="bg-white border border-[#E5D6D0] rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E5D6D0] flex items-center justify-between">
                <div>
                    <h2 className="font-semibold text-[#1E1E1E]">
                        Recent Events
                    </h2>

                    <p className="text-xs text-[#8C7777] mt-0.5">
                        Latest events created
                    </p>
                </div>

                <Link
                    href="/admin/events"
                    className="flex items-center gap-1 text-xs font-semibold text-[#7A1F2B]"
                >
                    View all
                    <ArrowRight className="w-3 h-3" />
                </Link>
            </div>

            <div className="divide-y divide-[#F0E5DE]">
                {events.length === 0 ? (
                    <div className="px-5 py-10 text-center">
                        <CalendarDays className="w-8 h-8 mx-auto text-[#D8A7A7]" />

                        <p className="mt-3 text-sm text-[#8C7777]">
                            No events yet
                        </p>
                    </div>
                ) : (
                    events.slice(0, 5).map((event) => (
                        <Link
                            key={event.id}
                            href={`/admin/events/${event.id}`}
                            className="flex items-center gap-3 px-5 py-4 hover:bg-[#F8F1E7]/60 transition"
                        >
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#F8F1E7] shrink-0">
                                {event.poster ? (
                                    <img
                                        src={event.poster}
                                        alt={event.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <CalendarDays className="w-5 h-5 text-[#7A1F2B]" />
                                    </div>
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-[#1E1E1E] truncate">
                                    {event.title}
                                </p>

                                <div className="flex items-center gap-1 mt-1 text-[11px] text-[#8C7777]">
                                    <MapPin className="w-3 h-3" />

                                    <span className="truncate">
                                        {event.location || "Location not set"}
                                    </span>
                                </div>
                            </div>

                            <span
                                className={`text-[10px] font-semibold capitalize ${
                                    event.status === "published"
                                        ? "text-[#287A43]"
                                        : event.status === "cancelled"
                                        ? "text-[#A32D2D]"
                                        : "text-[#7A1F2B]"
                                }`}
                            >
                                {event.status || "draft"}
                            </span>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}