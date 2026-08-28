import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function SectionHeader({
  title,
  description,
  href,
  action = "See all",
}) {
  return (
    <div className="flex items-center justify-between mb-5 text-black">

      <div>
        <h2 className="text-xl font-bold">
          {title}
        </h2>

        {description && (
          <p className="text-sm text-[#737373] mt-1">
            {description}
          </p>
        )}
      </div>

      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-sm font-semibold text-[#7A1F2B] hover:text-[#5B0F18]"
        >
          {action}
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}

    </div>
  );
}