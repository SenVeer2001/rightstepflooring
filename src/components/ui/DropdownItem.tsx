function DropdownItem({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ElementType
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 text-left"
    >
      <Icon size={18} className="text-primary" />
      <span>{label}</span>
    </button>
  )
}
export default DropdownItem;