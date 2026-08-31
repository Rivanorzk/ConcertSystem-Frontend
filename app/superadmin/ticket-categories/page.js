// app/superadmin/ticket-categories/page.js
"use client";

import { useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Ticket, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

import {
    createTicketCategory,
    deleteTicketCategory,
    getTicketCategories,
    updateTicketCategory,
} from "@/services/ticketCategoryService";
import LoadingSpinner from "@/components/loadingSpinner";
import EmptyState from "@/components/emptyState";
import CrudModal from "@/components/crudModal";

export default function TicketCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [name, setName] = useState("");
    const [saving, setSaving] = useState(false);

    const load = async () => {
        try {
            setLoading(true);
            const data = await getTicketCategories();
            setCategories(data);
        } catch (err) {
            toast.error(err.message || "Gagal memuat kategori tiket");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const openCreate = () => {
        setEditing(null);
        setName("");
        setModalOpen(true);
    };

    const openEdit = (category) => {
        setEditing(category);
        setName(category.category_name);
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Nama kategori tiket wajib diisi");
            return;
        }

        try {
            setSaving(true);

            if (editing) {
                await updateTicketCategory(editing.id, name.trim());
                toast.success("Kategori tiket berhasil diperbarui");
            } else {
                await createTicketCategory(name.trim());
                toast.success("Kategori tiket berhasil ditambahkan");
            }

            setModalOpen(false);
            load();
        } catch (err) {
            toast.error(err.message || "Gagal menyimpan kategori tiket");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (category) => {
        if (!confirm(`Hapus kategori tiket "${category.category_name}"? Aksi ini permanen.`)) return;

        try {
            await deleteTicketCategory(category.id);
            toast.success("Kategori tiket berhasil dihapus");
            load();
        } catch (err) {
            toast.error(err.message || "Gagal menghapus kategori tiket");
        }
    };

    return (
        <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="flex items-center gap-2 text-xl font-bold text-[#1E1E1E]">
                        <Ticket className="h-5 w-5 text-[#7A1F2B]" />
                        Kategori Tiket
                    </h1>
                    <p className="mt-1 text-sm text-[#8C7777]">
                        Master jenis tiket (VIP, Reguler, dll) yang bisa dipakai di event mana pun.
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 rounded-xl bg-[#5B0F18] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#7A1F2B]"
                >
                    <Plus className="h-4 w-4" />
                    Tambah Kategori Tiket
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-16">
                    <LoadingSpinner text="Memuat kategori tiket..." />
                </div>
            ) : categories.length === 0 ? (
                <EmptyState title="Belum ada kategori tiket" description="Tambahkan kategori tiket pertama." />
            ) : (
                <div className="overflow-hidden rounded-2xl border border-[#E5D6D0] bg-white">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#F8F1E7] text-xs uppercase tracking-wide text-[#8C7777]">
                            <tr>
                                <th className="px-5 py-3 font-semibold">Nama Kategori</th>
                                <th className="px-5 py-3 font-semibold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5D6D0]">
                            {categories.map((c) => (
                                <tr key={c.id}>
                                    <td className="px-5 py-3 font-medium text-[#1E1E1E]">
                                        {c.category_name}
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <div className="flex justify-end gap-1">
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
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {modalOpen && (
                <CrudModal
                    title={editing ? "Edit Kategori Tiket" : "Tambah Kategori Tiket"}
                    onClose={() => setModalOpen(false)}
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-[#1E1E1E]">
                                Nama Kategori Tiket
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="VIP / Reguler / Presale"
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