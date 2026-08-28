"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Search,
    ShoppingBag,
    Eye,
} from "lucide-react";

import { getOrders } from "@/services/orderService";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [loading, setLoading] = useState(true);

    const loadOrders = async () => {
        try {
            const response = await getOrders();

            setOrders(
                Array.isArray(response)
                    ? response
                    : response?.data || []
            );
        } catch (error) {
            console.error("Failed to load orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const filteredOrders = orders.filter((order) => {
        const keyword = search.toLowerCase();

        const matchesSearch =
            order.invoice_number
                ?.toLowerCase()
                .includes(keyword) ||
            order.username
                ?.toLowerCase()
                .includes(keyword) ||
            order.event_title
                ?.toLowerCase()
                .includes(keyword);

        const matchesStatus =
            status === "all" ||
            order.status?.toLowerCase() === status;

        return matchesSearch && matchesStatus;
    });

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(value || 0);
    };

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getStatusStyle = (orderStatus) => {
        switch (orderStatus?.toLowerCase()) {
            case "paid":
                return "bg-green-50 text-green-700 border-green-200";

            case "pending":
                return "bg-yellow-50 text-yellow-700 border-yellow-200";

            case "expired":
                return "bg-gray-100 text-gray-600 border-gray-200";

            case "cancelled":
                return "bg-red-50 text-red-600 border-red-200";

            default:
                return "bg-gray-50 text-gray-600 border-gray-200";
        }
    };

    return (
        <main className="min-h-screen bg-[#F8F1E7]">
            <div className="max-w-[1600px] mx-auto px-5 py-6 lg:px-8">

                {/* HEADER */}
                <div className="mb-7">
                    <p className="text-sm text-[#8C7777]">
                        Management
                    </p>

                    <h1 className="mt-1 text-3xl font-bold text-[#1E1E1E]">
                        Orders
                    </h1>

                    <p className="mt-2 text-sm text-[#8C7777]">
                        Manage customer orders and payments.
                    </p>
                </div>

                {/* CARD */}
                <div className="bg-white border border-[#E5D6D0] rounded-2xl overflow-hidden text-black">

                    {/* FILTER */}
                    <div className="p-5 border-b border-[#E5D6D0]">
                        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">

                            {/* SEARCH */}
                            <div className="relative max-w-md w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7777]" />

                                <input
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    placeholder="Search invoice, customer, event..."
                                    className="w-full rounded-xl border border-[#E5D6D0] bg-[#FCF9F5] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#7A1F2B]"
                                />
                            </div>

                            {/* STATUS */}
                            <select
                                value={status}
                                onChange={(e) =>
                                    setStatus(e.target.value)
                                }
                                className="rounded-xl border border-[#E5D6D0] bg-[#FCF9F5] px-4 py-3 text-sm outline-none focus:border-[#7A1F2B]"
                            >
                                <option value="all">
                                    All Status
                                </option>

                                <option value="pending">
                                    Pending
                                </option>

                                <option value="paid">
                                    Paid
                                </option>

                                <option value="expired">
                                    Expired
                                </option>

                                <option value="cancelled">
                                    Cancelled
                                </option>
                            </select>

                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="w-full overflow-hidden">
                        <table className="w-full table-fixed">

                            <thead>
                                <tr className="bg-[#FCF9F5] border-b border-[#E5D6D0]">

                                    <th className="w-[5%] px-4 py-4 text-left text-xs uppercase tracking-wide text-[#8C7777]">
                                        #
                                    </th>

                                    <th className="w-[16%] px-4 py-4 text-left text-xs uppercase tracking-wide text-[#8C7777]">
                                        Invoice
                                    </th>

                                    <th className="w-[14%] px-4 py-4 text-left text-xs uppercase tracking-wide text-[#8C7777]">
                                        Customer
                                    </th>

                                    <th className="w-[20%] px-4 py-4 text-left text-xs uppercase tracking-wide text-[#8C7777]">
                                        Event
                                    </th>

                                    <th className="w-[13%] px-4 py-4 text-left text-xs uppercase tracking-wide text-[#8C7777]">
                                        Total
                                    </th>

                                    <th className="w-[12%] px-4 py-4 text-left text-xs uppercase tracking-wide text-[#8C7777]">
                                        Status
                                    </th>

                                    <th className="w-[12%] px-4 py-4 text-left text-xs uppercase tracking-wide text-[#8C7777]">
                                        Date
                                    </th>

                                    <th className="w-[8%] px-4 py-4 text-right text-xs uppercase tracking-wide text-[#8C7777]">
                                        Action
                                    </th>

                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#F0E5DE]">

                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="py-12 text-center text-sm text-[#8C7777]"
                                        >
                                            Loading orders...
                                        </td>
                                    </tr>
                                ) : filteredOrders.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="py-12 text-center"
                                        >
                                            <ShoppingBag className="w-8 h-8 mx-auto text-[#D8A7A7]" />

                                            <p className="mt-3 text-sm text-[#8C7777]">
                                                No orders found
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order, index) => (
                                        <tr
                                            key={order.id}
                                            className="hover:bg-[#FCF9F5]"
                                        >

                                            <td className="px-4 py-4 text-sm text-[#8C7777]">
                                                {index + 1}
                                            </td>

                                            <td className="px-4 py-4">
                                                <p className="text-sm font-semibold truncate">
                                                    {order.invoice_number || `#${order.id}`}
                                                </p>
                                            </td>

                                            <td className="px-4 py-4">
                                                <p className="text-sm font-semibold truncate">
                                                    {order.username || "-"}
                                                </p>
                                            </td>

                                            <td className="px-4 py-4">
                                                <p className="text-sm text-[#5F5050] truncate">
                                                    {order.event_title || "-"}
                                                </p>
                                            </td>

                                            <td className="px-4 py-4">
                                                <p className="text-sm font-semibold text-[#5B0F18] whitespace-nowrap">
                                                    {formatCurrency(order.final_price)}
                                                </p>
                                            </td>

                                            <td className="px-4 py-4">
                                                <span
                                                    className={`inline-flex max-w-full items-center px-2.5 py-1.5 rounded-full border text-xs font-semibold capitalize truncate ${getStatusStyle(
                                                        order.status
                                                    )}`}
                                                >
                                                    {order.status}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4 text-sm text-[#8C7777] whitespace-nowrap">
                                                {formatDate(order.created_at)}
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="flex justify-end">
                                                    <Link
                                                        href={`/admin/orders/${order.id}`}
                                                        className="w-9 h-9 shrink-0 rounded-lg border border-[#E5D6D0] flex items-center justify-center text-[#7A1F2B] hover:bg-[#F8F1E7]"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
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