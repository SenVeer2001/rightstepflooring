function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold text-gray-600">
        {label}
      </label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm
                   focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
      >
        {children}
      </select>
    </div>
  )
}


export default Select