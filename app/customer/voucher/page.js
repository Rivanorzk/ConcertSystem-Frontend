// app/customer/vouchers/page.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Gift,
    Ticket,
    ChevronRight,
    Percent,
    DollarSign,
    CalendarDays,
    CheckCircle,
    XCircle,
} from "lucide-react";

import { getVouchers } from "@/services/voucherService";
import SectionHeader from "@/components/sectionHeader";
import LoadingSpinner from "@/components/loadingSpinner";
import EmptyState from "@/components/emptyState";
import { currency, formatDate } from "@/lib/formatter";

export default function VouchersPage() {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadVouchers = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getVouchers();
                setVouchers(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Error loading vouchers:", err);
                setError("Gagal memuat voucher. Silakan coba lagi.");
            } finally {
                setLoading(false);
            }
        };

        loadVouchers();
    }, []);

    const statusMap = {
        'belum digunakan': { label: "Tersedia", color: "bg-green-100 text-green-700", icon: CheckCircle },
        'aktif': { label: "Aktif", color: "bg-blue-100 text-blue-700", icon: CheckCircle },
        'berakhir': { label: "Kadaluarsa", color: "bg-red-100 text-red-700", icon: XCircle },
    };

    const getStatus = (status) => {
        return statusMap[status?.toLowerCase()] || statusMap['belum digunakan'];
    };

    const getDiscountIcon = (type) => {
        return type === 'percentage' ? Percent : DollarSign;
    };

    return (
        <div>
            <SectionHeader
                title="Voucher Saya"
                description="Kumpulan voucher dan promo yang tersedia"
            />

            <div className="mt-8">
                {loading ? (
                    <LoadingSpinner text="Memuat voucher..." />
                ) : error ? (
                    <EmptyState title="Terjadi Kesalahan" description={error} />
                ) : vouchers.length === 0 ? (
                    <EmptyState
                        icon={Gift}
                        title="Belum Ada Voucher"
                        description="Anda belum memiliki voucher. Pantau terus promo terbaru!"
                    />
                ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                        {vouchers.map((voucher) => {
                            const status = getStatus(voucher.status);
                            const StatusIcon = status.icon;
                            const DiscountIcon = getDiscountIcon(voucher.discount_type);

                            return (
                                <div
                                    key={voucher.id}
                                    className="bg-white border border-[#E5D6D0] rounded-2xl overflow-hidden hover:shadow-md transition"
                                >
                                    <div className="p-5 border-b border-[#E5D6D0] bg-gradient-to-r from-[#5B0F18] to-[#7A1F2B]">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/20 text-white`}>
                                                    <StatusIcon className="w-3.5 h-3.5" />
                                                    {status.label}
                                                </span>
                                                <p className="text-white/80 text-xs mt-1.5 font-mono">
                                                    {voucher.promo_code}
                                                </p>
                                            </div>
                                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                                <Gift className="w-5 h-5 text-white" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        <h3 className="font-bold text-[#1E1E1E]">
                                            {voucher.title || "Voucher"}
                                        </h3>

                                        <div className="mt-3 flex items-center gap-3">
                                            <div className="flex items-center gap-1.5 text-[#5B0F18] font-bold text-lg">
                                                <DiscountIcon className="w-4 h-4" />
                                                <span>
                                                    {voucher.discount_type === 'percentage'
                                                        ? `${voucher.discount_value}%`
                                                        : currency(voucher.discount_value)
                                                    }
                                                </span>
                                            </div>
                                            <span className="text-xs text-[#737373]">
                                                Min. {voucher.minimum_ticket} tiket
                                            </span>
                                        </div>

                                        <div className="mt-3 space-y-1.5 text-xs text-[#737373]">
                                            <div className="flex items-center gap-2">
                                                <CalendarDays className="w-3.5 h-3.5 text-[#7A1F2B]" />
                                                <span>{formatDate(voucher.start_date)} - {formatDate(voucher.end_date)}</span>
                                            </div>
                                            {voucher.quota > 0 && (
                                                <div className="flex items-center gap-2">
                                                    <Ticket className="w-3.5 h-3.5 text-[#7A1F2B]" />
                                                    <span>{voucher.used_quota || 0} / {voucher.quota} digunakan</span>
                                                </div>
                                            )}
                                        </div>

                                        {voucher.event_id && (
                                            <Link
                                                href={`/customer/event/${voucher.event_id}`}
                                                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#7A1F2B] hover:underline"
                                            >
                                                Lihat Event
                                                <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}