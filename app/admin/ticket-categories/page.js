"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Plus,
    Pencil,
    Trash2,
    Ticket,
} from "lucide-react";

import {
    getTicketCategories,
    deleteTicketCategory,
} from "@/services/ticketCategoryService";

export default function TicketCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);

    const loadCategories = async () => {
        try {
            setLoading(true);

            const data = await getTicketCategories();

            setCategories(data || []);
        } catch (error) {
            console.error(
                "Failed to load ticket categories:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this ticket category?"
        );

        if (!confirmed) return;

        try {
            setDeleting(id);

            await deleteTicketCategory(id);

            setCategories((current) =>
                current.filter(
                    (category) => category.id !== id
                )
            );
        } catch (error) {
            console.error(
                "Failed to delete ticket category:",
                error
            );

            alert(
                error?.response?.data?.message ||
                "Failed to delete ticket category."
            );
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div className="min-h-screen p-5 lg:p-8">
            <div className="max-w-6xl mx-auto">

                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

                    <div>
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-[#F8F1E7] flex items-center justify-center">
                                <Ticket className="w-5 h-5 text-[#5B0F18]" />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-[#2D1719]">
                                    Ticket Categories
                                </h1>

                                <p className="text-sm text-[#8C7777] mt-1">
                                    Manage ticket categories used for events
                                </p>
                            </div>
                        </div>
                    </div>

                    <Link
                        href="/admin/ticket-categories/create"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#5B0F18] text-[#F8F1E7] text-sm font-semibold hover:bg-[#7A1F2B] transition"
                    >
                        <Plus className="w-4 h-4" />
                        Add Category
                    </Link>

                </div>

                {/* CONTENT */}
                <div className="bg-white border border-[#E5D6D0] rounded-2xl overflow-hidden">

                    {loading ? (
                        <Loading />
                    ) : categories.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[600px]">

                                <thead>
                                    <tr className="border-b border-[#E5D6D0] bg-[#FCF9F6]">

                                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#7A1F2B]">
                                            #
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#7A1F2B]">
                                            Category
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#7A1F2B]">
                                            Created
                                        </th>

                                        <th className="px-6 py-4 text-right text-xs font-semibold text-[#7A1F2B]">
                                            Actions
                                        </th>

                                    </tr>
                                </thead>

                                <tbody>

                                    {categories.map(
                                        (category, index) => (
                                            <tr
                                                key={category.id}
                                                className="border-b border-[#F0E5E0] last:border-b-0 hover:bg-[#FCF9F6] transition"
                                            >

                                                <td className="px-6 py-4 text-sm text-[#8C7777]">
                                                    {index + 1}
                                                </td>

                                                <td className="px-6 py-4">

                                                    <div className="flex items-center gap-3">

                                                        <div className="w-9 h-9 rounded-lg bg-[#F8F1E7] flex items-center justify-center shrink-0">
                                                            <Ticket className="w-4 h-4 text-[#7A1F2B]" />
                                                        </div>

                                                        <span className="font-semibold text-sm text-[#2D1719]">
                                                            {category.category_name}
                                                        </span>

                                                    </div>

                                                </td>

                                                <td className="px-6 py-4 text-sm text-[#8C7777]">
                                                    {formatDate(
                                                        category.created_at
                                                    )}
                                                </td>

                                                <td className="px-6 py-4">

                                                    <div className="flex items-center justify-end gap-2">

                                                        <Link
                                                            href={`/admin/ticket-categories/${category.id}/edit`}
                                                            className="w-9 h-9 rounded-lg border border-[#E5D6D0] flex items-center justify-center text-[#7A1F2B] hover:bg-[#F8F1E7] transition"
                                                            title="Edit"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            disabled={
                                                                deleting ===
                                                                category.id
                                                            }
                                                            onClick={() =>
                                                                handleDelete(
                                                                    category.id
                                                                )
                                                            }
                                                            className="w-9 h-9 rounded-lg border border-[#E8CACA] flex items-center justify-center text-[#B42318] hover:bg-[#FEF2F2] transition disabled:opacity-50"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>
                                        )
                                    )}

                                </tbody>

                            </table>
                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}

function Loading() {
    return (
        <div className="py-20 flex flex-col items-center justify-center gap-3">

            <div className="w-8 h-8 rounded-full border-2 border-[#D8A7A7] border-t-[#5B0F18] animate-spin" />

            <p className="text-sm text-[#8C7777]">
                Loading ticket categories...
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
                No ticket categories
            </h2>

            <p className="text-sm text-[#8C7777] mt-1 max-w-sm">
                Create your first ticket category such as
                Regular, VIP, or VVIP.
            </p>

            <Link
                href="/admin/ticket-categories/create"
                className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5B0F18] text-[#F8F1E7] text-sm font-semibold hover:bg-[#7A1F2B] transition"
            >
                <Plus className="w-4 h-4" />
                Add Category
            </Link>

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