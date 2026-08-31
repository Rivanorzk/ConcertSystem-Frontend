// app/superadmin/vouchers/page.js
"use client";

import { useEffect, useState } from "react";
import { Gift, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

import {
    createVoucher,
    deleteVoucher,
    getVouchers,
    updateVoucher,
} from "@/services/voucherService";
import LoadingSpinner from "@/components/loadingSpinner";
import EmptyState from "@/components/emptyState";
import CrudModal from "@/components/crudModal";
import { currency, formatDate } from "@/lib/formatter";

const emptyForm = {
    title: "",
    promo_code: "",
    discount_type: "percentage",
    discount_value: "",
    minimum_ticket: 1,
    quota: "",
    start_date: "",
    end_date: "",
};

function toDateInput(value) {
    if (!value) return "";
    return new Date(value).toISOString().slice(0, 10);
}

export default function VouchersPage() {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);

    const load = async () => {
        try {
            setLoading(true);
            const data = await getVouchers();
            setVouchers(data);
        } catch (err) {
            toast.error(err.message || "Gagal memuat voucher");
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

    const openEdit = (voucher) => {
        setEditing(voucher);
        setForm({
            title: voucher.title,
            promo_code: voucher.promo_code,
            discount_type: voucher.discount_type,
            discount_value: voucher.discount_value,
            minimum_ticket: voucher.minimum_ticket,
            quota: voucher.quota,
            start_date: toDateInput(voucher.start_date),
            end_date: toDateInput(voucher.end_date),
        });
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.title.trim() || !form.promo_code.trim()) {
            toast.error("Judul dan kode voucher wajib diisi");
            return;
        }

        if (!form.start_date || !form.end_date) {
            toast.error("Tanggal mulai & berakhir wajib diisi");
            return;
        }

        const payload = {
            title: form.title.trim(),
            promo_code: form.promo_code.trim().toUpperCase(),
            discount_type: form.discount_type,
            discount_value: Number(form.discount_value),
            minimum_ticket: Number(form.minimum_ticket) || 1,
            quota: Number(form.quota),
            start_date: form.start_date,
            end_date: form.end_date,
        };

        try {
            setSaving(true);

            if (editing) {
                await updateVoucher(editing.id, payload);
                toast.success("Voucher berhasil diperbarui");
            } else {
                await createVoucher(payload);
                toast.success("Voucher berhasil ditambahkan");
            }

            setModalOpen(false);
            load();
        } catch (err) {
            toast.error(err.message || "Gagal menyimpan voucher");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (voucher) => {
        if (!confirm(`Hapus voucher "${voucher.promo_code}"? Aksi ini permanen.`)) return;

        try {
            await deleteVoucher(voucher.id);
            toast.success("Voucher berhasil dihapus");
            load();
        } catch (err) {
            toast.error(err.message || "Gagal menghapus voucher");
        }
    };

    return (
        <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="flex items-center gap-2 text-xl font-bold text-[#1E1E1E]">
                        <Gift className="h-5 w-5 text-[#7A1F2B]" />
                        Voucher
                    </h1>
                    <p className="mt-1 text-sm text-[#8C7777]">
                        Kelola kode diskon untuk checkout customer.
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 rounded-xl bg-[#5B0F18] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#7A1F2B]"
                >
                    <Plus className="h-4 w-4" />
                    Tambah Voucher
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-16">
                    <LoadingSpinner text="Memuat voucher..." />
                </div>
            ) : vouchers.length === 0 ? (
                <EmptyState title="Belum ada voucher" description="Tambahkan voucher pertama." />
            ) : (
                <div className="overflow-hidden rounded-2xl border border-[#E5D6D0] bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#F8F1E7] text-xs uppercase tracking-wide text-[#8C7777]">
                                <tr>
                                    <th className="px-5 py-3 font-semibold">Kode</th>
                                    <th className="px-5 py-3 font-semibold">Judul</th>
                                    <th className="px-5 py-3 font-semibold">Diskon</th>
                                    <th className="px-5 py-3 font-semibold">Kuota</th>
                                    <th className="px-5 py-3 font-semibold">Periode</th>
                                    <th className="px-5 py-3 text-right font-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E5D6D0]">
                                {vouchers.map((v) => (
                                    <tr key={v.id}>
                                        <td className="whitespace-nowrap px-5 py-3 font-semibold text-[#5B0F18]">
                                            {v.promo_code}
                                        </td>
                                        <td className="px-5 py-3 text-[#1E1E1E]">{v.title}</td>
                                        <td className="whitespace-nowrap px-5 py-3 text-[#8C7777]">
                                            {v.discount_type === "percentage"
                                                ? `${v.discount_value}%`
                                                : currency(v.discount_value)}
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-3 text-[#8C7777]">
                                            {v.used_quota ?? 0}/{v.quota}
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-3 text-[#8C7777]">
                                            {formatDate(v.start_date)} - {formatDate(v.end_date)}
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <div className="flex justify-end gap-1">
                                                <button
                                                    onClick={() => openEdit(v)}
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8C7777] transition hover:bg-[#F8F1E7] hover:text-[#1E1E1E]"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(v)}
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
                </div>
            )}

            {modalOpen && (
                <CrudModal
                    title={editing ? "Edit Voucher" : "Tambah Voucher"}
                    onClose={() => setModalOpen(false)}
                    maxWidth="max-w-xl"
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-[#1E1E1E]">Judul</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                                    placeholder="Diskon Akhir Tahun"
                                    className="w-full rounded-xl border border-[#E5D6D0] px-4 py-2.5 text-sm outline-none focus:border-[#7A1F2B]"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-[#1E1E1E]">Kode Voucher</label>
                                <input
                                    type="text"
                                    value={form.promo_code}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, promo_code: e.target.value.toUpperCase() }))
                                    }
                                    placeholder="DISKON10"
                                    className="w-full rounded-xl border border-[#E5D6D0] px-4 py-2.5 text-sm uppercase outline-none focus:border-[#7A1F2B]"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-[#1E1E1E]">Tipe Diskon</label>
                                <select
                                    value={form.discount_type}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, discount_type: e.target.value }))
                                    }
                                    className="w-full rounded-xl border border-[#E5D6D0] px-4 py-2.5 text-sm outline-none focus:border-[#7A1F2B]"
                                >
                                    <option value="percentage">Persentase (%)</option>
                                    <option value="fixed">Nominal Tetap (Rp)</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-[#1E1E1E]">
                                    Nilai Diskon
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={form.discount_value}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, discount_value: e.target.value }))
                                    }
                                    placeholder={form.discount_type === "percentage" ? "10" : "20000"}
                                    className="w-full rounded-xl border border-[#E5D6D0] px-4 py-2.5 text-sm outline-none focus:border-[#7A1F2B]"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-[#1E1E1E]">
                                    Min. Jumlah Tiket
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={form.minimum_ticket}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, minimum_ticket: e.target.value }))
                                    }
                                    className="w-full rounded-xl border border-[#E5D6D0] px-4 py-2.5 text-sm outline-none focus:border-[#7A1F2B]"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-[#1E1E1E]">Kuota</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={form.quota}
                                    onChange={(e) => setForm((f) => ({ ...f, quota: e.target.value }))}
                                    placeholder="100"
                                    className="w-full rounded-xl border border-[#E5D6D0] px-4 py-2.5 text-sm outline-none focus:border-[#7A1F2B]"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-[#1E1E1E]">
                                    Tanggal Mulai
                                </label>
                                <input
                                    type="date"
                                    value={form.start_date}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, start_date: e.target.value }))
                                    }
                                    className="w-full rounded-xl border border-[#E5D6D0] px-4 py-2.5 text-sm outline-none focus:border-[#7A1F2B]"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-[#1E1E1E]">
                                    Tanggal Berakhir
                                </label>
                                <input
                                    type="date"
                                    value={form.end_date}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, end_date: e.target.value }))
                                    }
                                    className="w-full rounded-xl border border-[#E5D6D0] px-4 py-2.5 text-sm outline-none focus:border-[#7A1F2B]"
                                />
                            </div>
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