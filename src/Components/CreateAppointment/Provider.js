import React from 'react'
import drImg from '../../assets/images/drImg1.png'
import { OtherDrs, ProviderDetails } from './data'
import AppointmentSummary from './AppointmentSummary'
import CancelButton from './CancleButton/CancelButton'

function Provider({ setCurrent, current }) {
  const handleSubmit = () => {
    setCurrent(5);
  }
  return (
    <div className="m-10">
      <div className="mb-4">
        <p className="text-[#464D59]">
          <span className="border-b-2 border-[#5ECCB9]">Select</span> Provider
        </p>
      </div>

      <div className="grid grid-cols-4 mt-5 mb-5 gap-6">
        {ProviderDetails.map((provider) => {
          return (
            <>
              <div
                className="bg-[#f1f4f9] border-[1px] border-slate-400 rounded-lg cursor-pointer"
                key={provider.id}
              >
                <div className="flex p-2">
                  <div>
                    <img src={provider.pic} />
                  </div>
                  <div className="ml-5">
                    <p className="text-[18px] font-semibold">{provider.name}</p>
                    <p className="text-[16px]">{provider.email}</p>
                    <p className="text-[16px]">{provider.phoneNo}</p>
                    
                  </div>
                </div>
              </div>
            </>
          )
        })}
      </div>

      <div className="mt-10">
        <p className="text-[#464D59]">
          <span className="border-b-2 border-[#5ECCB9]">Other</span> Doctors
        </p>
      </div>

      <div className="grid grid-cols-4 mt-5 mb-5 gap-6">
        {OtherDrs.map((provider) => {
          return (
            <>
              <div
                className="bg-[#f1f4f9] border-[1px] border-slate-400 rounded-lg cursor-pointer"
                key={provider.id}
              >
                <div className="flex p-2">
                  <div>
                    <img src={provider.pic} />
                  </div>
                  <div className="ml-5">
                    <p className="text-[18px] font-semibold m-0">{provider.name}</p>
                    <p className="text-[16px] m-0">{provider.email}</p>
                    <p className="text-[16px] m-0">{provider.phoneNo}</p>
                    <p className="text-[16px] m-0">{provider.date}</p>
                    <p className="text-[16px] m-0">{provider.slotTime}</p>
                  </div>
                </div>
              </div>
            </>
          )
        })}
      </div>


      <div className="mt-[30px] mb-10 flex justify-end">
        <button
          className="m-2 px-8 py-[6px] rounded-md text-white bg-[#5ECCB9]  "
          htmlType="submit"
          onClick={handleSubmit}
        >
          Submit
        </button>
        <CancelButton setCurrent={setCurrent} current={current} />
      </div>
    </div>
  )
}

export default Provider
