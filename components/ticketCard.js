import Link from "next/link";
import {
  Ticket,
  CalendarDays,
  Clock3,
  ArrowRight,
} from "lucide-react";

export default function TicketCard({ ticket }) {
  return (
    <div className="relative bg-[#5B0F18] rounded-2xl p-5 text-[#F8F1E7] overflow-hidden">

      <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-[#7A1F2B]" />

      <div className="relative z-10">

        <div className="flex items-center justify-between">

          <div className="w-10 h-10 rounded-xl bg-[#F8F1E7]/10 flex items-center justify-center">
            <Ticket className="w-5 h-5" />
          </div>

          <span className="text-xs text-[#D8A7A7]">
            {ticket.status || "Confirmed"}
          </span>

        </div>

        <h3 className="mt-4 font-semibold text-sm leading-5">
          {ticket.title}
        </h3>

        <div className="flex items-center gap-2 mt-3 text-xs text-[#D8A7A7]">
          <CalendarDays className="w-4 h-4" />
          {ticket.date}
        </div>

        <div className="flex items-center gap-2 mt-2 text-xs text-[#D8A7A7]">
          <Clock3 className="w-4 h-4" />
          Ticket #{ticket.ticket}
        </div>

        <Link
          href={`/customer/tickets/${ticket.id || ""}`}
          className="flex items-center justify-center gap-2 mt-5 h-10 rounded-lg bg-[#F8F1E7] text-[#5B0F18] text-xs font-semibold hover:bg-white transition"
        >
          View ticket
          <ArrowRight className="w-4 h-4" />
        </Link>

      </div>
    </div>
  );
}