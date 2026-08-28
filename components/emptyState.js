import { SearchX } from "lucide-react";

export default function EmptyState({
  title = "No data found",
  description = "There is nothing to show here yet.",
}) {
  return (
    <div className="bg-white border border-[#E5D6D0] rounded-2xl p-10 text-center">

      <div className="w-12 h-12 mx-auto rounded-xl bg-[#F8F1E7] flex items-center justify-center">
        <SearchX className="w-6 h-6 text-[#7A1F2B]" />
      </div>

      <h3 className="mt-4 font-bold text-[#1E1E1E]">
        {title}
      </h3>

      <p className="mt-1 text-sm text-[#737373]">
        {description}
      </p>

    </div>
  );
}