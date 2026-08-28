export function required(value) {
    return value !== undefined &&
        value !== null &&
        String(value).trim() !== "";
}

export function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function minLength(value, length) {
    return String(value || "").length >= length;
}

export function maxLength(value, length) {
    return String(value || "").length <= length;
}

export function isPositiveNumber(value) {
    return Number(value) > 0;
}