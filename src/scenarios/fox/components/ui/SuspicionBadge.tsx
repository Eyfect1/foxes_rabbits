import { getSuspicionClass } from '../../lib/suspicion'

interface SuspicionBadgeProps {
  level: number
}

export function SuspicionBadge({ level }: SuspicionBadgeProps) {
  return (
    <span className={getSuspicionClass(level)} aria-label={`Подозрительность ${level} из 10`}>
      {level}
    </span>
  )
}
