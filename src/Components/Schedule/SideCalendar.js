import { Calendar, theme, Button } from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'

const SideCalendar = ({
  todayBtn = false,
  onPanelChange = (value, mode) => {
    // console.log(value.format('YYYY-MM-DD'), mode, 'hahehehehe')
  },
  onSelect = obj => {
    console.log(dayjs(obj).format('MM/DD/YY'))
  },
  disabledDate = () => false,
  defaultValue = null,
  value
}) => {
  const { token } = theme.useToken()
  const wrapperStyle = {
    width: 300,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  }

  const [selectedDate, setSelectedDate] = useState(defaultValue || dayjs())

  const handleTodayClick = () => {
    const today = dayjs()
    setSelectedDate(today)
    onSelect(today)
  }

  return (
    <div style={wrapperStyle}>
      {todayBtn && (
        <div className='flex justify-center m-1'>
          <Button
            onClick={handleTodayClick}
            className='w-full bg-light-blue  text-white hover:!text-white hover:!border-transparent'
          >
            Today
          </Button>
        </div>
      )}
      <Calendar
        fullscreen={false}
        value={value || selectedDate}
        onPanelChange={onPanelChange}
        onSelect={date => {
          setSelectedDate(date)
          onSelect(date)
        }}
        disabledDate={disabledDate}
      />
    </div>
  )
}

export default SideCalendar
