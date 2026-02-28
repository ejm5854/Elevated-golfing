export function formatMonthYear(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

export function formatDateRange(startStr: string, endStr: string): string {
  const start = new Date(startStr + 'T00:00:00')
  const end   = new Date(endStr   + 'T00:00:00')
  const sameYear = start.getFullYear() === end.getFullYear()

  const startFormatted = start.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: sameYear ? undefined : 'numeric',
  })
  const endFormatted = end.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return `${startFormatted} – ${endFormatted}`
}

export function tripDays(startStr: string, endStr: string): number {
  const start = new Date(startStr + 'T00:00:00').getTime()
  const end   = new Date(endStr   + 'T00:00:00').getTime()
  return Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1
}

export function getYear(dateStr: string): number {
  return new Date(dateStr + 'T00:00:00').getFullYear()
}

export function byDateDesc(a: { startDate: string }, b: { startDate: string }): number {
  return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
}
