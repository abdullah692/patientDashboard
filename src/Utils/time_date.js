import dayjs from 'dayjs'

const addTenMinutes = d => {
  const date = new Date(d)
  date.setMinutes(date.getMinutes() + 10)
  const time = date
    .toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
    .padStart(5, '0')
  return time
}

function convertDayNameToDate(weekday) {
  const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = new Date();
  const currentWeekday = today.getDay();
  const targetWeekday = weekdays.indexOf(weekday.toLowerCase());
  const daysToAdd = targetWeekday - currentWeekday + (targetWeekday <= currentWeekday ? 7 : 0);
  
  today.setDate(today.getDate() + daysToAdd);
  
  return dayjs(today).format("MM/DD/YYYY");
}

export { addTenMinutes, convertDayNameToDate }
