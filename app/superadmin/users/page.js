"use client";

import { useEffect, useState } from "react";
import {
    Users,
    Search,
    Pencil,
    UserCheck,
    UserX,
} from "lucide-react";

import {
    getUsers,
    updateUserStatus,
} from "@/services/userService";

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("all");
    const [loading, setLoading] = useState(true);

    const loadUsers = async () => {
        try {
            const response = await getUsers();

            setUsers(
                Array.isArray(response)
                    ? response
                    : []
            );
        } catch (error) {
            console.error("Failed to load users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const filteredUsers = users.filter((user) => {
        const searchMatch =
            user.username
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||
            user.email
                ?.toLowerCase()
                .includes(search.toLowerCase());

        const roleMatch =
            role === "all" ||
            user.role === role;

        return searchMatch && roleMatch;
    });

    const handleStatus = async (user) => {
        try {
            const newStatus = user.is_active
                ? false
                : true;

            await updateUserStatus(
                user.id,
                newStatus
            );

            setUsers((current) =>
                current.map((item) =>
                    item.id === user.id
                        ? {
                              ...item,
                              is_active: newStatus,
                          }
                        : item
                )
            );
        } catch (error) {
            console.error(
                "Failed to update user:",
                error
            );

            alert("Failed to update user status.");
        }
    };

    return (
        <main className="min-h-screen bg-[#F8F1E7]">
            <div className="max-w-[1600px] mx-auto px-5 py-6 lg:px-8">

                <div className="mb-7">
                    <p className="text-sm text-[#8C7777]">
                        Management
                    </p>

                    <h1 className="mt-1 text-3xl font-bold text-[#1E1E1E]">
                        Users
                    </h1>

                    <p className="mt-2 text-sm text-[#8C7777]">
                        Manage Eventify users and administrators.
                    </p>
                </div>

                <div className="bg-white border border-[#E5D6D0] rounded-2xl overflow-hidden">

                    <div className="p-5 border-b border-[#E5D6D0] flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A78E8E]" />

                            <input
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Search username or email..."
                                className="w-full rounded-xl border border-[#E5D6D0] bg-[#FCF9F5] py-3 pl-10 pr-4 text-sm outline-none"
                            />
                        </div>

                        <select
                            value={role}
                            onChange={(e) =>
                                setRole(e.target.value)
                            }
                            className="rounded-xl border border-[#E5D6D0] bg-[#FCF9F5] px-4 py-3 text-sm outline-none"
                        >
                            <option value="all">
                                All Roles
                            </option>

                            <option value="customer">
                                Customer
                            </option>

                            <option value="admin">
                                Admin
                            </option>

                            <option value="superadmin">
                                Super Admin
                            </option>
                        </select>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            <thead>
                                <tr className="bg-[#FCF9F5] border-b border-[#E5D6D0]">
                                    <th className="px-5 py-4 text-left text-xs uppercase text-[#8C7777]">
                                        User
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs uppercase text-[#8C7777]">
                                        Phone
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs uppercase text-[#8C7777]">
                                        Role
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs uppercase text-[#8C7777]">
                                        Status
                                    </th>

                                    <th className="px-5 py-4 text-right text-xs uppercase text-[#8C7777]">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#F0E5DE]">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="py-12 text-center text-sm text-[#8C7777]">
                                            Loading users...
                                        </td>
                                    </tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-12 text-center">
                                            <Users className="w-8 h-8 mx-auto text-[#D8A7A7]" />

                                            <p className="mt-3 text-sm text-[#8C7777]">
                                                No users found
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="hover:bg-[#FCF9F5]"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-[#D8A7A7] flex items-center justify-center">
                                                        <Users className="w-5 h-5 text-[#5B0F18]" />
                                                    </div>

                                                    <div>
                                                        <p className="text-sm font-semibold">
                                                            {user.username}
                                                        </p>

                                                        <p className="text-xs text-[#8C7777]">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 text-sm text-[#5F5050]">
                                                {user.phone || "-"}
                                            </td>

                                            <td className="px-5 py-4">
                                                <span className="rounded-full bg-[#F8F1E7] px-3 py-1 text-[11px] font-semibold text-[#7A1F2B] capitalize">
                                                    {user.role}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${
                                                    user.is_active
                                                        ? "bg-green-50 text-green-700"
                                                        : "bg-red-50 text-red-700"
                                                }`}>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                                    {user.is_active
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <button className="w-9 h-9 rounded-lg border border-[#E5D6D0] flex items-center justify-center text-[#7A1F2B]">
                                                        <Pencil className="w-4 h-4" />
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleStatus(
                                                                user
                                                            )
                                                        }
                                                        className={`w-9 h-9 rounded-lg border flex items-center justify-center ${
                                                            user.is_active
                                                                ? "border-red-100 text-red-600"
                                                                : "border-green-100 text-green-600"
                                                        }`}
                                                    >
                                                        {user.is_active ? (
                                                            <UserX className="w-4 h-4" />
                                                        ) : (
                                                            <UserCheck className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}