"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

import { getMe } from "@/services/authService";

import {
    getToken,
    removeToken,
    setToken,
} from "@/lib/storage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        const token = getToken();

        if (!token) {
            setUser(null);
            setLoading(false);
            return null;
        }

        try {
            const response = await getMe();

            const userData =
                response?.data?.data ||
                response?.data ||
                null;

            if (!userData) {
                throw new Error(
                    "Data user tidak ditemukan."
                );
            }

            setUser(userData);

            return userData;
        } catch (error) {
            console.error(
                "Auth verification failed:",
                error
            );

            removeToken();
            setUser(null);

            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = async (
        token,
        userData = null
    ) => {
        setToken(token);

        if (userData) {
            setUser(userData);
            setLoading(false);

            return userData;
        }

        return await fetchUser();
    };

    const logout = () => {
        removeToken();
        setUser(null);
        setLoading(false);
    };

    const refreshUser = async () => {
        setLoading(true);

        return await fetchUser();
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated:
                    Boolean(user),
                login,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}