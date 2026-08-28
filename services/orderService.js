// services/orderService.js
import api from "@/lib/api";

/**
 * Buat order baru.
 * payload: {
 *   event_id: number,
 *   voucher_code?: string,
 *   tickets: [{ ticket_category_id: number, quantity: number }]
 * }
 */
export const createOrder = async (payload) => {
    const { data } = await api.post("/orders", payload);
    return data.data;
};

export const getMyOrders = async () => {
    const { data } = await api.get("/orders/my-orders");
    return data.data;
};

export const getOrderById = async (id) => {
    const { data } = await api.get(`/orders/${id}`);
    return data.data;
};

export const cancelOrder = async (id) => {
    const { data } = await api.put(`/orders/cancel/${id}`);
    return data.data;
};