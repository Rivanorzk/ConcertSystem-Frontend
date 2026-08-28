import api from "@/lib/api";

export const getEvents = async (params = {}) => {
    const response = await api.get("/events", {
        params,
    });

    return response.data.data;
};

export const getEventById = async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data.data;
};

export const createEvent = async (formData) => {
    const response = await api.post("/events", formData);
    return response.data.data;
};

export const updateEvent = async (id, formData) => {
    const response = await api.put(
        `/events/${id}`,
        formData
    );

    return response.data.data;
};

export const deleteEvent = async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data.data;
};