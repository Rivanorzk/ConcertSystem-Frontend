import { Search } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search events...",
}) {
  return (
    <div className="relative w-full">

      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A68C8C]" />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 rounded-xl bg-white border border-[#E5D6D0] pl-12 pr-4 text-sm text-[#1E1E1E] outline-none transition placeholder:text-[#A68C8C] focus:border-[#7A1F2B] focus:ring-4 focus:ring-[#7A1F2B]/10"
      />

    </div>
  );
}