import {
    getToken,
    setToken,
    removeToken,
} from "@/lib/storage";

import roles from "@/constants/roles";

export function isAuthenticated() {
    return Boolean(getToken());
}

export function getUserRole(user) {
    return user?.role || null;
}

export function isCustomer(user) {
    return user?.role === roles.CUSTOMER;
}

export function isAdmin(user) {
    return user?.role === roles.ADMIN;
}

export function isSuperadmin(user) {
    return user?.role === roles.SUPERADMIN;
}

export function saveAuth(token) {
    setToken(token);
}

export function logout() {
    removeToken();
}