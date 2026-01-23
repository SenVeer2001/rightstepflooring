interface AnswerTypeBadgeProps {
  type: 'text' | 'multipleChoice' | 'yesNo'
}

export function AnswerTypeBadge({ type }: AnswerTypeBadgeProps) {
  const typeLabels = {
    text: 'Text Input',
    multipleChoice: 'Multiple Choice',
    yesNo: 'Yes / No',
  }

  const typeStyles = {
    text: 'bg-blue-100 text-blue-700',
    multipleChoice: 'bg-purple-100 text-purple-700',
    yesNo: 'bg-orange-100 text-orange-700',
  }

  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeStyles[type]}`}>
      {typeLabels[type]}
    </span>
  )
}
