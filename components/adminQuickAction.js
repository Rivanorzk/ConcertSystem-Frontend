import Link from "next/link";
import {
    Plus,
    CalendarPlus,
    Tag,
    TicketPercent,
} from "lucide-react";

export default function AdminQuickAction() {
    const actions = [
        {
            title: "Add Event",
            description: "Create a new event",
            href: "/admin/events/create",
            icon: CalendarPlus,
        },
        {
            title: "Add Category",
            description: "Create event category",
            href: "/admin/categories/create",
            icon: Tag,
        },
        {
            title: "Add Voucher",
            description: "Create promotion",
            href: "/admin/vouchers/create",
            icon: TicketPercent,
        },
    ];

    return (
        <div className="bg-[#5B0F18] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                    <Plus className="w-4 h-4 text-white" />
                </div>

                <div>
                    <h2 className="text-sm font-semibold text-white">
                        Quick Actions
                    </h2>

                    <p className="text-[11px] text-[#D8A7A7]">
                        Manage your platform
                    </p>
                </div>
            </div>

            <div className="space-y-2">
                {actions.map((action) => {
                    const Icon = action.icon;

                    return (
                        <Link
                            key={action.title}
                            href={action.href}
                            className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/15 transition"
                        >
                            <div className="w-9 h-9 rounded-lg bg-[#F8F1E7] flex items-center justify-center">
                                <Icon className="w-4 h-4 text-[#7A1F2B]" />
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-white">
                                    {action.title}
                                </p>

                                <p className="text-[10px] text-[#D8A7A7]">
                                    {action.description}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}