// app/customer/checkout/page.js
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    BadgePercent,
    CalendarDays,
    Loader2,
    MapPin,
    Music,
    ShieldCheck,
    Ticket,
    X,
} from "lucide-react";
import { toast } from "react-hot-toast";

import { getEventById } from "@/services/eventService";
import { createOrder } from "@/services/orderService";
import { validateVoucher } from "@/services/voucherService";
import { isAuthenticated } from "@/lib/auth";
import LoadingSpinner from "@/components/loadingSpinner";
import EmptyState from "@/components/emptyState";
import { currency, formatDate, formatTime } from "@/lib/formatter";

export default function CheckoutPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const eventId = searchParams.get("event_id");
    const ticketId = searchParams.get("ticket_id");
    const initialQuantity = Number(searchParams.get("quantity") || 1);

    const [event, setEvent] = useState(null);
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [quantity, setQuantity] = useState(
        Number.isFinite(initialQuantity) && initialQuantity > 0
            ? initialQuantity
            : 1
    );

    const [voucherInput, setVoucherInput] = useState("");
    const [appliedVoucher, setAppliedVoucher] = useState(null);
    const [voucherLoading, setVoucherLoading] = useState(false);

    const [submitting, setSubmitting] = useState(false);

    // =========================
    // Guard: harus login
    // =========================
    useEffect(() => {
        if (!isAuthenticated()) {
            toast.error("Silakan login untuk melanjutkan checkout");
            if (typeof window !== "undefined") {
                localStorage.setItem(
                    "redirectAfterLogin",
                    window.location.pathname + window.location.search
                );
            }
            router.push("/login");
        }
    }, [router]);

    // =========================
    // Load event & ticket category
    // =========================
    useEffect(() => {
        const load = async () => {
            if (!eventId || !ticketId) {
                setError("Data tiket tidak lengkap");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const data = await getEventById(eventId);
                const selected = (data?.ticket_categories || []).find(
                    (t) => String(t.id) === String(ticketId)
                );

                if (!selected) {
                    setError("Kategori tiket tidak ditemukan");
                    return;
                }

                setEvent(data);
                setTicket(selected);
                setQuantity((q) => Math.min(Math.max(q, 1), selected.remaining_stock || 1));
            } catch (err) {
                console.error("Error loading checkout data:", err);
                setError(err.message || "Gagal memuat data checkout");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [eventId, ticketId]);

    // =========================
    // Reset voucher kalau quantity berubah (minimum_ticket bisa berubah validitasnya)
    // =========================
    useEffect(() => {
        if (appliedVoucher) {
            setAppliedVoucher(null);
            toast("Voucher perlu diterapkan ulang karena jumlah tiket berubah", {
                icon: "ℹ️",
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quantity]);

    const subtotal = useMemo(() => {
        if (!ticket) return 0;
        return ticket.price * quantity;
    }, [ticket, quantity]);

    const discount = useMemo(() => {
        if (!appliedVoucher) return 0;

        const raw =
            appliedVoucher.discount_type === "percentage"
                ? (subtotal * appliedVoucher.discount_value) / 100
                : Number(appliedVoucher.discount_value);

        return Math.min(raw, subtotal);
    }, [appliedVoucher, subtotal]);

    const finalPrice = Math.max(subtotal - discount, 0);

    const handleApplyVoucher = async () => {
        if (!voucherInput.trim()) {
            toast.error("Masukkan kode voucher terlebih dahulu");
            return;
        }

        try {
            setVoucherLoading(true);
            const voucher = await validateVoucher(
                voucherInput.trim(),
                quantity
            );
            setAppliedVoucher(voucher);
            toast.success(`Voucher ${voucher.promo_code} berhasil diterapkan`);
        } catch (err) {
            setAppliedVoucher(null);
            toast.error(err.message || "Voucher tidak valid");
        } finally {
            setVoucherLoading(false);
        }
    };

    const handleRemoveVoucher = () => {
        setAppliedVoucher(null);
        setVoucherInput("");
    };

    const handleCheckout = async () => {
        if (!ticket) return;

        if (quantity < 1) {
            toast.error("Minimum pembelian 1 tiket");
            return;
        }

        if (quantity > ticket.remaining_stock) {
            toast.error(`Stok tersisa hanya ${ticket.remaining_stock}`);
            return;
        }

        try {
            setSubmitting(true);

            const order = await createOrder({
                event_id: Number(eventId),
                voucher_code: appliedVoucher?.promo_code || undefined,
                tickets: [
                    {
                        ticket_category_id: ticket.id,
                        quantity,
                    },
                ],
            });

            toast.success("Order berhasil dibuat, lanjut ke pembayaran");
            router.push(`/customer/payment/${order.id}`);
        } catch (err) {
            console.error("Checkout error:", err);
            toast.error(err.message || "Gagal membuat order");
        } finally {
            setSubmitting(false);
        }
    };

    /* =========================
       LOADING
    ========================= */
    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <LoadingSpinner text="Menyiapkan checkout..." />
            </div>
        );
    }

    /* =========================
       ERROR
    ========================= */
    if (error || !event || !ticket) {
        return (
            <div className="mx-auto max-w-3xl">
                <EmptyState
                    title="Checkout tidak tersedia"
                    description={error || "Data tiket tidak ditemukan."}
                />
                <Link
                    href="/customer/event"
                    className="mt-4 inline-flex items-center gap-2 text-[#7A1F2B] hover:underline"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Event
                </Link>
            </div>
        );
    }

    const soldOut = ticket.remaining_stock === 0;

    return (
        <div className="mx-auto max-w-3xl pb-28 lg:pb-8">
            {/* TOP BAR */}
            <div className="mb-6 flex items-center gap-3">
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#1E1E1E] shadow-sm transition hover:bg-[#F8F1E7]"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>
                <h1 className="text-lg font-bold text-[#1E1E1E] sm:text-xl">
                    Checkout
                </h1>
            </div>

            <div className="space-y-4">
                {/* EVENT INFO */}
                <div className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#5B0F18]">
                        {event.poster ? (
                            <img
                                src={event.poster}
                                alt={event.title}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center">
                                <Music className="h-6 w-6 text-white/50" />
                            </div>
                        )}
                    </div>
                    <div className="min-w-0">
                        <h2 className="truncate font-bold text-[#1E1E1E]">
                            {event.title}
                        </h2>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-[#8C7777]">
                            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                            <span>
                                {formatDate(event.event_date)} • {formatTime(event.start_time)}
                            </span>
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-[#8C7777]">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">
                                {event.location || "To be announced"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* TICKET DETAIL */}
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#1E1E1E]">
                        <Ticket className="h-4 w-4 text-[#7A1F2B]" />
                        Detail Tiket
                    </h3>

                    <div className="flex items-center justify-between gap-4 rounded-xl border border-[#E5D6D0] p-4">
                        <div>
                            <p className="font-semibold text-[#1E1E1E]">
                                {ticket.category_name || "Regular"}
                            </p>
                            <p className="mt-0.5 text-sm text-[#8C7777]">
                                {currency(ticket.price)} / tiket
                            </p>
                            {!soldOut && (
                                <p className="mt-0.5 text-xs text-[#8C7777]">
                                    Sisa {ticket.remaining_stock} tiket
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                disabled={soldOut}
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E5D6D0] transition hover:bg-[#F8F1E7] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                -
                            </button>
                            <span className="w-8 text-center font-semibold text-[#1E1E1E]">
                                {quantity}
                            </span>
                            <button
                                onClick={() =>
                                    setQuantity((q) =>
                                        Math.min(ticket.remaining_stock || 0, q + 1)
                                    )
                                }
                                disabled={soldOut || quantity >= ticket.remaining_stock}
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E5D6D0] transition hover:bg-[#F8F1E7] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {soldOut && (
                        <p className="mt-3 text-sm font-medium text-[#B3261E]">
                            Tiket kategori ini sudah habis.
                        </p>
                    )}
                </div>

                {/* VOUCHER */}
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#1E1E1E]">
                        <BadgePercent className="h-4 w-4 text-[#7A1F2B]" />
                        Kode Voucher
                    </h3>

                    {appliedVoucher ? (
                        <div className="flex items-center justify-between rounded-xl bg-[#F8F1E7] px-4 py-3">
                            <div>
                                <p className="text-sm font-semibold text-[#1E7A4C]">
                                    {appliedVoucher.promo_code} diterapkan
                                </p>
                                <p className="text-xs text-[#8C7777]">
                                    {appliedVoucher.discount_type === "percentage"
                                        ? `Diskon ${appliedVoucher.discount_value}%`
                                        : `Diskon ${currency(appliedVoucher.discount_value)}`}
                                </p>
                            </div>
                            <button
                                onClick={handleRemoveVoucher}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-[#8C7777] transition hover:bg-white hover:text-[#B3261E]"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={voucherInput}
                                onChange={(e) =>
                                    setVoucherInput(e.target.value.toUpperCase())
                                }
                                placeholder="Masukkan kode voucher"
                                className="flex-1 rounded-xl border border-[#E5D6D0] px-4 py-2.5 text-sm text-[#1E1E1E] outline-none transition focus:border-[#7A1F2B]"
                            />
                            <button
                                onClick={handleApplyVoucher}
                                disabled={voucherLoading}
                                className="shrink-0 rounded-xl bg-[#1E1E1E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3A0810] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {voucherLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    "Terapkan"
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* PRICE SUMMARY */}
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <h3 className="mb-3 text-sm font-bold text-[#1E1E1E]">
                        Ringkasan Pembayaran
                    </h3>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-[#8C7777]">
                            <span>
                                Subtotal ({quantity}x {ticket.category_name || "Tiket"})
                            </span>
                            <span>{currency(subtotal)}</span>
                        </div>

                        {discount > 0 && (
                            <div className="flex justify-between text-[#1E7A4C]">
                                <span>Diskon Voucher</span>
                                <span>-{currency(discount)}</span>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-[#E5D6D0] pt-4">
                        <span className="font-semibold text-[#1E1E1E]">
                            Total Bayar
                        </span>
                        <span className="text-xl font-bold text-[#5B0F18]">
                            {currency(finalPrice)}
                        </span>
                    </div>
                </div>

                {/* INFO */}
                <div className="flex items-start gap-2 rounded-2xl bg-[#F8F1E7] p-4 text-xs text-[#8C7777]">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#7A1F2B]" />
                    <p>
                        Order akan menunggu pembayaran selama 15 menit. Jika belum
                        dibayar sampai batas waktu tersebut, tiket akan otomatis
                        dilepas kembali.
                    </p>
                </div>

                {/* DESKTOP CTA */}
                <button
                    onClick={handleCheckout}
                    disabled={submitting || soldOut}
                    className="hidden w-full items-center justify-center gap-2 rounded-2xl bg-[#5B0F18] py-3.5 text-sm font-bold text-white transition hover:bg-[#7A1F2B] disabled:cursor-not-allowed disabled:opacity-60 lg:flex"
                >
                    {submitting ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Memproses...
                        </>
                    ) : (
                        `Lanjutkan ke Pembayaran • ${currency(finalPrice)}`
                    )}
                </button>
            </div>

            {/* MOBILE STICKY CTA */}
            <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#E5D6D0] bg-white p-4 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] lg:hidden">
                <button
                    onClick={handleCheckout}
                    disabled={submitting || soldOut}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#5B0F18] py-3.5 text-sm font-bold text-white transition hover:bg-[#7A1F2B] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {submitting ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Memproses...
                        </>
                    ) : (
                        `Bayar • ${currency(finalPrice)}`
                    )}
                </button>
            </div>
        </div>
    );
}