"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as Icons from "lucide-react";
import { ArrowLeft, Check, Search } from "lucide-react";

import { createCategory } from "@/services/categoryService";

const iconOptions = [
    "Music",
    "Mic2",
    "PartyPopper",
    "Trophy",
    "Gamepad2",
    "Dumbbell",
    "GraduationCap",
    "BookOpen",
    "BriefcaseBusiness",
    "Users",
    "Heart",
    "Star",
    "Sparkles",
    "Camera",
    "Film",
    "Palette",
    "Utensils",
    "Coffee",
    "ShoppingBag",
    "MapPin",
    "Plane",
    "Building2",
    "Church",
    "Landmark",
    "CalendarDays",
    "Ticket",
    "Gift",
    "Megaphone",
];

export default function CreateCategoryPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        category_name: "",
        icon: "CalendarDays",
    });

    const [search, setSearch] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const filteredIcons = iconOptions.filter((icon) =>
        icon.toLowerCase().includes(search.toLowerCase())
    );

    const handleChange = (e) => {
        setForm((current) => ({
            ...current,
            [e.target.name]: e.target.value,
        }));

        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.category_name.trim()) {
            setError("Nama kategori wajib diisi.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            await createCategory({
                categoryName: form.category_name.trim(),
                icon: form.icon,
            });

            router.push("/admin/categories");
        } catch (error) {
            console.error(error);

            setError(
                error?.response?.data?.message ||
                    "Gagal membuat kategori."
            );
        } finally {
            setSaving(false);
        }
    };

    const SelectedIcon =
        Icons[form.icon] || Icons.CalendarDays;

    return (
        <div className="min-h-screen p-5 lg:p-8">
            <div className="max-w-4xl mx-auto">

                {/* BACK */}
                <Link
                    href="/admin/categories"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#7A1F2B] hover:text-[#5B0F18] transition"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Categories
                </Link>

                {/* HEADER */}
                <div className="mt-6">
                    <h1 className="text-3xl font-bold text-[#1E1E1E]">
                        Create Category
                    </h1>

                    <p className="mt-2 text-sm text-[#8C7777]">
                        Buat kategori baru untuk mengelompokkan event.
                    </p>
                </div>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="mt-7 bg-white border border-[#E5D6D0] rounded-2xl p-6 lg:p-8 space-y-7"
                >

                    {/* CATEGORY NAME */}
                    <div>
                        <label
                            htmlFor="nama_kategori"
                            className="text-sm font-semibold text-[#1E1E1E]"
                        >
                            Category Name
                        </label>

                        <input
                            id="nama_kategori"
                            name="categoryName"
                            type="text"
                            value={form.categoryName}
                            onChange={handleChange}
                            placeholder="Contoh: Music Festival"
                            className="mt-2 w-full border border-[#E5D6D0] rounded-xl px-4 py-3 text-sm text-[#1E1E1E] outline-none transition focus:border-[#7A1F2B] focus:ring-2 focus:ring-[#7A1F2B]/10"
                        />
                    </div>

                    {/* ICON PREVIEW */}
                    <div>
                        <label className="text-sm font-semibold text-[#1E1E1E]">
                            Category Icon
                        </label>

                        <div className="mt-3 flex items-center gap-4 rounded-2xl bg-[#F8F1E7] border border-[#E5D6D0] p-4">
                            <div className="w-14 h-14 rounded-xl bg-[#5B0F18] flex items-center justify-center shrink-0">
                                <SelectedIcon className="w-7 h-7 text-[#F8F1E7]" />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-[#1E1E1E]">
                                    {form.icon}
                                </p>

                                <p className="text-xs text-[#8C7777] mt-1">
                                    Icon yang dipilih untuk kategori.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* SEARCH ICON */}
                    <div>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Search icon..."
                                className="w-full border border-[#E5D6D0] rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-[#7A1F2B] focus:ring-2 focus:ring-[#7A1F2B]/10 text-black"
                            />
                        </div>
                    </div>

                    {/* ICON GRID */}
                    <div>
                        <p className="text-xs text-[#8C7777] mb-3">
                            Pilih salah satu icon
                        </p>

                        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-7 gap-3 max-h-[320px] overflow-y-auto pr-1">
                            {filteredIcons.map((iconName) => {
                                const Icon =
                                    Icons[iconName] ||
                                    Icons.CalendarDays;

                                const selected =
                                    form.icon === iconName;

                                return (
                                    <button
                                        key={iconName}
                                        type="button"
                                        onClick={() =>
                                            setForm((current) => ({
                                                ...current,
                                                icon: iconName,
                                            }))
                                        }
                                        className={`relative flex flex-col items-center justify-center gap-2 aspect-square rounded-xl border transition ${
                                            selected
                                                ? "border-[#7A1F2B] bg-[#7A1F2B] text-[#F8F1E7]"
                                                : "border-[#E5D6D0] bg-white text-[#5B0F18] hover:border-[#7A1F2B] hover:bg-[#F8F1E7]"
                                        }`}
                                    >
                                        {selected && (
                                            <span className="absolute top-1 right-1">
                                                <Check className="w-3.5 h-3.5" />
                                            </span>
                                        )}

                                        <Icon className="w-6 h-6" />

                                        <span className="text-[10px] truncate max-w-[80%]">
                                            {iconName}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {filteredIcons.length === 0 && (
                            <div className="py-8 text-center text-sm text-[#8C7777]">
                                Icon tidak ditemukan.
                            </div>
                        )}
                    </div>

                    {/* ERROR */}
                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {/* ACTION */}
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
                        <Link
                            href="/admin/categories"
                            className="px-6 py-3 rounded-xl border border-[#E5D6D0] text-sm font-semibold text-[#5B0F18] text-center hover:bg-[#F8F1E7] transition"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-3 rounded-xl bg-[#5B0F18] text-[#F8F1E7] text-sm font-semibold hover:bg-[#7A1F2B] transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving
                                ? "Creating..."
                                : "Create Category"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}