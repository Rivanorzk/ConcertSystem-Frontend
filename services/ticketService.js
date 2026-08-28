import api from "@/lib/api";

export const getTickets = async (params = {}) => {
    const response = await api.get("/tickets", {
        params,
    });

    return response.data.data;
};

export const getMyTickets = async (params = {}) => {
    const response = await api.get("/tickets/my", {
        params,
    });

    return response.data.data;
};

export const getTicketById = async (id) => {
    const response = await api.get(`/tickets/${id}`);

    return response.data.data;
};