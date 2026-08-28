"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import * as Icons from "lucide-react";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
} from "lucide-react";

import {
    getCategories,
    deleteCategory,
} from "@/services/categoryService";

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const loadCategories = async () => {
        try {
            const response = await getCategories();

            setCategories(
                Array.isArray(response)
                    ? response
                    : []
            );
        } catch (error) {
            console.error(
                "Failed to load categories:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const filteredCategories = categories.filter((category) =>
        category.category_name
            ?.toLowerCase()
            .includes(search.toLowerCase())
    );

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this category?")) {
            return;
        }

        try {
            await deleteCategory(id);

            setCategories((current) =>
                current.filter(
                    (category) => category.id !== id
                )
            );
        } catch (error) {
            console.error(
                "Failed to delete category:",
                error
            );

            alert("Failed to delete category.");
        }
    };

    return (
        <main className="min-h-screen bg-[#F8F1E7]">
            <div className="max-w-[1600px] mx-auto px-5 py-6 lg:px-8">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">
                    <div>
                        <p className="text-sm text-[#8C7777]">
                            Management
                        </p>

                        <h1 className="mt-1 text-3xl font-bold text-[#1E1E1E]">
                            Categories
                        </h1>

                        <p className="mt-2 text-sm text-[#8C7777]">
                            Manage event categories.
                        </p>
                    </div>

                    <Link
                        href="/admin/categories/create"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7A1F2B] px-5 py-3 text-sm font-semibold text-white hover:bg-[#5B0F18]"
                    >
                        <Plus className="w-4 h-4" />
                        Add Category
                    </Link>
                </div>

                {/* TABLE */}
                <div className="bg-white border border-[#E5D6D0] rounded-2xl overflow-hidden text-black">

                    {/* SEARCH */}
                    <div className="p-5 border-b border-[#E5D6D0]">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />

                            <input
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Search categories..."
                                className="w-full rounded-xl border border-[#E5D6D0] bg-[#FCF9F5] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#7A1F2B]"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">

                            {/* TABLE HEADER */}
                            <thead>
                                <tr className="bg-[#FCF9F5] border-b border-[#E5D6D0]">
                                    <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-[#8C7777]">
                                        #
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-[#8C7777]">
                                        Category
                                    </th>

                                    <th className="px-5 py-4 text-right text-xs uppercase tracking-wide text-[#8C7777]">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            {/* TABLE BODY */}
                            <tbody className="divide-y divide-[#F0E5DE]">

                                {/* LOADING */}
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan="3"
                                            className="py-12 text-center text-sm text-[#8C7777]"
                                        >
                                            Loading categories...
                                        </td>
                                    </tr>

                                ) : filteredCategories.length === 0 ? (

                                    /* EMPTY */
                                    <tr>
                                        <td
                                            colSpan="3"
                                            className="py-12 text-center"
                                        >
                                            <Icons.Tags className="w-8 h-8 mx-auto text-[#D8A7A7]" />

                                            <p className="mt-3 text-sm text-[#8C7777]">
                                                No categories found
                                            </p>
                                        </td>
                                    </tr>

                                ) : (

                                    /* DATA */
                                    filteredCategories.map(
                                        (category, index) => {

                                            const Icon =
                                                Icons[
                                                    category.icon
                                                ] ||
                                                Icons.Tags;

                                            return (
                                                <tr
                                                    key={category.id}
                                                    className="hover:bg-[#FCF9F5]"
                                                >

                                                    {/* NUMBER */}
                                                    <td className="px-5 py-4 text-sm text-[#8C7777]">
                                                        {index + 1}
                                                    </td>

                                                    {/* CATEGORY */}
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">

                                                            <div className="w-10 h-10 rounded-xl bg-[#F8F1E7] flex items-center justify-center">
                                                                <Icon className="w-5 h-5 text-[#7A1F2B]" />
                                                            </div>

                                                            <div>
                                                                <span className="text-sm font-semibold text-[#1E1E1E]">
                                                                    {category.category_name}
                                                                </span>

                                                                {category.description && (
                                                                    <p className="text-xs text-[#8C7777] mt-1">
                                                                        {category.description}
                                                                    </p>
                                                                )}
                                                            </div>

                                                        </div>
                                                    </td>

                                                    {/* ACTION */}
                                                    <td className="px-5 py-4">
                                                        <div className="flex justify-end gap-2">

                                                            <Link
                                                                href={`/admin/categories/${category.id}/edit`}
                                                                className="w-9 h-9 rounded-lg border border-[#E5D6D0] flex items-center justify-center text-[#7A1F2B] hover:bg-[#F8F1E7]"
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </Link>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        category.id
                                                                    )
                                                                }
                                                                className="w-9 h-9 rounded-lg border border-red-100 flex items-center justify-center text-red-600 hover:bg-red-50"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>

                                                        </div>
                                                    </td>

                                                </tr>
                                            );
                                        }
                                    )
                                )}

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}