import { Tag, Copy, Check } from "lucide-react";

export default function VoucherCard({
  voucher,
  copied = false,
  onCopy,
}) {
  return (
    <div className="relative bg-white border border-[#E5D6D0] rounded-2xl p-5 overflow-hidden">

      <div className="flex items-start justify-between gap-4">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-[#F8F1E7] flex items-center justify-center">
            <Tag className="w-5 h-5 text-[#7A1F2B]" />
          </div>

          <div>
            <h3 className="font-bold text-[#5B0F18]">
              {voucher.title}
            </h3>

            <p className="text-xs text-[#737373] mt-1">
              {voucher.description}
            </p>
          </div>

        </div>

        <span className="text-lg font-bold text-[#5B0F18]">
          {voucher.discount}
        </span>

      </div>

      <div className="flex items-center justify-between mt-5 p-3 rounded-xl bg-[#F8F1E7]">

        <code className="text-sm font-bold tracking-wider text-[#5B0F18]">
          {voucher.code}
        </code>

        <button
          type="button"
          onClick={() => onCopy?.(voucher.code)}
          className="flex items-center gap-2 text-xs font-semibold text-[#7A1F2B]"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </button>

      </div>

    </div>
  );
}