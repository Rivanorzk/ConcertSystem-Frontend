// app/customer/payment/[orderId]/page.js
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    CreditCard,
    Loader2,
    RefreshCcw,
    XCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

import { getOrderById } from "@/services/orderService";
import { createPayment, getPayment } from "@/services/paymentService";
import LoadingSpinner from "@/components/loadingSpinner";
import EmptyState from "@/components/emptyState";
import { currency, formatDate, formatTime } from "@/lib/formatter";

// Sandbox / production Snap.js ditentukan oleh MIDTRANS_IS_PRODUCTION di backend.
// Sesuaikan ke "https://app.midtrans.com/snap/snap.js" kalau sudah production.
const SNAP_SRC = "https://app.sandbox.midtrans.com/snap/snap.js";
const MIDTRANS_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

const POLL_INTERVAL = 5000;
const FINAL_ORDER_STATUSES = ["paid", "expired", "cancelled", "failed"];

function StatusBadge({ status }) {
    const map = {
        pending: { label: "Menunggu Pembayaran", classes: "bg-[#FDF3D8] text-[#B4841F]" },
        paid: { label: "Pembayaran Berhasil", classes: "bg-[#E4F3EA] text-[#1E7A4C]" },
        expired: { label: "Kedaluwarsa", classes: "bg-[#F3E4E4] text-[#B3261E]" },
        cancelled: { label: "Dibatalkan", classes: "bg-[#F3E4E4] text-[#B3261E]" },
        failed: { label: "Gagal", classes: "bg-[#F3E4E4] text-[#B3261E]" },
    };

    const { label, classes } = map[status] || map.pending;

    return (
        <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${classes}`}>
            {label}
        </span>
    );
}

function useCountdown(targetDate) {
    const [remaining, setRemaining] = useState(null);

    useEffect(() => {
        if (!targetDate) return;

        const target = new Date(targetDate).getTime();

        const tick = () => {
            const diff = target - Date.now();
            setRemaining(diff > 0 ? diff : 0);
        };

        tick();
        const timer = setInterval(tick, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    if (remaining === null) return null;

    const totalSeconds = Math.floor(remaining / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function PaymentPage() {
    const { orderId } = useParams();
    const router = useRouter();

    const [order, setOrder] = useState(null);
    const [payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [snapReady, setSnapReady] = useState(false);
    const [payingLoading, setPayingLoading] = useState(false);

    const pollRef = useRef(null);

    const countdown = useCountdown(order?.expired_at);

    // =========================
    // Load order + create/fetch payment (snap token)
    // =========================
    const loadData = useCallback(async () => {
        try {
            const orderData = await getOrderById(orderId);
            setOrder(orderData);

            if (orderData.status === "pending") {
                const paymentData = await createPayment(orderId);
                setPayment((prev) => ({ ...prev, ...paymentData }));
            } else {
                try {
                    const paymentData = await getPayment(orderId);
                    setPayment(paymentData);
                } catch {
                    // payment record mungkin belum ada, biarkan saja
                }
            }

            return orderData;
        } catch (err) {
            console.error("Error loading payment:", err);
            setError(err.message || "Gagal memuat data pembayaran");
            return null;
        }
    }, [orderId]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            await loadData();
            setLoading(false);
        })();
    }, [loadData]);

    // =========================
    // Polling status selama order masih pending
    // (menunggu callback/webhook Midtrans diproses backend)
    // =========================
    useEffect(() => {
        if (!order) return;

        if (FINAL_ORDER_STATUSES.includes(order.status)) {
            clearInterval(pollRef.current);
            return;
        }

        pollRef.current = setInterval(async () => {
            try {
                const orderData = await getOrderById(orderId);
                setOrder(orderData);

                if (FINAL_ORDER_STATUSES.includes(orderData.status)) {
                    clearInterval(pollRef.current);

                    if (orderData.status === "paid") {
                        toast.success("Pembayaran berhasil! Tiket kamu sudah terbit.");
                    }
                }
            } catch (err) {
                console.error("Polling error:", err);
            }
        }, POLL_INTERVAL);

        return () => clearInterval(pollRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order?.status, orderId]);

    const handlePay = () => {
        if (!payment?.snap_token) {
            toast.error("Token pembayaran belum siap, coba beberapa saat lagi");
            return;
        }

        if (!window.snap) {
            toast.error("Sistem pembayaran belum siap, muat ulang halaman");
            return;
        }

        setPayingLoading(true);

        window.snap.pay(payment.snap_token, {
            onSuccess: () => {
                toast.success("Pembayaran diterima, menunggu konfirmasi...");
                loadData();
            },
            onPending: () => {
                toast("Selesaikan pembayaran sesuai instruksi yang diberikan", {
                    icon: "⏳",
                });
                loadData();
            },
            onError: () => {
                toast.error("Pembayaran gagal, silakan coba lagi");
            },
            onClose: () => {
                toast("Kamu bisa melanjutkan pembayaran kapan saja sebelum waktu habis", {
                    icon: "ℹ️",
                });
            },
        });

        setPayingLoading(false);
    };

    const handleRefresh = async () => {
        setLoading(true);
        await loadData();
        setLoading(false);
    };

    /* =========================
       LOADING
    ========================= */
    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <LoadingSpinner text="Menyiapkan pembayaran..." />
            </div>
        );
    }

    /* =========================
       ERROR
    ========================= */
    if (error || !order) {
        return (
            <div className="mx-auto max-w-2xl">
                <EmptyState
                    title="Pembayaran tidak ditemukan"
                    description={error || "Order tidak ditemukan."}
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

    const isPending = order.status === "pending";
    const isPaid = order.status === "paid";
    const isFailedState = ["expired", "cancelled", "failed"].includes(order.status);

    return (
        <div className="mx-auto max-w-2xl">
            {MIDTRANS_CLIENT_KEY && (
                <Script
                    src={SNAP_SRC}
                    data-client-key={MIDTRANS_CLIENT_KEY}
                    onLoad={() => setSnapReady(true)}
                    strategy="afterInteractive"
                />
            )}

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
                    Pembayaran
                </h1>
            </div>

            <div className="space-y-4">
                {/* STATUS HEADER */}
                <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-8 text-center shadow-sm">
                    {isPaid && (
                        <CheckCircle2 className="h-14 w-14 text-[#1E7A4C]" />
                    )}
                    {isFailedState && (
                        <XCircle className="h-14 w-14 text-[#B3261E]" />
                    )}
                    {isPending && (
                        <CreditCard className="h-14 w-14 text-[#7A1F2B]" />
                    )}

                    <StatusBadge status={order.status} />

                    <div>
                        <p className="text-sm text-[#8C7777]">Total Pembayaran</p>
                        <p className="text-2xl font-bold text-[#5B0F18]">
                            {currency(order.final_price)}
                        </p>
                    </div>

                    {isPending && countdown && (
                        <div className="flex items-center gap-1.5 text-sm font-medium text-[#B4841F]">
                            <Clock className="h-4 w-4" />
                            Selesaikan dalam {countdown}
                        </div>
                    )}
                </div>

                {/* ORDER INFO */}
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <h3 className="mb-3 text-sm font-bold text-[#1E1E1E]">
                        Detail Order
                    </h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-[#8C7777]">
                            <span>No. Invoice</span>
                            <span className="font-medium text-[#1E1E1E]">
                                {order.invoice_number}
                            </span>
                        </div>
                        <div className="flex justify-between text-[#8C7777]">
                            <span>Tanggal Order</span>
                            <span className="font-medium text-[#1E1E1E]">
                                {formatDate(order.created_at)} {formatTime(order.created_at)}
                            </span>
                        </div>
                        <div className="flex justify-between text-[#8C7777]">
                            <span>Harga Tiket</span>
                            <span>{currency(order.total_price)}</span>
                        </div>
                        {order.discount_amount > 0 && (
                            <div className="flex justify-between text-[#1E7A4C]">
                                <span>Diskon</span>
                                <span>-{currency(order.discount_amount)}</span>
                            </div>
                        )}
                        {payment?.payment_type && (
                            <div className="flex justify-between text-[#8C7777]">
                                <span>Metode Pembayaran</span>
                                <span className="font-medium capitalize text-[#1E1E1E]">
                                    {payment.payment_type.replace(/_/g, " ")}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* ACTIONS */}
                {isPending && (
                    <button
                        onClick={handlePay}
                        disabled={!snapReady || !payment?.snap_token || payingLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#5B0F18] py-3.5 text-sm font-bold text-white transition hover:bg-[#7A1F2B] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {payingLoading || !snapReady ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Menyiapkan pembayaran...
                            </>
                        ) : (
                            <>
                                <CreditCard className="h-4 w-4" />
                                Bayar Sekarang
                            </>
                        )}
                    </button>
                )}

                {isPending && (
                    <button
                        onClick={handleRefresh}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#E5D6D0] py-3 text-sm font-semibold text-[#1E1E1E] transition hover:bg-[#F8F1E7]"
                    >
                        <RefreshCcw className="h-4 w-4" />
                        Cek Status Pembayaran
                    </button>
                )}

                {isPaid && (
                    <Link
                        href="/customer/ticket"
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#5B0F18] py-3.5 text-sm font-bold text-white transition hover:bg-[#7A1F2B]"
                    >
                        Lihat Tiket Saya
                    </Link>
                )}

                {isFailedState && (
                    <Link
                        href="/customer/event"
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1E1E1E] py-3.5 text-sm font-bold text-white transition hover:bg-[#3A0810]"
                    >
                        Cari Event Lain
                    </Link>
                )}
            </div>
        </div>
    );
}