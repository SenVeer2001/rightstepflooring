interface StatusBadgeProps {
  status: 'Draft' | 'Published' | 'Live'
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const baseClasses = 'font-semibold rounded-full'
  
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
  }

  const statusStyles = {
    Draft: 'bg-gray-100 text-gray-700',
    Published: 'bg-green-100 text-green-700',
    Live: 'bg-blue-100 text-blue-700',
  }

  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${statusStyles[status]}`}>
      {status}
    </span>
  )
}
