import { DateTime, type DateTimeFormatOptions } from 'luxon'

const scheme = typeof process.env.REACT_APP_API_SCHEME === 'string' ? process.env.REACT_APP_API_SCHEME : 'http'
const host = typeof process.env.REACT_APP_API_HOST === 'string' ? process.env.REACT_APP_API_HOST : ''
const port = typeof process.env.REACT_APP_API_PORT === 'string' ? `:${process.env.REACT_APP_API_PORT}` : ':3001'
const apiBase = typeof process.env.REACT_APP_API_BASE === 'string' ? process.env.REACT_APP_API_BASE : ''

export const baseUrl = `${scheme}://${host}${port}${apiBase}`
export const videoUrl = typeof process.env.REACT_APP_VIDEO_HOST === 'string' ? process.env.REACT_APP_VIDEO_HOST : ''

export function sortDateStrings (a = '', b = ''): number {
  if (a === b) {
    return 1
  }
  const aDate = DateTime.fromISO(a)
  const bDate = DateTime.fromISO(b)
  return aDate > bDate ? 1 : -1
}

export const dateAndTimeFormat: DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h24'
}
