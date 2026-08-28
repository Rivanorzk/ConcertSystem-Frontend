// services/notificationService.js
import api from "@/lib/api";

export const getNotifications = async (params = {}) => {
    const response = await api.get("/notifications", { params });
    return response.data.data;
};

export const getUnreadCount = async () => {
    const response = await api.get("/notifications/unread-count");
    return response.data.data.unread_count;
};

export const markAsRead = async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data.data;
};

export const markAllAsRead = async () => {
    const response = await api.put("/notifications/read-all");
    return response.data;
};

export const deleteNotification = async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
};

export const deleteAllNotifications = async () => {
    const response = await api.delete("/notifications");
    return response.data;
};