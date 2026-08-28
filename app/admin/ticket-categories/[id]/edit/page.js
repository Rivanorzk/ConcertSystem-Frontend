"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Ticket,
} from "lucide-react";

import {
    getTicketCategoryById,
    updateTicketCategory,
} from "@/services/ticketCategoryService";

export default function EditTicketCategoryPage() {
    const { id } = useParams();
    const router = useRouter();

    const [categoryName, setCategoryName] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;

        const loadCategory = async () => {
            try {
                const data =
                    await getTicketCategoryById(id);

                setCategoryName(
                    data?.category_name || ""
                );
            } catch (error) {
                console.error(
                    "Failed to load ticket category:",
                    error
                );

                setError(
                    error?.response?.data?.message ||
                    "Failed to load ticket category."
                );
            } finally {
                setLoading(false);
            }
        };

        loadCategory();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!categoryName.trim()) {
            setError("Category name is required.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            await updateTicketCategory(id, {
                category_name: categoryName.trim(),
            });

            router.push("/admin/ticket-categories");
        } catch (error) {
            console.error(
                "Failed to update ticket category:",
                error
            );

            setError(
                error?.response?.data?.message ||
                "Failed to update ticket category."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">

                    <div className="w-8 h-8 rounded-full border-2 border-[#D8A7A7] border-t-[#5B0F18] animate-spin" />

                    <p className="text-sm text-[#7A1F2B]">
                        Loading...
                    </p>

                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-5 lg:p-8">
            <div className="max-w-2xl mx-auto">

                <Link
                    href="/admin/ticket-categories"
                    className="inline-flex items-center gap-2 text-sm text-[#7A1F2B] mb-6 hover:underline"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Ticket Categories
                </Link>

                <div className="bg-white border border-[#E5D6D0] rounded-2xl overflow-hidden">

                    <div className="p-6 border-b border-[#E5D6D0]">

                        <div className="flex items-center gap-3">

                            <div className="w-11 h-11 rounded-xl bg-[#F8F1E7] flex items-center justify-center">
                                <Ticket className="w-5 h-5 text-[#5B0F18]" />
                            </div>

                            <div>
                                <h1 className="text-xl font-bold text-[#2D1719]">
                                    Edit Ticket Category
                                </h1>

                                <p className="text-sm text-[#8C7777] mt-1">
                                    Update ticket category
                                </p>
                            </div>

                        </div>

                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="p-6"
                    >

                        <div>
                            <label className="block text-sm font-semibold text-[#2D1719] mb-2">
                                Category Name
                            </label>

                            <input
                                type="text"
                                value={categoryName}
                                onChange={(e) =>
                                    setCategoryName(
                                        e.target.value
                                    )
                                }
                                placeholder="e.g. Regular, VIP, VVIP"
                                className="w-full px-4 py-3 rounded-xl border border-[#E5D6D0] outline-none text-sm text-[#2D1719] placeholder:text-[#B5A2A2] focus:border-[#7A1F2B] focus:ring-2 focus:ring-[#7A1F2B]/10"
                            />
                        </div>

                        {error && (
                            <p className="mt-3 text-sm text-[#B42318]">
                                {error}
                            </p>
                        )}

                        <div className="flex justify-end gap-3 mt-8">

                            <Link
                                href="/admin/ticket-categories"
                                className="px-4 py-2.5 rounded-xl border border-[#E5D6D0] text-[#6F5B5B] text-sm font-semibold hover:bg-[#FCF9F6] transition"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={saving}
                                className="px-5 py-2.5 rounded-xl bg-[#5B0F18] text-[#F8F1E7] text-sm font-semibold hover:bg-[#7A1F2B] transition disabled:opacity-50"
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>

                        </div>

                    </form>

                </div>

            </div>
        </div>
    );
}