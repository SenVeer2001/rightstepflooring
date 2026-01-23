import { Star } from 'lucide-react'

interface RatingStarsProps {
  rating: number
  onChange?: (rating: number) => void
  readOnly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function RatingStars({ 
  rating = 0, 
  onChange, 
  readOnly = true,
  size = 'md'
}: RatingStarsProps) {
  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24,
  }[size]

  const handleClick = (index: number) => {
    if (!readOnly && onChange) {
      onChange(index + 1)
    }
  }

  return (
    <div className="flex gap-1">
      {[0, 1, 2, 3, 4].map((index) => (
        <button
          key={index}
          onClick={() => handleClick(index)}
          disabled={readOnly}
          className={`${readOnly ? 'cursor-default' : 'cursor-pointer hover:opacity-80'} transition-opacity`}
        >
          <Star
            size={iconSize}
            className={
              index < rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }
          />
        </button>
      ))}
    </div>
  )
}
