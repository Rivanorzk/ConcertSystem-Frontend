export default function LoadingSpinner({
  text = "Loading...",
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16">

      <div className="w-8 h-8 rounded-full border-2 border-[#D8A7A7] border-t-[#5B0F18] animate-spin" />

      <p className="mt-3 text-sm text-[#737373]">
        {text}
      </p>

    </div>
  );
}