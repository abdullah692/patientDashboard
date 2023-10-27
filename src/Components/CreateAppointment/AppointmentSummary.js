import React, { useState } from 'react'
import { Table } from 'antd'
import { columns, dataSource } from './data'
import { Modal } from 'antd'
import CancelButton from './CancleButton/CancelButton'
import AppSummaryModal from './Modal/AppointmentSummaryModal'

function AppointmentSummary({ setCurrent, current }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const OpenPopup = () => {
    console.log('submit')
    setIsModalOpen(true)
  }
  const handleSubmit = () => {
    setCurrent(1)
  }

  return (
    <>
      <div className="ml-10 mt-10">
        <p className="text-[#464D59]">
          <span className="border-b-2 border-[#5ECCB9]">Appoin</span>tment{' '}
          Summary
        </p>
      </div>
      <div className="my-5 mx-10">
        <Table dataSource={dataSource} columns={columns} />
      </div>

      <div className="mt-[80px] flex justify-between">
        <div>
          <button
            className="m-2 px-8 py-[6px] rounded-md text-white bg-[#14226D]  "
            onClick={handleSubmit}
          >
            Add Another Appointment
          </button>
        </div>
        <div className="flex">
          <button
            className="m-2 px-8 py-[6px] rounded-md text-white bg-[#5ECCB9]  "
            type="button"
            onClick={OpenPopup}
          >
            Submit
          </button>
          <CancelButton
            setCurrent={setCurrent}
            current={current}
            isModalOpen={isModalOpen}
          />
        </div>
      </div>

      {isModalOpen ? (
        <>
          <AppSummaryModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        </>
      ) : (
        ''
      )}
    </>
  )
}

export default AppointmentSummary
