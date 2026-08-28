import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

export default function QuickAction({
  title = "Looking for something?",
  description = "Explore all available events and find something perfect for you.",
  href = "/customer/event",
  action = "Explore now",
}) {
  return (
    <div className="p-5 rounded-2xl border border-[#E5D6D0] bg-white text-black">

      <div className="w-10 h-10 rounded-xl bg-[#F8F1E7] flex items-center justify-center">
        <Compass className="w-5 h-5 text-[#7A1F2B]" />
      </div>

      <h3 className="mt-4 font-bold">
        {title}
      </h3>

      <p className="mt-1 text-xs text-[#737373] leading-relaxed">
        {description}
      </p>

      <Link
        href={href}
        className="inline-flex items-center gap-1 mt-4 text-xs font-semibold text-[#7A1F2B]"
      >
        {action}
        <ArrowRight className="w-4 h-4" />
      </Link>

    </div>
  );
}