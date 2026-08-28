import api from "@/lib/api";

export const getCategories = async () => {
    try {
        const response = await api.get("/categories");
        
        // Debug
        console.log('Categories API response:', response.data);
        
        // Pastikan mengembalikan array
        const categories = response.data?.data || response.data || [];
        
        if (!Array.isArray(categories)) {
            console.error('Categories is not an array:', categories);
            return [];
        }
        
        // Pastikan setiap kategori memiliki id yang valid
        return categories.map(cat => ({
            ...cat,
            id: Number(cat.id) // Konversi ke number
        }));
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
};

// Service lainnya tetap sama
export const getCategoryById = async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data.data;
};

export const createCategory = async (data) => {
    const response = await api.post("/categories", data);
    return response.data.data;
};

export const updateCategory = async (id, data) => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data.data;
};

export const deleteCategory = async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data.data;
};