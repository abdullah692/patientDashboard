import React from 'react'
import { useParams } from 'react-router-dom'

const AppointmentConfirmed = ({ handleClickOkay }) => {
    const { apmnt_id } = useParams()

    const circleTick = (
        <svg width="107" height="107" viewBox="0 0 107 107" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M48.0352 68.4492C47.4141 69.0703 46.3789 69.0703 45.7578 68.4492L32.5078 55.1992C31.8867 54.5781 31.8867 53.543 32.5078 52.9219C33.1289 52.3008 34.1641 52.3008 34.7852 52.9219L47 64.9297L72.2578 39.6719C72.8789 39.0508 73.9141 39.0508 74.5352 39.6719C75.1562 40.293 75.1562 41.3281 74.5352 41.9492L48.0352 68.4492ZM106.625 53.957C106.625 83.3555 82.8164 106.957 53.625 106.957C24.2266 106.957 0.625 83.3555 0.625 53.957C0.625 24.7656 24.2266 0.957031 53.625 0.957031C82.8164 0.957031 106.625 24.7656 106.625 53.957ZM53.625 4.26953C26.0898 4.26953 3.9375 26.6289 3.9375 53.957C3.9375 81.4922 26.0898 103.645 53.625 103.645C80.9531 103.645 103.312 81.4922 103.312 53.957C103.312 26.6289 80.9531 4.26953 53.625 4.26953Z" fill="#5ECCB9"/>
        </svg>
    )

  return (
    <div className='flex flex-col items-center pt-8 bg-white min-h-[560px]'>
        <div className="">
            {circleTick}
        </div>
        <div className='mt-8 text-gray-700 text-[40px] font-semibold'>
            Your Patient <span className='border-b-2 border-sea-green'>Appointment</span> is {apmnt_id ? "Updated" : "Confirmed"}
        </div>
        <div className="mt-8 text-center w-[60%] font-semibold text-base">If you need to reschedule or cancel your appointment, please let us know as soon as possible. Our team is always available to answer any questions you may have. Thank you for choosing our services, and we look forward to seeing you soon.</div>
        <div className='mt-12'>
            <button onClick={handleClickOkay} className='w-[298px] flex justify-center items-center rounded-md bg-gradient-to-r border border-sea-green text-white from-sea-green to-dashboard-green hover:from-dashboard-green hover:to-[#10967f] font-semibold py-[11px] mt-3'>
                Okay
            </button>
        </div>
    </div>
  )
}

export default AppointmentConfirmed