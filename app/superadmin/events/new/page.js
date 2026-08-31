// app/superadmin/events/new/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, UploadCloud } from "lucide-react";
import { toast } from "react-hot-toast";

import { createEvent } from "@/services/eventService";
import { getCategories } from "@/services/categoryService";

const emptyForm = {
    title: "",
    category_id: "",
    description: "",
    location: "",
    latitude: "",
    longitude: "",
    event_date: "",
    start_time: "",
    status: "draft",
};

export default function NewEventPage() {
    const router = useRouter();

    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [poster, setPoster] = useState(null);
    const [posterPreview, setPosterPreview] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        getCategories()
            .then(setCategories)
            .catch((err) => toast.error(err.message || "Gagal memuat kategori"));
    }, []);

    const handlePosterChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPoster(file);
        setPosterPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.title.trim() || !form.category_id) {
            toast.error("Judul dan kategori wajib diisi");
            return;
        }

        try {
            setSaving(true);

            const event = await createEvent({
                ...form,
                poster,
            });

            toast.success("Event berhasil dibuat");
            router.push(`/superadmin/events/${event.id}/edit`);
        } catch (err) {
            toast.error(err.message || "Gagal membuat event");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="mx-auto max-w-2xl">
            <div className="mb-6 flex items-center gap-3">
                <Link
                    href="/superadmin/events"
                    className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#1E1E1E] shadow-sm transition hover:bg-[#F8F1E7]"
                >
                    <ArrowLeft size={16} />
                    Kembali
                </Link>
                <h1 className="text-lg font-bold text-[#1E1E1E]">Tambah Event</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
                {/* POSTER */}
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
                        placeholder="Nama tempat, alamat lengkap"
                        className="w-full rounded-xl border border-[#E5D6D0] px-4 py-2.5 text-sm outline-none focus:border-[#7A1F2B]"
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-[#1E1E1E]">Latitude (opsional)</label>
                        <input
                            type="text"
                            value={form.latitude}
                            onChange={(e) => setForm((f) => ({ ...f, latitude: e.target.value }))}
                            className="w-full rounded-xl border border-[#E5D6D0] px-4 py-2.5 text-sm outline-none focus:border-[#7A1F2B]"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-[#1E1E1E]">Longitude (opsional)</label>
                        <input
                            type="text"
                            value={form.longitude}
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
                    Simpan & Lanjut Atur Tiket
                </button>
            </form>
        </div>
    );
}