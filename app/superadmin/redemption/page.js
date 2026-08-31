// app/superadmin/redemption/page.js
"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, QrCode } from "lucide-react";
import { toast } from "react-hot-toast";

import { getRedemptions, redeemTicket } from "@/services/redemptionService";
import LoadingSpinner from "@/components/loadingSpinner";
import EmptyState from "@/components/emptyState";

function formatDateTime(value) {
    if (!value) return "-";
    return new Date(value).toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

export default function RedemptionPage() {
    const [ticketCode, setTicketCode] = useState("");
    const [notes, setNotes] = useState("");
    const [checking, setChecking] = useState(false);

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadLogs = async () => {
        try {
            setLoading(true);
            const data = await getRedemptions();
            setLogs(data);
        } catch (err) {
            toast.error(err.message || "Gagal memuat riwayat check-in");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLogs();
    }, []);

    const handleCheckIn = async (e) => {
        e.preventDefault();

        if (!ticketCode.trim()) {
            toast.error("Masukkan kode tiket");
            return;
        }

        try {
            setChecking(true);
            const result = await redeemTicket({
                ticket_code: ticketCode.trim(),
                notes: notes.trim() || undefined,
            });
            toast.success(`Tiket ${result.ticket_code} berhasil check-in`);
            setTicketCode("");
            setNotes("");
            loadLogs();
        } catch (err) {
            toast.error(err.message || "Gagal check-in tiket");
        } finally {
            setChecking(false);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="flex items-center gap-2 text-xl font-bold text-[#1E1E1E]">
                    <QrCode className="h-5 w-5 text-[#7A1F2B]" />
                    Check-in Tiket
                </h1>
                <p className="mt-1 text-sm text-[#8C7777]">
                    Masukkan kode tiket untuk menandai tiket sudah dipakai.
                </p>
            </div>

            {/* CHECK-IN FORM */}
            <form
                onSubmit={handleCheckIn}
                className="mb-6 flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-end"
            >
                <div className="flex-1">
                    <label className="mb-1 block text-sm font-medium text-[#1E1E1E]">Kode Tiket</label>
                    <input
                        type="text"
                        value={ticketCode}
                        onChange={(e) => setTicketCode(e.target.value)}
                        placeholder="TCK-XXXXXXXX"
                        className="w-full rounded-xl border border-[#E5D6D0] px-4 py-2.5 text-sm outline-none focus:border-[#7A1F2B]"
                    />
                </div>
                <div className="flex-1">
                    <label className="mb-1 block text-sm font-medium text-[#1E1E1E]">Catatan (opsional)</label>
                    <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Contoh: masuk via pintu utama"
                        className="w-full rounded-xl border border-[#E5D6D0] px-4 py-2.5 text-sm outline-none focus:border-[#7A1F2B]"
                    />
                </div>
                <button
                    type="submit"
                    disabled={checking}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#5B0F18] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#7A1F2B] disabled:opacity-60"
                >
                    {checking ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <CheckCircle2 className="h-4 w-4" />
                    )}
                    Check-in
                </button>
            </form>

            {/* HISTORY */}
            {loading ? (
                <div className="flex justify-center py-16">
                    <LoadingSpinner text="Memuat riwayat check-in..." />
                </div>
            ) : logs.length === 0 ? (
                <EmptyState title="Belum ada check-in" description="Riwayat check-in tiket akan muncul di sini." />
            ) : (
                <div className="overflow-hidden rounded-2xl border border-[#E5D6D0] bg-white">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#F8F1E7] text-xs uppercase tracking-wide text-[#8C7777]">
                            <tr>
                                <th className="px-5 py-3 font-semibold">Kode Tiket</th>
                                <th className="px-5 py-3 font-semibold">Diproses Oleh</th>
                                <th className="px-5 py-3 font-semibold">Catatan</th>
                                <th className="px-5 py-3 font-semibold">Waktu</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5D6D0]">
                            {logs.map((log) => (
                                <tr key={log.id}>
                                    <td className="whitespace-nowrap px-5 py-3 font-medium text-[#1E1E1E]">
                                        {log.ticket_code}
                                    </td>
                                    <td className="px-5 py-3 text-[#8C7777]">{log.admin_name}</td>
                                    <td className="px-5 py-3 text-[#8C7777]">{log.notes || "-"}</td>
                                    <td className="whitespace-nowrap px-5 py-3 text-[#8C7777]">
                                        {formatDateTime(log.redeemed_at)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}