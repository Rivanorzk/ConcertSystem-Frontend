import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function DashboardHero() {
  return (
    <section className="relative overflow-hidden rounded-[28px] bg-[#5B0F18] p-7 sm:p-9 lg:p-10 text-[#F8F1E7]">

      <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-[#7A1F2B]" />

      <div className="absolute -bottom-36 right-20 w-80 h-80 rounded-full bg-[#7A1F2B]/70" />

      <div className="relative z-10 max-w-2xl">

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D8A7A7]/15 border border-[#D8A7A7]/20 text-sm">
          <Sparkles className="w-4 h-4" />
          Discover something amazing
        </div>

        <h1 className="mt-5 text-3xl sm:text-4xl xl:text-5xl font-bold leading-tight">
          Find your next
          <br />
          unforgettable event.
        </h1>

        <p className="mt-4 text-[#D8A7A7] max-w-xl leading-relaxed">
          Jelajahi berbagai event menarik dan temukan pengalaman
          yang cocok untukmu.
        </p>

        <Link
          href="/customer/event"
          className="inline-flex items-center gap-2 mt-6 px-5 py-3 rounded-xl bg-[#F8F1E7] text-[#5B0F18] font-semibold text-sm hover:bg-white transition"
        >
          Explore events
          <ArrowRight className="w-4 h-4" />
        </Link>

      </div>

    </section>
  );
}