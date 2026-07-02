export function getIntensityClass(level: number): string {
  if (level >= 8) {
    return 'suspicion suspicion--high'
  }

  if (level >= 5) {
    return 'suspicion suspicion--medium'
  }

  return 'suspicion suspicion--low'
}
