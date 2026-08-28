// services/paymentService.js
import api from "@/lib/api";

/**
 * Membuat transaksi Midtrans Snap untuk sebuah order.
 * Idempotent di backend: kalau payment untuk order ini sudah ada,
 * snap_token yang sama akan dikembalikan lagi (tidak generate baru).
 * Return: { snap_token, redirect_url }
 */
export const createPayment = async (orderId) => {
    const { data } = await api.post("/payments", { order_id: orderId });
    return data.data;
};

/**
 * Ambil status payment terbaru untuk sebuah order (dipakai untuk polling
 * setelah user menyelesaikan pembayaran di popup Snap / redirect).
 */
export const getPayment = async (orderId) => {
    const { data } = await api.get(`/payments/order/${orderId}`);
    return data.data;
};