import api from "@/lib/api";

export const getVouchers = async (params = {}) => {
    const response = await api.get("/vouchers", {
        params,
    });

    return response.data.data;
};

export const getVoucherById = async (id) => {
    const response = await api.get(`/vouchers/${id}`);
    return response.data.data;
};

export const getVoucherByCode = async (code) => {
    const response = await api.get(`/vouchers/${code}`);
    return response.data.data;
};

export const createVoucher = async (data) => {
    const response = await api.post("/vouchers", data);
    return response.data.data;
};

export const updateVoucher = async (id, data) => {
    const response = await api.put(`/vouchers/${id}`, data);
    return response.data.data;
};

export const deleteVoucher = async (id) => {
    const response = await api.delete(`/vouchers/${id}`);
    return response.data.data;
};

export const validateVoucher = async (code, data = {}) => {
    const response = await api.post("/vouchers/validate", {
        code,
        ...data,
    });

    return response.data.data;
};