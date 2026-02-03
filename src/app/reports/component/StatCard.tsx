import React from "react"

interface StatCardProps {
  label: string
  value: string
  unit?: string
  icon: React.ReactNode
  className?: string
}

export function StatCard({
  label,
  value,
  unit,
  icon,
  className = "",
}: StatCardProps) {
  return (
    <div
      className={`
        relative overflow-hidden
        rounded-xl border border-white/40
        bg-white/60 backdrop-blur-lg
        p-5 shadow-sm
        transition-all duration-200
        hover:shadow-md hover:bg-white/70
        ${className}
      `}
    >
      <div className="flex items-start justify-between gap-4">

        {/* TEXT */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {label}
          </p>

          <div className="mt-2 flex items-end gap-1">
            <span className="text-3xl font-bold text-gray-900 leading-none">
              {value}
            </span>
            {unit && (
              <span className="text-sm font-medium text-gray-500 pb-0.5">
                {unit}
              </span>
            )}
          </div>
        </div>

        {/* ICON */}
        <div className="
          flex h-11 w-11 items-center justify-center
          rounded-lg bg-primary/10 text-primary
          text-xl
        ">
          {icon}
        </div>
      </div>
    </div>
  )
}
