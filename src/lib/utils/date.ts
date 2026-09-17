export function formatDateId(dateInput: Date | string) {
  const date = new Date(dateInput)
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

export function formatShortDateId(dateInput: Date | string) {
  const date = new Date(dateInput)
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}
