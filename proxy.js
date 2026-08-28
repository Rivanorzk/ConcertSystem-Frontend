// proxy.js - Root project (sejajar dengan next.config.js)
import { NextResponse } from "next/server";

// ============================================================
// KONFIGURASI
// ============================================================

const SECTION_PREFIXES = [
  { role: "customer", prefix: "/customer" },
  { role: "admin", prefix: "/admin" },
  { role: "superadmin", prefix: "/superadmin" },
];

const AUTH_PAGES = ["/login", "/register"];

// ============================================================
// FUNGSI BANTUAN
// ============================================================

function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    const decoded = JSON.parse(json);

    // Cek expired (exp dalam detik, Date.now() dalam ms)
    if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

function dashboardFor(role) {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "superadmin":
      return "/superadmin/dashboard";
    default:
      return "/customer/dashboard";
  }
}

function isAuthPage(pathname) {
  return AUTH_PAGES.some(
    (page) => pathname === page || pathname.startsWith(`${page}/`)
  );
}

function getSection(pathname) {
  return SECTION_PREFIXES.find(
    ({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

// ============================================================
// PROXY FUNCTION (NAMED EXPORT - WAJIB!)
// ============================================================

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const rawToken = request.cookies.get("token")?.value || null;
  const decoded = rawToken ? decodeToken(rawToken) : null;
  const role = decoded?.role || null;

  // ===== DEBUG (hapus di production) =====
  console.log("📍 Path:", pathname);
  console.log("🔑 Token exists:", !!rawToken);
  console.log("👤 Role:", role);
  console.log("📦 Decoded:", decoded ? { ...decoded, password: undefined } : null);

  // ==========================================================
  // 1. HALAMAN LOGIN / REGISTER
  // ==========================================================
  if (isAuthPage(pathname)) {
    // Jika sudah login, redirect ke dashboard sesuai role
    if (rawToken && role) {
      return NextResponse.redirect(new URL(dashboardFor(role), request.url));
    }

    const response = NextResponse.next();

    // Jika token expired/stale, hapus cookie
    if (rawToken && !decoded) {
      response.cookies.delete("token");
    }

    return response;
  }

  // ==========================================================
  // 2. HALAMAN YANG DILINDUNGI (customer, admin, superadmin)
  // ==========================================================
  const section = getSection(pathname);

  if (section) {
    // === 2a. Belum login ===
    if (!rawToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);

      const response = NextResponse.redirect(loginUrl);

      // Hapus cookie stale jika ada
      if (rawToken && !decoded) {
        response.cookies.delete("token");
      }

      return response;
    }

    // === 2b. Token expired/invalid ===
    if (!decoded) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);

      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("token");

      return response;
    }

    // === 2c. Role tidak sesuai dengan section ===
    if (role !== section.role) {
      // Jika role tidak dikenal, redirect ke login
      if (!role) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Redirect ke dashboard sesuai role
      return NextResponse.redirect(new URL(dashboardFor(role), request.url));
    }

    // === 2d. Akses DITERIMA ===
    return NextResponse.next();
  }

  // ==========================================================
  // 3. HALAMAN LAINNYA (public)
  // ==========================================================
  return NextResponse.next();
}

// ============================================================
// CONFIG MATCHER
// ============================================================

export const config = {
  matcher: [
    "/customer/:path*",
    "/admin/:path*",
    "/superadmin/:path*",
    "/login",
    "/register",
  ],
};