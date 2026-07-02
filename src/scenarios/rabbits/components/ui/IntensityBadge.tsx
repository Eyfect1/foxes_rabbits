import { getIntensityClass } from '../../lib/intensity'

interface IntensityBadgeProps {
  level: number
}

export function IntensityBadge({ level }: IntensityBadgeProps) {
  return (
    <span className={getIntensityClass(level)} aria-label={`Интенсивность ${level} из 10`}>
      {level}
    </span>
  )
}
