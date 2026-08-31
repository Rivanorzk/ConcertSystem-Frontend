// app/superadmin/categories/page.js
"use client";

import { useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Tags, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

import {
    createCategory,
    deleteCategory,
    getCategories,
    updateCategory,
} from "@/services/categoryService";
import LoadingSpinner from "@/components/loadingSpinner";
import EmptyState from "@/components/emptyState";
import CrudModal from "@/components/crudModal";

const emptyForm = { categoryName: "", icon: "" };

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);

    const load = async () => {
        try {
            setLoading(true);
            const data = await getCategories();
            setCategories(data);
        } catch (err) {
            toast.error(err.message || "Gagal memuat kategori");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm);
        setModalOpen(true);
    };

    const openEdit = (category) => {
        setEditing(category);
        setForm({
            categoryName: category.category_name,
            icon: category.icon || "",
        });
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.categoryName.trim()) {
            toast.error("Nama kategori wajib diisi");
            return;
        }

        try {
            setSaving(true);

            if (editing) {
                await updateCategory(editing.id, {
                    categoryName: form.categoryName.trim(),
                    icon: form.icon.trim() || null,
                });
                toast.success("Kategori berhasil diperbarui");
            } else {
                await createCategory({
                    categoryName: form.categoryName.trim(),
                    icon: form.icon.trim() || null,
                });
                toast.success("Kategori berhasil ditambahkan");
            }

            setModalOpen(false);
            load();
        } catch (err) {
            toast.error(err.message || "Gagal menyimpan kategori");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (category) => {
        if (!confirm(`Hapus kategori "${category.category_name}"?`)) return;

        try {
            await deleteCategory(category.id);
            toast.success("Kategori berhasil dihapus");
            load();
        } catch (err) {
            toast.error(err.message || "Gagal menghapus kategori");
        }
    };

    return (
        <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="flex items-center gap-2 text-xl font-bold text-[#1E1E1E]">
                        <Tags className="h-5 w-5 text-[#7A1F2B]" />
                        Kategori Event
                    </h1>
                    <p className="mt-1 text-sm text-[#8C7777]">
                        Kategori seperti Festival, Konser, Seminar, dll.
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 rounded-xl bg-[#5B0F18] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#7A1F2B]"
                >
                    <Plus className="h-4 w-4" />
                    Tambah Kategori
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-16">
                    <LoadingSpinner text="Memuat kategori..." />
                </div>
            ) : categories.length === 0 ? (
                <EmptyState title="Belum ada kategori" description="Tambahkan kategori event pertama." />
            ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((c) => (
                        <div
                            key={c.id}
                            className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm"
                        >
                            <div>
                                <p className="font-semibold text-[#1E1E1E]">{c.category_name}</p>
                                {c.icon && <p className="text-xs text-[#8C7777]">{c.icon}</p>}
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => openEdit(c)}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8C7777] transition hover:bg-[#F8F1E7] hover:text-[#1E1E1E]"
                                >
                                    <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(c)}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8C7777] transition hover:bg-[#F3E4E4] hover:text-[#B3261E]"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {modalOpen && (
                <CrudModal
                    title={editing ? "Edit Kategori" : "Tambah Kategori"}
                    onClose={() => setModalOpen(false)}
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-[#1E1E1E]">
                                Nama Kategori
                            </label>
                            <input
                                type="text"
                                value={form.categoryName}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, categoryName: e.target.value }))
                                }
                                placeholder="Festival"
                                className="w-full rounded-xl border border-[#E5D6D0] px-4 py-2.5 text-sm outline-none focus:border-[#7A1F2B]"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-[#1E1E1E]">
                                Icon (opsional)
                            </label>
                            <input
                                type="text"
                                value={form.icon}
                                onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                                placeholder="music, mic, dsb"
                                className="w-full rounded-xl border border-[#E5D6D0] px-4 py-2.5 text-sm outline-none focus:border-[#7A1F2B]"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5B0F18] py-3 text-sm font-bold text-white transition hover:bg-[#7A1F2B] disabled:opacity-60"
                        >
                            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                            Simpan
                        </button>
                    </form>
                </CrudModal>
            )}
        </div>
    );
}