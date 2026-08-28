import Link from "next/link";
import { Heart, CalendarDays, MapPin, Flame } from "lucide-react";
import { currency } from "@/lib/formatter";

/* Perforasi tiket — elemen tanda tangan yang sama seperti di landing page */
function TicketNotch({ side }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-[#FDFAF3] ${
        side === "left" ? "-left-2.5" : "-right-2.5"
      }`}
    />
  );
}

export default function EventCard({
  event,
  onFavorite,
  isFavorite = false,
  index = 0,
}) {
  const isAlmostSoldOut =
    typeof event.sold_percent === "number" && event.sold_percent >= 75;

  return (
    <article
      style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
      className="animate-card-in group relative flex flex-col overflow-hidden rounded-3xl border border-[#D8A7A7]/30 bg-[#FDFAF3] transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#5B0F18]/10"
    >
      {/* IMAGE */}
      <Link href={`/customer/event/${event.id}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={event.poster}
            alt={event.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />

          {event.category && (
            <span className="absolute left-4 top-4 rounded-full bg-[#F8F1E7]/95 px-3 py-1.5 text-xs font-bold text-[#5B0F18] backdrop-blur">
              {event.category}
            </span>
          )}

          {event.trending && (
            <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-[#D4A537] px-3 py-1.5 text-xs font-bold text-[#5B0F18]">
              <Flame size={13} />
              Trending
            </span>
          )}
        </div>
      </Link>

      {/* WISHLIST */}
      <button
        type="button"
        onClick={() => onFavorite?.(event)}
        aria-label={isFavorite ? "Hapus dari tersimpan" : "Simpan event"}
        className="absolute right-4 top-[38%] z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#5B0F18] shadow-md transition hover:scale-110"
      >
        <Heart
          className={`h-4 w-4 ${
            isFavorite ? "fill-[#7A1F2B] text-[#7A1F2B]" : "text-[#7A1F2B]"
          }`}
        />
      </button>

      {/* PERFORASI TIKET */}
      <div className="relative mx-5 border-t border-dashed border-[#D8A7A7]/60">
        <TicketNotch side="left" />
        <TicketNotch side="right" />
      </div>

      {/* CONTENT */}
      <Link href={`/customer/event/${event.id}`} className="flex flex-1 flex-col p-5 pt-4">
        <h3 className="line-clamp-1 text-base font-bold tracking-tight text-[#1E1E1E]">
          {event.title}
        </h3>

        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-xs text-[#737373]">
            <CalendarDays className="h-4 w-4 shrink-0 text-[#7A1F2B]" />
            <span>{event.event_date}</span>
            <span>•</span>
            <span>{event.start_time}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#737373]">
            <MapPin className="h-4 w-4 shrink-0 text-[#7A1F2B]" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        {isAlmostSoldOut && (
          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1 text-[#7A1F2B]">
                <Flame size={12} />
                Tiket hampir habis
              </span>
              <span className="text-black/40">{event.sold_percent}% terjual</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#D8A7A7]/25">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#D4A537] to-[#7A1F2B] transition-all duration-700"
                style={{ width: `${event.sold_percent}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-[#F0E5DE] pt-4 mt-6">
          <div className="min-w-0">
            <p className="text-[11px] text-[#A68C8C]">Mulai dari</p>
            <p className="mt-1 text-lg font-black text-[#5B0F18]">
              {event.price ? currency(event.price) : "Free"}
            </p>
          </div>

          <span className="shrink-0 rounded-xl bg-[#5B0F18] px-4 py-2.5 text-xs font-bold text-[#F8F1E7] transition group-hover:bg-[#7A1F2B]">
            Detail
          </span>
        </div>
      </Link>

      <style jsx>{`
        @keyframes cardIn {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-card-in {
          opacity: 0;
          animation: cardIn 0.55s ease-out forwards;
        }
      `}</style>
    </article>
  );
}