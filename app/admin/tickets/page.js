"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    Search,
    Ticket,
    Eye,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import { getTickets } from "@/services/ticketService";

const ITEMS_PER_PAGE = 10;

export default function TicketsPage() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [page, setPage] = useState(1);

    useEffect(() => {
        const loadTickets = async () => {
            try {
                setLoading(true);

                const data = await getTickets();

                setTickets(data || []);
            } catch (error) {
                console.error(
                    "Failed to load tickets:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        loadTickets();
    }, []);

    const filteredTickets = useMemo(() => {
        const keyword = search
            .trim()
            .toLowerCase();

        return tickets.filter((ticket) => {
            const matchesSearch =
                !keyword ||
                ticket.ticket_code
                    ?.toLowerCase()
                    .includes(keyword) ||
                ticket.event_title
                    ?.toLowerCase()
                    .includes(keyword) ||
                ticket.username
                    ?.toLowerCase()
                    .includes(keyword) ||
                ticket.category_name
                    ?.toLowerCase()
                    .includes(keyword);

            const matchesStatus =
                status === "all" ||
                ticket.status === status;

            return matchesSearch && matchesStatus;
        });
    }, [tickets, search, status]);

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredTickets.length /
            ITEMS_PER_PAGE
        )
    );

    const currentPage = Math.min(
        page,
        totalPages
    );

    const paginatedTickets = filteredTickets.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleSearch = (value) => {
        setSearch(value);
        setPage(1);
    };

    const handleStatus = (value) => {
        setStatus(value);
        setPage(1);
    };

    return (
        <div className="min-h-screen p-5 lg:p-8">
            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="mb-7">

                    <div className="flex items-center gap-3">

                        <div className="w-11 h-11 rounded-xl bg-[#F8F1E7] flex items-center justify-center">
                            <Ticket className="w-5 h-5 text-[#5B0F18]" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-[#2D1719]">
                                Tickets
                            </h1>

                            <p className="text-sm text-[#8C7777] mt-1">
                                Monitor all tickets purchased by customers
                            </p>
                        </div>

                    </div>

                </div>

                {/* FILTER */}
                <div className="bg-white border border-[#E5D6D0] rounded-2xl p-4 mb-5">

                    <div className="flex flex-col lg:flex-row gap-3">

                        {/* SEARCH */}
                        <div className="relative flex-1">

                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A68C8C]" />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    handleSearch(
                                        e.target.value
                                    )
                                }
                                placeholder="Search ticket, event, customer..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5D6D0] text-sm text-[#2D1719] outline-none focus:border-[#7A1F2B] focus:ring-2 focus:ring-[#7A1F2B]/10"
                            />

                        </div>

                        {/* STATUS */}
                        <select
                            value={status}
                            onChange={(e) =>
                                handleStatus(
                                    e.target.value
                                )
                            }
                            className="w-full lg:w-48 px-4 py-2.5 rounded-xl border border-[#E5D6D0] text-sm text-[#2D1719] outline-none focus:border-[#7A1F2B]"
                        >
                            <option value="all">
                                All Status
                            </option>

                            <option value="active">
                                Active
                            </option>

                            <option value="used">
                                Used
                            </option>

                            <option value="expired">
                                Expired
                            </option>

                            <option value="cancelled">
                                Cancelled
                            </option>
                        </select>

                    </div>

                </div>

                {/* TABLE */}
                <div className="bg-white border border-[#E5D6D0] rounded-2xl overflow-hidden">

                    {loading ? (
                        <Loading />
                    ) : filteredTickets.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <>
                            <div className="overflow-x-auto">

                                <table className="w-full min-w-[900px]">

                                    <thead>
                                        <tr className="bg-[#FCF9F6] border-b border-[#E5D6D0]">

                                            <th className="px-5 py-4 text-left text-xs font-semibold text-[#7A1F2B]">
                                                Ticket
                                            </th>

                                            <th className="px-5 py-4 text-left text-xs font-semibold text-[#7A1F2B]">
                                                Event
                                            </th>

                                            <th className="px-5 py-4 text-left text-xs font-semibold text-[#7A1F2B]">
                                                Customer
                                            </th>

                                            <th className="px-5 py-4 text-left text-xs font-semibold text-[#7A1F2B]">
                                                Category
                                            </th>

                                            <th className="px-5 py-4 text-left text-xs font-semibold text-[#7A1F2B]">
                                                Status
                                            </th>

                                            <th className="px-5 py-4 text-left text-xs font-semibold text-[#7A1F2B]">
                                                Created
                                            </th>

                                            <th className="px-5 py-4 text-right text-xs font-semibold text-[#7A1F2B]">
                                                Action
                                            </th>

                                        </tr>
                                    </thead>

                                    <tbody>

                                        {paginatedTickets.map(
                                            (ticket) => (
                                                <tr
                                                    key={ticket.id}
                                                    className="border-b border-[#F0E5E0] last:border-b-0 hover:bg-[#FCF9F6] transition"
                                                >

                                                    {/* TICKET */}
                                                    <td className="px-5 py-4">

                                                        <div className="flex items-center gap-3">

                                                            <div className="w-9 h-9 rounded-lg bg-[#F8F1E7] flex items-center justify-center shrink-0">
                                                                <Ticket className="w-4 h-4 text-[#7A1F2B]" />
                                                            </div>

                                                            <span className="font-semibold text-sm text-[#2D1719] whitespace-nowrap">
                                                                {ticket.ticket_code}
                                                            </span>

                                                        </div>

                                                    </td>

                                                    {/* EVENT */}
                                                    <td className="px-5 py-4 max-w-[220px]">

                                                        <p className="text-sm font-medium text-[#2D1719] truncate">
                                                            {ticket.event_title ||
                                                                "-"}
                                                        </p>

                                                    </td>

                                                    {/* CUSTOMER */}
                                                    <td className="px-5 py-4">

                                                        <span className="text-sm text-[#6F5B5B] whitespace-nowrap">
                                                            {ticket.username ||
                                                                "-"}
                                                        </span>

                                                    </td>

                                                    {/* CATEGORY */}
                                                    <td className="px-5 py-4">

                                                        <span className="inline-flex px-2.5 py-1 rounded-lg bg-[#F8F1E7] text-[#7A1F2B] text-xs font-semibold whitespace-nowrap">
                                                            {ticket.category_name ||
                                                                "-"}
                                                        </span>

                                                    </td>

                                                    {/* STATUS */}
                                                    <td className="px-5 py-4">
                                                        <StatusBadge
                                                            status={
                                                                ticket.status
                                                            }
                                                        />
                                                    </td>

                                                    {/* CREATED */}
                                                    <td className="px-5 py-4 text-sm text-[#8C7777] whitespace-nowrap">
                                                        {formatDate(
                                                            ticket.created_at
                                                        )}
                                                    </td>

                                                    {/* ACTION */}
                                                    <td className="px-5 py-4">

                                                        <div className="flex justify-end">

                                                            <Link
                                                                href={`/admin/tickets/${ticket.id}`}
                                                                className="w-9 h-9 rounded-lg border border-[#E5D6D0] flex items-center justify-center text-[#7A1F2B] hover:bg-[#F8F1E7] transition"
                                                                title="View ticket"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </Link>

                                                        </div>

                                                    </td>

                                                </tr>
                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                            {/* PAGINATION */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-t border-[#E5D6D0]">

                                <p className="text-xs text-[#8C7777]">
                                    Showing{" "}
                                    {filteredTickets.length ===
                                    0
                                        ? 0
                                        : (currentPage -
                                              1) *
                                                ITEMS_PER_PAGE +
                                          1}{" "}
                                    -{" "}
                                    {Math.min(
                                        currentPage *
                                            ITEMS_PER_PAGE,
                                        filteredTickets.length
                                    )}{" "}
                                    of{" "}
                                    {filteredTickets.length}{" "}
                                    tickets
                                </p>

                                <div className="flex items-center gap-2">

                                    <button
                                        type="button"
                                        disabled={
                                            currentPage ===
                                            1
                                        }
                                        onClick={() =>
                                            setPage(
                                                (prev) =>
                                                    prev -
                                                    1
                                            )
                                        }
                                        className="w-9 h-9 rounded-lg border border-[#E5D6D0] flex items-center justify-center text-[#7A1F2B] hover:bg-[#F8F1E7] disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>

                                    <span className="text-xs text-[#6F5B5B] px-2">
                                        {currentPage} /{" "}
                                        {totalPages}
                                    </span>

                                    <button
                                        type="button"
                                        disabled={
                                            currentPage ===
                                            totalPages
                                        }
                                        onClick={() =>
                                            setPage(
                                                (prev) =>
                                                    prev +
                                                    1
                                            )
                                        }
                                        className="w-9 h-9 rounded-lg border border-[#E5D6D0] flex items-center justify-center text-[#7A1F2B] hover:bg-[#F8F1E7] disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>

                                </div>

                            </div>
                        </>
                    )}

                </div>

            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const config = {
        active: {
            label: "Active",
            className:
                "bg-green-50 text-green-700",
        },

        used: {
            label: "Used",
            className:
                "bg-blue-50 text-blue-700",
        },

        expired: {
            label: "Expired",
            className:
                "bg-gray-100 text-gray-600",
        },

        cancelled: {
            label: "Cancelled",
            className:
                "bg-red-50 text-red-700",
        },
    };

    const current =
        config[status] || {
            label: status || "Unknown",
            className:
                "bg-gray-100 text-gray-600",
        };

    return (
        <span
            className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${current.className}`}
        >
            {current.label}
        </span>
    );
}

function Loading() {
    return (
        <div className="py-20 flex flex-col items-center justify-center gap-3">

            <div className="w-8 h-8 rounded-full border-2 border-[#D8A7A7] border-t-[#5B0F18] animate-spin" />

            <p className="text-sm text-[#8C7777]">
                Loading tickets...
            </p>

        </div>
    );
}

function EmptyState() {
    return (
        <div className="py-20 flex flex-col items-center justify-center text-center px-6">

            <div className="w-14 h-14 rounded-2xl bg-[#F8F1E7] flex items-center justify-center mb-4">
                <Ticket className="w-6 h-6 text-[#7A1F2B]" />
            </div>

            <h2 className="font-semibold text-[#2D1719]">
                No tickets found
            </h2>

            <p className="text-sm text-[#8C7777] mt-1 max-w-sm">
                Tickets will appear here after customers
                purchase tickets.
            </p>

        </div>
    );
}

function formatDate(date) {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
        "en-US",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );
}