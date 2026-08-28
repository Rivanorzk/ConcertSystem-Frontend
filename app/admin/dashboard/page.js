"use client";

import { useEffect, useState } from "react";

import AdminStatCard from "@/components/adminStatCard";
import AdminRecentOrder from "@/components/adminRecentOrder";
import AdminRecentEvent from "@/components/adminRecentEvent";
import AdminQuickAction from "@/components/adminQuickAction";

import { getEvents } from "@/services/eventService";
import { getCategories } from "@/services/categoryService";
import { getOrders } from "@/services/orderService";

export default function AdminDashboardPage() {
    const [events, setEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const [
                    eventsResponse,
                    categoriesResponse,
                    ordersResponse,
                ] = await Promise.all([
                    getEvents(),
                    getCategories(),
                    getOrders(),
                ]);

                setEvents(eventsResponse || []);
                setCategories(categoriesResponse || []);
                setOrders(ordersResponse || []);
            } catch (error) {
                console.error(
                    "Failed to load admin dashboard:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const customerIds = new Set(
        orders
            .map((order) => order.customer_id)
            .filter(Boolean)
    );

    const paidOrders = orders.filter(
        (order) => order.status === "paid"
    );

    return (
        <main className="min-h-screen bg-[#F8F1E7]">
            <div className="max-w-[1600px] mx-auto px-5 py-6 lg:px-8">
                <div className="mb-7">
                    <p className="text-sm text-[#8C7777]">
                        Overview
                    </p>

                    <h1 className="mt-1 text-3xl font-bold text-[#1E1E1E]">
                        Admin Dashboard
                    </h1>

                    <p className="mt-2 text-sm text-[#8C7777]">
                        Manage events, orders, customers and
                        promotions from one place.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <AdminStatCard
                        title="Total Events"
                        value={
                            loading
                                ? "—"
                                : events.length
                        }
                        description="All events"
                        type="events"
                    />

                    <AdminStatCard
                        title="Total Orders"
                        value={
                            loading
                                ? "—"
                                : orders.length
                        }
                        description={`${paidOrders.length} paid orders`}
                        type="orders"
                    />

                    <AdminStatCard
                        title="Customers"
                        value={
                            loading
                                ? "—"
                                : customerIds.size
                        }
                        description="Unique customers"
                        type="customers"
                    />

                    <AdminStatCard
                        title="Categories"
                        value={
                            loading
                                ? "—"
                                : categories.length
                        }
                        description="event categories"
                        type="categories"
                    />
                </div>

                <div className="grid xl:grid-cols-[1fr_380px] gap-6 mt-6">
                    <AdminRecentOrder orders={orders} />

                    <AdminQuickAction />
                </div>

                <div className="mt-6">
                    <AdminRecentEvent events={events} />
                </div>
            </div>
        </main>
    );
}