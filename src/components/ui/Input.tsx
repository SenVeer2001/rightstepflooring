
function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string
  value: string
  type?: string
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold text-gray-600">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-gray-400 bg-gray-50 px-3 py-2.5 text-sm
                   focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
      />
    </div>
  )
}

export default Input
