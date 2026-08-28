// lib/formatter.js

export function currency(value) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(Number(value) || 0);
}

export function number(value) {
    return new Intl.NumberFormat("id-ID").format(
        Number(value) || 0
    );
}

export function formatDate(value) {
    if (!value) return "-";

    return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(value));
}

export function formatDateTime(value) {
    if (!value) return "-";

    return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}

// ✅ PERBAIKAN: formatTime untuk string waktu seperti "19:00:00" atau "19:00"
export function formatTime(value) {
    if (!value) return "-";

    // Jika value sudah berupa waktu (HH:mm:ss atau HH:mm)
    // Kita parsing manual tanpa new Date()
    const parts = value.split(':');
    if (parts.length >= 2) {
        const hours = parts[0].padStart(2, '0');
        const minutes = parts[1].padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    // Fallback: coba parse dengan Date (untuk format lain)
    try {
        const date = new Date(value);
        if (isNaN(date.getTime())) return "-";
        return new Intl.DateTimeFormat("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    } catch {
        return "-";
    }
}

export function capitalize(value) {
    if (!value) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
}