import { Button, Drawer, Tooltip } from 'antd'
import { useState } from 'react'
import SideCalendar from './SideCalendar'
import { FaCalendar } from 'react-icons/fa'
import dayjs from 'dayjs'
const CalendarSch = ({ handleCustomDate }) => {
  const [open, setOpen] = useState(false)
  const showDrawer = () => {
    setOpen(true)
  }
  const onClose = () => {
    setOpen(false)
  }
  const handleCalenderDate = dateObj => {
    console.log(dayjs(dateObj).format('MM/DD/YY'), 'dateObj')
    handleCustomDate(dateObj)
    // setOpen(false)
  }
  return (
    <div className='flex justify-end items-end '>
      <Tooltip title='open calendar'>
        <button
          className='rounded-lg bg-gradient-to-r text-white from-sea-green to-dashboard-green hover:from-dashboard-green hover:to-[#10967f] flex items-center justify-center site p-2 mr-5 mb-2'
          onClick={showDrawer}
        >
          <FaCalendar />
        </button>
      </Tooltip>
      <Drawer
        title='Select Date'
        placement='right'
        onClose={onClose}
        open={open}
      >
        <div className='flex flex-col justify-center items-center'>
          <SideCalendar onSelect={handleCalenderDate} todayBtn={true} />
          <button
            onClick={onClose}
            className='rounded-lg bg-gradient-to-r text-white from-sea-green to-dashboard-green hover:from-dashboard-green hover:to-[#10967f] py-2 w-full mt-5'
          >
            Ok
          </button>
          <button
            onClick={onClose}
            className='rounded-lg py-2  border-0 bg-red-600 hover:bg-red-700 text-white w-full mt-5'
          >
            Cancel
          </button>
        </div>
      </Drawer>
    </div>
  )
}
export default CalendarSch
