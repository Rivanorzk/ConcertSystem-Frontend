// services/userService.js
import api from "@/lib/api";

// ================================
// ADMIN / SUPERADMIN
// ================================

export const getUsers = async (params = {}) => {
    const response = await api.get("/users", { params });
    return response.data.data;
};

export const getUserById = async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
};

export const createUser = async (data) => {
    const response = await api.post("/users", data);
    return response.data.data;
};

export const updateUser = async (id, data) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data.data;
};

export const updateUserRole = async (id, role) => {
    const response = await api.patch(`/users/${id}/role`, { role });
    return response.data.data;
};

export const updateUserStatus = async (id, isActive) => {
    const response = await api.patch(`/users/${id}/status`, { is_active: isActive });
    return response.data.data;
};

export const deleteUser = async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data.data;
};

// ================================
// PROFILE (CURRENT USER)
// ================================

export const getProfile = async () => {
    const response = await api.get("/users/me");
    return response.data.data;
};

export const updateProfile = async (data) => {
    const response = await api.put("/users/me", data);
    return response.data.data;
};

export const changePassword = async (data) => {
    const response = await api.put("/users/me/password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
    });
    return response.data.data;
};

export const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await api.post("/users/me/avatar", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data.data; 
};