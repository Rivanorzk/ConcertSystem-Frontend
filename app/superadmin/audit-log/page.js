// app/superadmin/audit-log/page.js
"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, History, RefreshCcw } from "lucide-react";
import { toast } from "react-hot-toast";

import { getAuditLogs } from "@/services/auditLogService";
import LoadingSpinner from "@/components/loadingSpinner";
import EmptyState from "@/components/emptyState";

const ACTION_OPTIONS = [
    { value: "", label: "Semua Aksi" },
    { value: "DELETE_TICKET_CATEGORY", label: "Hapus Kategori Tiket" },
    { value: "DELETE_VOUCHER", label: "Hapus Voucher" },
    { value: "UPDATE_USER_ROLE", label: "Ubah Role User" },
    { value: "DELETE_USER", label: "Hapus User" },
];

const ACTION_BADGES = {
    DELETE_TICKET_CATEGORY: "bg-[#F3E4E4] text-[#B3261E]",
    DELETE_VOUCHER: "bg-[#F3E4E4] text-[#B3261E]",
    UPDATE_USER_ROLE: "bg-[#FDF3D8] text-[#B4841F]",
    DELETE_USER: "bg-[#F3E4E4] text-[#B3261E]",
};

function formatDateTime(value) {
    if (!value) return "-";
    return new Date(value).toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

export default function AuditLogPage() {
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit] = useState(20);
    const [actionFilter, setActionFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    const loadLogs = async () => {
        try {
            setLoading(true);
            setError(null);

            const result = await getAuditLogs({
                action: actionFilter || undefined,
                page,
                limit,
            });

            setRows(result.rows || []);
            setTotal(result.total || 0);
        } catch (err) {
            console.error("Error loading audit logs:", err);
            setError(err.message || "Gagal memuat audit log");
            toast.error(err.message || "Gagal memuat audit log");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLogs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, actionFilter]);

    return (
        <div>
            {/* HEADER */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="flex items-center gap-2 text-xl font-bold text-[#1E1E1E]">
                        <History className="h-5 w-5 text-[#7A1F2B]" />
                        Audit Log
                    </h1>
                    <p className="mt-1 text-sm text-[#8C7777]">
                        Jejak semua aksi sensitif yang cuma bisa dilakukan superadmin.
                    </p>
                </div>

                <button
                    onClick={loadLogs}
                    className="flex items-center gap-2 rounded-xl border border-[#E5D6D0] bg-white px-4 py-2 text-sm font-semibold text-[#1E1E1E] transition hover:bg-[#F8F1E7]"
                >
                    <RefreshCcw className="h-4 w-4" />
                    Refresh
                </button>
            </div>

            {/* FILTER */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
                <select
                    value={actionFilter}
                    onChange={(e) => {
                        setPage(1);
                        setActionFilter(e.target.value);
                    }}
                    className="rounded-xl border border-[#E5D6D0] bg-white px-4 py-2 text-sm text-[#1E1E1E] outline-none focus:border-[#7A1F2B]"
                >
                    {ACTION_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* CONTENT */}
            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <LoadingSpinner text="Memuat audit log..." />
                </div>
            ) : error ? (
                <EmptyState title="Gagal memuat data" description={error} />
            ) : rows.length === 0 ? (
                <EmptyState
                    title="Belum ada aktivitas"
                    description="Belum ada aksi sensitif yang tercatat."
                />
            ) : (
                <div className="overflow-hidden rounded-2xl border border-[#E5D6D0] bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#F8F1E7] text-xs uppercase tracking-wide text-[#8C7777]">
                                <tr>
                                    <th className="px-5 py-3 font-semibold">Waktu</th>
                                    <th className="px-5 py-3 font-semibold">Aktor</th>
                                    <th className="px-5 py-3 font-semibold">Aksi</th>
                                    <th className="px-5 py-3 font-semibold">Deskripsi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E5D6D0]">
                                {rows.map((log) => (
                                    <tr key={log.id} className="align-top">
                                        <td className="whitespace-nowrap px-5 py-3 text-[#8C7777]">
                                            {formatDateTime(log.created_at)}
                                        </td>
                                        <td className="px-5 py-3">
                                            <p className="font-medium text-[#1E1E1E]">
                                                {log.actor_username}
                                            </p>
                                            <p className="text-xs capitalize text-[#8C7777]">
                                                {log.actor_role}
                                            </p>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                    ACTION_BADGES[log.action] ||
                                                    "bg-[#F8F1E7] text-[#8C7777]"
                                                }`}
                                            >
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-[#1E1E1E]">
                                            {log.description}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    <div className="flex items-center justify-between border-t border-[#E5D6D0] px-5 py-3">
                        <p className="text-xs text-[#8C7777]">
                            Halaman {page} dari {totalPages} • {total} log
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page <= 1}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5D6D0] transition hover:bg-[#F8F1E7] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page >= totalPages}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5D6D0] transition hover:bg-[#F8F1E7] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}