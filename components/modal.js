import { X } from "lucide-react";

export default function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
}) {
  if (!open) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-5"
      onClick={onClose}
    >

      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${sizes[size]} bg-white rounded-2xl shadow-2xl overflow-hidden`}
      >

        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5D6D0]">

          <h2 className="font-bold text-[#1E1E1E]">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg hover:bg-[#F8F1E7] flex items-center justify-center"
          >
            <X className="w-5 h-5 text-[#5B0F18]" />
          </button>

        </div>

        <div className="p-5">
          {children}
        </div>

      </div>

    </div>
  );
}