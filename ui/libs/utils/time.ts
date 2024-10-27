import dayjs from 'dayjs'

export const formatTimestamp = (unixTimestamp: number) => {
  const date = dayjs.unix(unixTimestamp)
  const now = dayjs()

  // today
  if (date.isSame(now, 'day')) {
    return date.format('h:mm A')
  }

  // yesterday
  if (date.isSame(now.subtract(1, 'day'), 'day')) {
    return date.format('ddd h:mm A')
  }

  // earlier this week but not today or yesterday
  if (
    date.isAfter(now.startOf('week')) &&
    !date.isSame(now, 'day') &&
    !date.isSame(now.subtract(1, 'day'), 'day')
  ) {
    return date.format('ddd h:mm A')
  }

  // last week
  if (
    date.isAfter(now.subtract(1, 'week').startOf('week')) &&
    date.isBefore(now.startOf('week'))
  ) {
    return date.format('MMM D h:mm A')
  }

  // earlier this month but not this week
  if (
    date.isAfter(now.startOf('month')) &&
    !date.isAfter(now.startOf('week'))
  ) {
    return date.format('MMM D h:mm A')
  }

  // last month
  if (
    date.isAfter(now.subtract(1, 'month').startOf('month')) &&
    date.isBefore(now.startOf('month'))
  ) {
    return date.format('MMM D h:mm A')
  }

  // older notes
  return date.format('MMM D, YYYY h:mm A')
}
