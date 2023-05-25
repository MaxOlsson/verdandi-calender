import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import Holidays from 'date-holidays'

import { WEEKDAYS } from './constants'

dayjs.extend(isoWeek) // develop this so we dont need to do this ugly extend

export const daysInMonth = (year, month) => new Date(year, month, 0).getDate()

export const arrayRange = (start, stop, step = 1) =>
  Array.from({ length: (stop - start) / step + 1 }, (value, index) => start + index * step)

export const getLastDayInMonth = (year, month) => new Date(`${year}-${month}-${daysInMonth(year, month)}`).getDay()

export const getDayInMonth = (year, month, day) => new Date(`${year}-${month}-${day}`).getDay()

export const formatDate = (year, month, day) =>
  `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`

export const isToday = (shortDate) => {
  const today = new Date()
  const day = new Date(`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`).getDate()
  return shortDate === day
}

export const getDisplayYear = () =>
  `${new Date().getUTCFullYear()}-${new Date().getUTCMonth() + 1}-${new Date().getUTCDate()}`

export const shiftCalenderWeekdays = (startWith = WEEKDAYS[0]) => {
  const idx = Object.values(WEEKDAYS).indexOf(startWith)
  return [...Object.values(WEEKDAYS).slice(idx), ...Object.values(WEEKDAYS).slice(0, idx)]
}

export const createCalender = (year = new Date().getFullYear(), month = new Date().getUTCMonth() + 1, weekdays) => {
  const daysInCurrentMonth = daysInMonth(year, month)
  const firstDayInCurrentMonth = getDayInMonth(year, month, 1)
  const firstDisplayDayInCurrentMonth = WEEKDAYS[firstDayInCurrentMonth]
  const currentMonthFirstDayOffset = weekdays.indexOf(firstDisplayDayInCurrentMonth) - 1

  const previousMonthLength = daysInMonth(year, month - 1)

  const currentMonthLastDisplayDay = WEEKDAYS[getLastDayInMonth(year, month)]
  const displayDayOffset = weekdays.indexOf(currentMonthLastDisplayDay) + 1
  const remainingDays = 7 - displayDayOffset

  const calenderDays = {
    previousMonth: arrayRange(previousMonthLength - currentMonthFirstDayOffset, previousMonthLength),
    currentMonth: arrayRange(1, daysInCurrentMonth),
    nextMonth: arrayRange(1, remainingDays),
  }

  return calenderDays
}

export const applyHolidaysToCalender = (year, month, calenderMonth, holidays) => {
  const mappedCalender = calenderMonth.map((day) => {
    const formattedDay = formatDate(year, month, day)
    const holiday = holidays.find((holiday) => holiday.day === formattedDay)
    return {
      shortDate: formattedDay,
      weekday: WEEKDAYS[getDayInMonth(year, month, day)],
      isoWeek: dayjs(formattedDay).isoWeek(),
      isToday: isToday(day),
      dayOfMonth: day,
      holiday,
    }
  })
  return mappedCalender
}

export const createHolidayInstance = (year, country, region, locality) => {
  const holidays = new Holidays(country, region, locality)
  return holidays.getHolidays(year)
}
