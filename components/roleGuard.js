"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import useAuth from "@/hooks/useAuth";

const DASHBOARD_BY_ROLE = {
  customer: "/customer/dashboard",
  admin: "/admin/dashboard",
  superadmin: "/superadmin/dashboard",
};

export default function RoleGuard({ allow, children }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  const role = user?.role?.toLowerCase();
  const allowed = role ? allow.includes(role) : false;

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!allowed) {
      router.replace(DASHBOARD_BY_ROLE[role] || "/login");
    }
  }, [user, loading, allowed, role, router]);

  if (loading || !user || !allowed) {
    return (
      <main className="min-h-screen bg-[#F8F1E7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#D8A7A7] border-t-[#5B0F18] animate-spin" />
          <p className="text-sm text-[#7A1F2B]">Checking access...</p>
        </div>
      </main>
    );
  }

  return children;
}
