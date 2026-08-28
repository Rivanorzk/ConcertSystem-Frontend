// components/NotificationFilters.js
export default function NotificationFilters({ 
    activeFilter, 
    onFilterChange,
    unreadCount,
    onMarkAllRead,
    onClearAll
}) {
    const filters = [
        { value: 'all', label: 'All' },
        { value: 'unread', label: `Unread (${unreadCount})` },
        { value: 'order', label: 'Orders' },
        { value: 'payment', label: 'Payments' },
        { value: 'event', label: 'Events' },
        { value: 'promo', label: 'Promos' }
    ];

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                    <button
                        key={filter.value}
                        onClick={() => onFilterChange(filter.value)}
                        className={`
                            px-4 py-2 rounded-xl text-sm font-medium transition
                            ${activeFilter === filter.value
                                ? 'bg-[#5B0F18] text-[#F8F1E7]'
                                : 'bg-white text-[#5B0F18] border border-[#E5D6D0] hover:border-[#D8A7A7]'
                            }
                        `}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            <div className="flex gap-2">
                {unreadCount > 0 && (
                    <button
                        onClick={onMarkAllRead}
                        className="px-4 py-2 text-sm font-medium text-[#7A1F2B] hover:bg-[#F8F1E7] rounded-xl transition"
                    >
                        Mark all as read
                    </button>
                )}
                <button
                    onClick={onClearAll}
                    className="px-4 py-2 text-sm font-medium text-[#A68C8C] hover:text-[#7A1F2B] hover:bg-[#F8F1E7] rounded-xl transition"
                >
                    Clear all
                </button>
            </div>
        </div>
    );
}