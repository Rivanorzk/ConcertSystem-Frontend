import { Ticket } from "lucide-react";
import EventCard from "./eventCard";

// Kelas Tailwind harus ditulis lengkap (statis) supaya terbaca oleh JIT compiler
const COLUMN_CLASSES = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 2xl:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
};

export default function EventGrid({
  events = [],
  favorites = [],
  onFavorite,
  columns = 3,
}) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-[#D8A7A7]/50 bg-white px-10 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D8A7A7]/15 text-[#7A1F2B]">
          <Ticket size={22} />
        </div>
        <h3 className="font-bold text-[#1E1E1E]">No events found</h3>
        <p className="max-w-sm text-sm text-[#737373]">
          Try another category or search keyword.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`grid gap-x-5 gap-y-8 ${
        COLUMN_CLASSES[columns] || COLUMN_CLASSES[3]
      }`}
    >
      {events.map((event, index) => (
        <EventCard
          key={event.id}
          event={event}
          index={index}
          onFavorite={onFavorite}
          isFavorite={favorites.includes(event.id)}
        />
      ))}
    </div>
  );
}