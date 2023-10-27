import React from 'react'

import { AvailableSlots } from './data'

import CancelButton from './CancleButton/CancelButton'
import SideCalendar from './SideCalendar/SideCalendar'
import { Button, Dropdown, Radio, Space } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { useState } from 'react'

function DateTimeSlot({ setCurrent, current }) {
  const [value, setValue] = useState("")
  const [value2, setValue2] = useState("")
  const handleSubmit = () => {
    setCurrent(4)
    // console.log('handleSubmit');
    // if (appointment.length > 0) {
    //   console.log('handleSubmit current')
    //   setCurrent(3)
    // }
    // else{
    //     NotificationWithIcon("error", "Please select any appointment type");
    // }
  }
  const handleMenuClick = (e) => {
    console.log('click', e.domEvent.target.innerHTML)
    setValue(e.domEvent.target.innerHTML)
  }
  const handleMenuClick1 = (e) => {
    console.log('click', e.domEvent.target.innerHTML)
    setValue2(e.domEvent.target.innerHTML)
  }
  const items = [
    {
      label: 'Root Canal',
      key: '1',
      icon: '',
    },
  ]
  const items1 = [
    {
      label: 'DR. Drew Mcintyre',
      key: '1',
      icon: '',
    },
  ]
  const menuProps = {
    items,
    onClick: handleMenuClick1,
  }
  const menuProps1 = {
    items: items1,
    onClick: handleMenuClick,
  }
  return (
    <div className="ml-10 mt-5">
      <div className="grid grid-cols-2">
        <div className="w-5/6">
          <div >
            <Dropdown menu={menuProps}>
              <Button size="large" className="w-52 mr-2" >
                <Space>
                {value2 ? value2 : "Appointment Type"} 
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
            <Dropdown menu={menuProps1}>
              <Button size="large" className="w-52">
                <Space>
                  {value ? value : "Select Provider"}
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </div>
          <div className="my-5">
            <div className="">
              <p>Search By</p>
              <div className="my-2">
                <Radio.Group name="radiogroup" className="" size="small">
                  <Radio value="anytime">Anytime</Radio>
                  <Radio value="firstavailable">first Available</Radio>
                  <Radio value="morning">Morning</Radio>
                  <Radio value="afternoon">Afternoon</Radio>
                </Radio.Group>
              </div>
            </div>
            <SideCalendar />
          </div>
        </div>

        <div className="ml-[-50px] mb-10 p-4  ">
          <p className="text-[#464D59]">
            <span className="border-b-2 border-[#5ECCB9]">Select</span> Time
          </p>
          <div>
            {AvailableSlots.map((item) => {
              return (
                <div className="mt-6">
                  <p className="text-[14px] text-[#676e7a] font-semibold">
                    {item.SlotTime}
                  </p>
                  <div className="mt-4 grid grid-cols-3  gap-7 cursor-pointer">
                    {item.data.map((slots) => {
                      return (
                        <div className="p-3 text-center bg-[#f1f4f9] rounded-lg border-[1px] border-slate-400">
                          <p>
                            {slots.startTime} - {slots.endTime}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mt-[30px] flex justify-end">
        <button
          className="m-2 px-8 py-[6px] rounded-md text-white bg-[#5ECCB9]  "
          htmlType="submit"
          onClick={handleSubmit}
        >
          Proceed
        </button>
        <CancelButton setCurrent={setCurrent} current={current} />
      </div>
    </div>
  )
}

export default DateTimeSlot
