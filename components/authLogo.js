import Link from "next/link";
import { CalendarDays } from "lucide-react";

export default function AuthLogo({
  dark = false,
}) {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-3"
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center ${
          dark
            ? "bg-[#F8F1E7]"
            : "bg-[#5B0F18]"
        }`}
      >
        <CalendarDays
          className={`w-6 h-6 ${
            dark
              ? "text-[#5B0F18]"
              : "text-[#F8F1E7]"
          }`}
        />
      </div>

      <span
        className={`text-2xl font-bold tracking-tight ${
          dark
            ? "text-[#F8F1E7]"
            : "text-[#1E1E1E]"
        }`}
      >
        Eventify
      </span>
    </Link>
  );
}