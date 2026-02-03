import React from "react"

interface ChartCardProps {
  title: string
  children: React.ReactNode
  className?: string
  footer?: React.ReactNode
}

export function ChartCard({ title, children, className = "", footer }: ChartCardProps) {
  return (
    <div className={` rounded-lg p-2 border-gray-100 ${className}`}>
      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
        {title}
      </h3>
      <div className="flex justify-center">
        {children}
      </div>
      {footer && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          {footer}
        </div>
      )}
    </div>
  )
}
