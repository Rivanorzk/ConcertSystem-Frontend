import api from "@/lib/api";

export const login = async (data) => {
    const response = await api.post(
        "/auth/login",
        data
    );

    return response.data;
};

export const register = async (data) => {
    const response = await api.post(
        "/auth/register",
        data
    );

    return response.data;
};

export const getMe = async () => {
    const response = await api.get(
        "/users/me"
    );

    return response.data;
};

export const logout = async () => {
    try {
        await api.post("/auth/logout");
    } catch (error) {
        console.error(
            "Logout API failed:",
            error
        );
    }
};