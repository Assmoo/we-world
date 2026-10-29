const DAY_IN_MS = 86_400_000
const HISTORY_WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

export const RELATIONSHIP_START = {
  year: 2026,
  month: 8,
  day: 11,
} as const

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

export function dateKey(value = new Date()): string {
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`
}

function dateOnlyUtc(value: Date): number {
  return Date.UTC(value.getFullYear(), value.getMonth(), value.getDate())
}

export function daysTogether(value = new Date()): number {
  const start = Date.UTC(
    RELATIONSHIP_START.year,
    RELATIONSHIP_START.month - 1,
    RELATIONSHIP_START.day,
  )

  return Math.max(1, Math.floor((dateOnlyUtc(value) - start) / DAY_IN_MS) + 1)
}

export function formatTime(value = new Date()): string {
  return `${pad(value.getHours())}:${pad(value.getMinutes())}`
}

export function formatToday(value = new Date()): string {
  return `${value.getMonth() + 1}月${value.getDate()}日 · ${HISTORY_WEEKDAYS[value.getDay()]}`
}

export function formatHistoryDate(value: string): string {
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return value

  const date = new Date(year, month - 1, day)
  return `${month}月${day}日 ${HISTORY_WEEKDAYS[date.getDay()]}`
}

export function formatHistoryTime(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return formatTime(date)
}

export function formatDayNumber(value: number): string {
  return String(value).padStart(3, '0')
}
