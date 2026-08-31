// services/redemptionService.js
import api from "@/lib/api";

export const getRedemptions = async () => {
    const { data } = await api.get("/redemptions");
    return data.data;
};

export const getRedemptionById = async (id) => {
    const { data } = await api.get(`/redemptions/${id}`);
    return data.data;
};

export const redeemTicket = async ({ ticket_code, notes }) => {
    const { data } = await api.post("/redemptions", { ticket_code, notes });
    return data.data;
};