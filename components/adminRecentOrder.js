import Link from "next/link";
import {
    ShoppingBag,
    User,
    ArrowRight,
} from "lucide-react";

export default function AdminRecentOrder({
    orders = [],
}) {
    return (
        <div className="bg-white border border-[#E5D6D0] rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E5D6D0] flex items-center justify-between">
                <div>
                    <h2 className="font-semibold text-[#1E1E1E]">
                        Recent Orders
                    </h2>

                    <p className="text-xs text-[#8C7777] mt-0.5">
                        Latest customer orders
                    </p>
                </div>

                <Link
                    href="/admin/orders"
                    className="flex items-center gap-1 text-xs font-semibold text-[#7A1F2B] hover:text-[#5B0F18]"
                >
                    View all
                    <ArrowRight className="w-3 h-3" />
                </Link>
            </div>

            <div className="divide-y divide-[#F0E5DE]">
                {orders.length === 0 ? (
                    <div className="px-5 py-10 text-center">
                        <ShoppingBag className="w-8 h-8 mx-auto text-[#D8A7A7]" />

                        <p className="mt-3 text-sm text-[#8C7777]">
                            No orders yet
                        </p>
                    </div>
                ) : (
                    orders.slice(0, 5).map((order) => (
                        <Link
                            key={order.id}
                            href={`/admin/orders/${order.id}`}
                            className="flex items-center gap-3 px-5 py-4 hover:bg-[#F8F1E7]/60 transition"
                        >
                            <div className="w-10 h-10 rounded-xl bg-[#F8F1E7] flex items-center justify-center shrink-0">
                                <ShoppingBag className="w-4 h-4 text-[#7A1F2B]" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-[#1E1E1E] truncate">
                                    {order.invoice_number ||
                                        `Order #${order.id}`}
                                </p>

                                <p className="mt-1 flex items-center gap-1 text-[11px] text-[#8C7777]">
                                    <User className="w-3 h-3" />

                                    {order.username || "Customer"}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="text-xs font-semibold text-[#1E1E1E]">
                                    Rp{" "}
                                    {Number(
                                        order.final_price || 0
                                    ).toLocaleString("id-ID")}
                                </p>

                                <span
                                    className={`text-[10px] font-semibold ${
                                        order.status === "paid"
                                            ? "text-[#287A43]"
                                            : order.status === "cancelled"
                                            ? "text-[#A32D2D]"
                                            : "text-[#7A1F2B]"
                                    }`}
                                >
                                    {order.status || "pending"}
                                </span>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}