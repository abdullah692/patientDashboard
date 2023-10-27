import React, { useState } from 'react'
import { appTypes } from './AppointmentTypes/data'
import { AppointmentTypes } from './data'
import CancelButton from './CancleButton/CancelButton'
import { Input, Space } from 'antd'
import { FaSearch } from 'react-icons/fa'
import { NotificationWithIcon } from '../../Utils/Notification'
 

function AppointmentType({ setCurrent, current }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [appointment, setAppointment] = useState('')
  const [appId, setAppId] = useState('')

  let appIds
  const handleInputChange = (event) => {
    console.log('search item', event.target.value)
    setSearchTerm(event.target.value)
  }

  const filteredAppointmentTypes = AppointmentTypes.filter((item) =>
    item.appointment.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAppointment = (appointment) => {
    console.log('id is', appointment)
    setAppointment([appointment])
    setAppId(appointment.id)
    // appId=appointment.id;
  }

  const handleSubmit = () => {
    // console.log('handleSubmit');
    if (appointment.length > 0) {
      console.log('handleSubmit current')
      setCurrent(3)
    }
    else{
        NotificationWithIcon("error", "Please select any appointment type");
    }
  }

  console.log('Appointment', appointment)
  return (
    <>
      <div className="flex justify-between ">
        <div className="ml-10 mt-10">
          <p className="text-[#464D59]">
            <span className="border-b-2 border-[#5ECCB9]">Select</span>{' '}
            Appointment Type
          </p>
        </div>
        <div className="mr-10 mt-10">
          <div className="flex items-center border border-gray-400 rounded-lg py-1 px-10 bg-[#f1f4f9]">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search by name"
              className="bg-transparent focus:outline-none w-full"
              value={searchTerm}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      <div className="mt-10 px-10">
        <div className="grid grid-cols-6 mb-10">
          {filteredAppointmentTypes.map((item) => {
            const isSelected = appId === item.id
            return (
              <div
                className={`py-5 ${
                  isSelected
                    ? 'bg-[#14226D] text-white'
                    : 'bg-[#f1f4f9] text-[#464D59]'
                } text-center text-[16px] rounded-md mx-2 my-4 text-[#464D59] cursor-pointer`}
                key={item.id}
                onClick={() => handleAppointment(item)}
              >
                {item.appointment}
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-[50px] flex justify-end">
        <button
          className="m-2 px-8 py-[6px] rounded-md text-white bg-[#5ECCB9]  "
          htmlType="submit"
          onClick={handleSubmit}
        >
          Submit
        </button>
        <CancelButton setCurrent={setCurrent} current={current} />
      </div>
    </>
  )
}

export default AppointmentType
