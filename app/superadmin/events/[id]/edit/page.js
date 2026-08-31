// app/superadmin/events/[id]/edit/page.js
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Pencil, Plus, Trash2, UploadCloud } from "lucide-react";
import { toast } from "react-hot-toast";

import { deleteEvent, getEventById, updateEvent } from "@/services/eventService";
import { getCategories } from "@/services/categoryService";
import { getTicketCategories } from "@/services/ticketCategoryService";
import {
    createEventTicketCategory,
    deleteEventTicketCategory,
    getByEvent,
    updateEventTicketCategory,
} from "@/services/eventTicketCategoryService";
import LoadingSpinner from "@/components/loadingSpinner";
import CrudModal from "@/components/crudModal";
import { currency } from "@/lib/formatter";

export default function EditEventPage() {
    const { id } = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [ticketCategories, setTicketCategories] = useState([]);
    const [eventTickets, setEventTickets] = useState([]);

    const [form, setForm] = useState(null);
    const [poster, setPoster] = useState(null);
    const [posterPreview, setPosterPreview] = useState(null);
    const [saving, setSaving] = useState(false);

    const [ticketModalOpen, setTicketModalOpen] = useState(false);
    const [editingTicket, setEditingTicket] = useState(null);
    const [ticketForm, setTicketForm] = useState({
        ticket_category_id: "",
        price: "",
        stock: "",
    });
    const [savingTicket, setSavingTicket] = useState(false);

    const load = async () => {
        try {
            setLoading(true);

            const [event, categoryList, ticketCategoryList, eventTicketList] = await Promise.all([
                getEventById(id),
                getCategories(),
                getTicketCategories(),
                getByEvent(id),
            ]);

            setForm({
                title: event.title || "",
                category_id: event.category_id || "",
                description: event.description || "",
                location: event.location || "",
                latitude: event.latitude || "",
                longitude: event.longitude || "",
                event_date: event.event_date ? String(event.event_date).slice(0, 10) : "",
                start_time: event.start_time || "",
                status: event.status || "draft",
            });
            setPosterPreview(event.poster || null);
            setCategories(categoryList);
            setTicketCategories(ticketCategoryList);
            setEventTickets(eventTicketList);
        } catch (err) {
            toast.error(err.message || "Gagal memuat event");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handlePosterChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPoster(file);
        setPosterPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            await updateEvent(id, { ...form, ...(poster ? { poster } : {}) });
            toast.success("Event berhasil diperbarui");
        } catch (err) {
            toast.error(err.message || "Gagal memperbarui event");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteEvent = async () => {
        if (!confirm("Hapus event ini beserta seluruh datanya? Aksi ini permanen.")) return;

        try {
            await deleteEvent(id);
            toast.success("Event berhasil dihapus");
            router.push("/superadmin/events");
        } catch (err) {
            toast.error(err.message || "Gagal menghapus event");
        }
    };

    // =========================
    // Ticket categories per event
    // =========================
    const openAddTicket = () => {
        setEditingTicket(null);
        setTicketForm({ ticket_category_id: "", price: "", stock: "" });
        setTicketModalOpen(true);
    };

    const openEditTicket = (ticket) => {
        setEditingTicket(ticket);
        setTicketForm({
            ticket_category_id: ticket.ticket_category_id,
            price: ticket.price,
            stock: ticket.stock,
        });
        setTicketModalOpen(true);
    };

    const handleTicketSubmit = async (e) => {
        e.preventDefault();

        if (!ticketForm.ticket_category_id || ticketForm.price === "" || ticketForm.stock === "") {
            toast.error("Semua field wajib diisi");
            return;
        }

        try {
            setSavingTicket(true);

            if (editingTicket) {
                await updateEventTicketCategory(editingTicket.id, {
                    price: Number(ticketForm.price),
                    stock: Number(ticketForm.stock),
                });
                toast.success("Tiket berhasil diperbarui");
            } else {
                await createEventTicketCategory({
                    event_id: Number(id),
                    ticket_category_id: Number(ticketForm.ticket_category_id),
                    price: Number(ticketForm.price),
                    stock: Number(ticketForm.stock),
                });
                toast.success("Tiket berhasil ditambahkan");
            }

            setTicketModalOpen(false);
            const updated = await getByEvent(id);
            setEventTickets(updated);
        } catch (err) {
            toast.error(err.message || "Gagal menyimpan tiket");
        } finally {
            setSavingTicket(false);
        }
    };

    const handleDeleteTicket = async (ticket) => {
        if (!confirm("Hapus kategori tiket ini dari event?")) return;

        try {
            await deleteEventTicketCategory(ticket.id);
            toast.success("Tiket berhasil dihapus dari event");
            setEventTickets((prev) => prev.filter((t) => t.id !== ticket.id));
        } catch (err) {
            toast.error(err.message || "Gagal menghapus tiket");
        }
    };

    const categoryName = (ticketCategoryId) =>
        ticketCategories.find((c) => c.id === ticketCategoryId)?.category_name || "-";

    if (loading || !form) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <LoadingSpinner text="Memuat event..." />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-2xl">
            <div className="mb-6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <Link
                        href="/superadmin/events"
                        className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#1E1E1E] shadow-sm transition hover:bg-[#F8F1E7]"
                    >
                        <ArrowLeft size={16} />
                        Kembali
                    </Link>
                    <h1 className="text-lg font-bold text-[#1E1E1E]">Edit Event</h1>
                </div>
                <button
                    onClick={handleDeleteEvent}
                    className="flex items-center gap-2 rounded-xl border border-[#F3E4E4] px-3 py-2 text-sm font-semibold text-[#B3261E] transition hover:bg-[#F3E4E4]"
                >
                    <Trash2 className="h-4 w-4" />
                    Hapus Event
                </button>
            </div>

            {/* EVENT FORM */}
            <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
                <div>
                    <label className="mb-1 block text-sm font-medium text-[#1E1E1E]">Poster</label>
                    <label className="flex h-40 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-[#E5D6D0] bg-[#F8F1E7] transition hover:border-[#7A1F2B]">
                        {posterPreview ? (
                            <img src={posterPreview} alt="Preview" className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center gap-1 text-[#8C7777]">
                                <UploadCloud className="h-6 w-6" />
                                <span className="text-xs">Klik untuk upload poster</span>
                            </div>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={handlePosterChange} />
                    </label>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-[#1E1E1E]">Judul Event</label>
                    <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                        className="w-full rounded-xl border border-[#E5D6D0] px-4 py-2.5 text-sm outline-none focus:border-[#7A1F2B]"
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-[#1E1E1E]">Kategori</label>
                        <select
                            value={form.category_id}
                            onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
                            className="w-full rounded-xl border border-[#E5D6D0] px-4 py-2.5 text-sm outline-none focus:border-[#7A1F2B]"
                        >
                            <option value="">Pilih kategori</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.category_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-[#1E1E1E]">Status</label>
                        <select
                            value={form.status}
                            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                            className="w-full rounded-xl border border-[#E5D6D0] px-4 py-2.5 text-sm outline-none focus:border-[#7A1F2B]"
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="finished">Finished</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-[#1E1E1E]">Tanggal Event</label>
                        <input
                            type="date"
                            value={form.event_date}
                            onChange={(e) => setForm((f) => ({ ...f, event_date: e.target.value }))}
                            className="w-full rounded-xl border border-[#E5D6D0] px-4 py-2.5 text-sm outline-none focus:border-[#7A1F2B]"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-[#1E1E1E]">Jam Mulai</label>
                        <input
                            type="time"
                            value={form.start_time}
                            onChange={(e) => setForm((f) => ({ ...f, start_time: e.target.value }))}
                            className="w-full rounded-xl border border-[#E5D6D0] px-4 py-2.5 text-sm outline-none focus:border-[#7A1F2B]"
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-[#1E1E1E]">Lokasi</label>
                    <input
                        type="text"
                        value={form.location}
                        onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                        className="w-full rounded-xl border border-[#E5D6D0] px-4 py-2.5 text-sm outline-none focus:border-[#7A1F2B]"
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-[#1E1E1E]">Latitude (opsional)</label>
                        <input
                            type="text"
                            value={form.latitude || ""}
                            onChange={(e) => setForm((f) => ({ ...f, latitude: e.target.value }))}
                            className="w-full rounded-xl border border-[#E5D6D0] px-4 py-2.5 text-sm outline-none focus:border-[#7A1F2B]"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-[#1E1E1E]">Longitude (opsional)</label>
                        <input
                            type="text"
                            value={form.longitude || ""}
                            onChange={(e) => setForm((f) => ({ ...f, longitude: e.target.value }))}
                            className="w-full rounded-xl border border-[#E5D6D0] px-4 py-2.5 text-sm outline-none focus:border-[#7A1F2B]"
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-[#1E1E1E]">Deskripsi</label>
                    <textarea
                        rows={4}
                        value={form.description}
                        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                        className="w-full rounded-xl border border-[#E5D6D0] px-4 py-2.5 text-sm outline-none focus:border-[#7A1F2B]"
                    />
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5B0F18] py-3 text-sm font-bold text-white transition hover:bg-[#7A1F2B] disabled:opacity-60"
                >
                    {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                    Simpan Perubahan
                </button>
            </form>

            {/* TICKET CATEGORIES */}
            <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-[#1E1E1E]">Harga & Stok Tiket</h2>
                    <button
                        onClick={openAddTicket}
                        className="flex items-center gap-1.5 rounded-xl bg-[#1E1E1E] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#3A0810]"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Tambah Tiket
                    </button>
                </div>

                {eventTickets.length === 0 ? (
                    <p className="py-6 text-center text-sm text-[#8C7777]">
                        Belum ada kategori tiket untuk event ini.
                    </p>
                ) : (
                    <div className="space-y-2">
                        {eventTickets.map((t) => (
                            <div
                                key={t.id}
                                className="flex items-center justify-between rounded-xl border border-[#E5D6D0] p-3"
                            >
                                <div>
                                    <p className="font-semibold text-[#1E1E1E]">
                                        {categoryName(t.ticket_category_id)}
                                    </p>
                                    <p className="text-xs text-[#8C7777]">
                                        {currency(t.price)} • stok {t.remaining_stock}/{t.stock}
                                    </p>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => openEditTicket(t)}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8C7777] transition hover:bg-[#F8F1E7] hover:text-[#1E1E1E]"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteTicket(t)}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8C7777] transition hover:bg-[#F3E4E4] hover:text-[#B3261E]"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {ticketModalOpen && (
                <CrudModal
                    title={editingTicket ? "Edit Tiket" : "Tambah Tiket"}
                    onClose={() => setTicketModalOpen(false)}
                >
                    <form onSubmit={handleTicketSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-[#1E1E1E]">
                                Kategori Tiket
                            </label>
                            <select
                                value={ticketForm.ticket_category_id}
                                disabled={!!editingTicket}
                                onChange={(e) =>
                                    setTicketForm((f) => ({ ...f, ticket_category_id: e.target.value }))
                                }
                                className="w-full rounded-xl border border-[#E5D6D0] px-4 py-2.5 text-sm outline-none focus:border-[#7A1F2B] disabled:bg-[#F8F1E7]"
                            >
                                <option value="">Pilih kategori tiket</option>
                                {ticketCategories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.category_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-[#1E1E1E]">Harga</label>
                            <input
                                type="number"
                                min="0"
                                value={ticketForm.price}
                                onChange={(e) => setTicketForm((f) => ({ ...f, price: e.target.value }))}
                                className="w-full rounded-xl border border-[#E5D6D0] px-4 py-2.5 text-sm outline-none focus:border-[#7A1F2B]"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-[#1E1E1E]">Stok</label>
                            <input
                                type="number"
                                min="0"
                                value={ticketForm.stock}
                                onChange={(e) => setTicketForm((f) => ({ ...f, stock: e.target.value }))}
                                className="w-full rounded-xl border border-[#E5D6D0] px-4 py-2.5 text-sm outline-none focus:border-[#7A1F2B]"
                            />
                            {editingTicket && (
                                <p className="mt-1 text-xs text-[#8C7777]">
                                    Stok tidak boleh lebih kecil dari tiket yang sudah terjual.
                                </p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={savingTicket}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5B0F18] py-3 text-sm font-bold text-white transition hover:bg-[#7A1F2B] disabled:opacity-60"
                        >
                            {savingTicket && <Loader2 className="h-4 w-4 animate-spin" />}
                            Simpan
                        </button>
                    </form>
                </CrudModal>
            )}
        </div>
    );
}