import React from "react"

interface SectionTitleProps {
  title: string
  description?: string
  className?: string
}

export function SectionTitle({ title, description, className = "" }: SectionTitleProps) {
  return (
    <div className={`mb-3 ${className}`}>
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      {description && (
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      )}
    </div>
  )
}
