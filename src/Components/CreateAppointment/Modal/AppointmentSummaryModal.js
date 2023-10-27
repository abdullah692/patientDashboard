import React from 'react'
import { Modal } from 'antd'
import { useNavigate } from 'react-router'

function AppSummaryModal({ isModalOpen, setIsModalOpen }) {

  const navigate=useNavigate();  
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleConfirm=()=>{
    navigate("/appConfirmed");
  }

  const cancelAppointment=()=>{
    navigate("/");
  }
  return (
    <div>
      {isModalOpen ? (
        <>
          <Modal
            open={isModalOpen}
            footer={null}
            onCancel={handleCancel}
            maskClosable={false}
            className="w-[500px]"
          >
            <div className="">
              <div className="">
                <p className="text-[#464D59] text-[16px] font-medium">
                  <span className="border-b-2 border-[#5ECCB9]">Appoin</span>
                  tment Confirmation
                </p>
              </div>

              <div className="mt-6">
                <p className="text-[14px] font-medium text-black mb-4">
                  Appointment 1
                </p>
                <p className="mt-5 text-[16px]">
                  Your dental appointment at Genesis Health has been confirmed
                  for{' '}
                  <span className="text-[#5ECCB9] font-medium">
                    Dr. Irfan Ali
                  </span>{' '}
                  at{' '}
                  <span className="font-medium text-black">
                    Thu, 20th Apr, 2024
                  </span>{' '}
                  at{' '}
                  <span className="font-medium text-black">
                    9:00 AM - 10:00 AM{' '}
                  </span>
                  for{' '}
                  <span className="font-medium text-black">
                    Jack Momoa S/O Jason Mamoa
                  </span>
                  . We look forward to seeing you then.
                </p>
              </div>

              <div className='mt-10'>
                <p className='text-black font-medium'>
                  Thank you for choosing Genesis Health for your dental needs.
                </p>
              </div>

              <div className="mt-[30px] flex justify-end">
        <button
          className="m-2 px-6 py-[6px] rounded-lg text-white bg-[#5ECCB9]  "
          htmlType="submit"
          onClick={handleConfirm}
        >
          Confirm
        </button>

        <button
          className="m-2 px-6 py-[6px] rounded-md text-red-600 "
          
          onClick={cancelAppointment}
        >
          Cancel
        </button>
      </div>
            </div>
          </Modal>
        </>
      ) : (
        ''
      )}
    </div>
  )
}

export default AppSummaryModal
