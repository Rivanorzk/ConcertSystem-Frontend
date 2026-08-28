export default function AuthInput({
  id,
  name,
  type = "text",
  label,
  placeholder,
  icon: Icon,
  value,
  onChange,
  required = true,
  autoComplete,
  rightElement,
  disabled = false,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-[#1E1E1E] mb-1.5"
      >
        {label}
      </label>

      <div className="relative">

        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D8A7A7]" />
        )}

        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`w-full h-12 rounded-xl border border-[#E5D6D0] bg-[#F8F1E7]/40 ${
            Icon ? "pl-11" : "pl-4"
          } ${
            rightElement ? "pr-12" : "pr-4"
          } text-sm text-[#1E1E1E] outline-none transition placeholder:text-[#A68C8C] focus:border-[#7A1F2B] focus:bg-white focus:ring-4 focus:ring-[#7A1F2B]/10 disabled:opacity-60 disabled:cursor-not-allowed`}
        />

        {rightElement && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}

      </div>
    </div>
  );
}