import React from 'react'
import img1 from '../../assets/images/dr.png'
import dayjs from 'dayjs'

const ApptHistoryPatients = ({ PatientHistory }) => {
  const colorChange = () => {
    if (PatientHistory.status == 'pending') {
      return <span className=' text-gray-500'>{PatientHistory.status}</span>
    }
    if (PatientHistory.status == 'cancled') {
      return <span className='text-red-500'>{PatientHistory.status}</span>
    }
    if (PatientHistory.status == 'booked') {
      return <span className='text-blue-500'>{PatientHistory.status}</span>
    }
    if (PatientHistory.status == 'confirmed') {
      return <span className='text-green-500'>{PatientHistory.status}</span>
    }
  }
  const convertTime = dateTime => {
    console.log(dateTime,"lllllllllllllllllllll");
    const formattedTime = new Date(dateTime)?.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    })
    return formattedTime
  }
  return (
    <div className='mt-5' key={PatientHistory.id}>
      <div className=' w-[200px]  mx-4 flex border-2 p-2 border-gray-200 rounded-md '>
        <div className='flex justify-center items-center w-[30px] h-[30px] overflow-hidden rounded-full bg-gray-400 border border-sea-green'>
          <img
            
            src={
              PatientHistory?.dentistDpUrl
                ? `${process.env.REACT_APP_BACKEND_API_URL}/api/files/${PatientHistory?.dentistDpUrl}`
                : img1
            }
            width={60}
            height={60}
            alt=''
            className='object-cover'
          />
        </div>
        <div className='ml-2'>
          <p className=' font-semibold text-lg'>
            {PatientHistory?.dentistName}
          </p>
          <p className='text-gray-800 text-sm font-semibold'>
            {PatientHistory?.appointmentType}
          </p>
          <p className='text-gray-800 text-sm font-semibold'>
            {dayjs(PatientHistory?.date).format('MM/DD/YY')}
          </p>
          <p className='text-gray-800 text-sm font-semibold'>
            {convertTime(PatientHistory?.startTime)} -{' '}
            {convertTime(PatientHistory?.endTime)}
          </p>
          {colorChange()}
        </div>
      </div>
    </div>
  )
}

export default ApptHistoryPatients
