import { Tooltip } from 'antd'
import dayjs from 'dayjs'
import React from 'react'
import { FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import Popup from 'reactjs-popup'
import DropDown from '../Components/DropDown/Dropdown'
import { DownOutlined, LoadingOutlined } from '@ant-design/icons'
import dr from '../assets/images/profile.png'
import Modals from '../Components/Modals/Modals'
const PopUp = ({
  open,
  setOpenPopup,
  handleEdit,
  selectedOption,
  handleMenuClick,
  showStatus,
  handleDelete,
  updStatusLoading,
  data,
}) => {
  console.log(data, 'Dataaaadasdsad:popUp')

  function calculateDuration(start_time, end_time) {
    const startTime = dayjs(start_time)
    const endTime = dayjs(end_time)

    const duration = endTime.diff(startTime) // Duration in milliseconds

    const hours = Math.floor(duration / (1000 * 60 * 60))
    const minutes = Math.floor((duration / (1000 * 60)) % 60)
    const seconds = Math.floor((duration / 1000) % 60)

    const formattedDuration = `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

    return formattedDuration
  }

  const patient = {
    type: data.AppointmentType?.type || data?.appointmentType?.type || '',
    dentist: data?.AppointmentType?.Dentist?.name || data?.dentist || '',
    dentist_dp: data?.AppointmentType?.Dentist?.dp_url || data?.dentist_dp || '',
    apt_id: data?.apt_id || '',
    name: data?.dependent?.name || data?.patient?.name || data?.name || '',
    status: data.status || '',
    phone: data?.patient?.phone || data?.phone || '',
    email: data?.patient?.email || data?.email,
    start_time: data?.start_time || '',
    end_time: data?.end_time || '',
    gender: data?.patient?.gender || data?.gender || '',
    dob: data?.dependent ? dayjs(data?.dependent?.dob, "YYYY-MM-DD").format("MM/DD/YY") : dayjs(data?.patient?.dob, "YYYY-MM-DD").format("MM/DD/YY"),
    // duration : data?.AppointmentType?.duration || data?.duration || "",
    duration:
      calculateDuration(data?.start_time, data?.end_time) ||
      data?.duration ||
      '',
    time: data?.start_time || data?.time || '',
  }
  const BASEURL = `${process.env.REACT_APP_BACKEND_API_URL}/api/files/`

  return (
    // <Popup
    //   open={open}
    //   closeOnDocumentClick={false}
    //   onClose={() => setOpenPopup(false)}
    // >
    <Modals
      open={open}
      // title={modalTitle}
      footer={[]}
      onOk={() => {}}
      onCancel={() => setOpenPopup(false)}
      // width={580}
    >
      {/* {console.log("Events", events)} */}
      {/* <div className="mt-[100px]  bg-opacity-30 backdrop-blur-sm fixed  inset-0 flex justify-center "> */}

      <div className='bg-white text-[black] p-4   min-w[400px] rounded-[10px]'>
        {/* <div className="flex justify-end mb-5 ">
          <IoClose
            className=" cursor-pointer"
            onClick={() => setOpenPopup(false)}
          />
        </div> */}
        <div className='mt-1'>
          <p className='text-[20px] font-semibold font-sans capitalize'>
            {patient.type}
          </p>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <img
                src={BASEURL + patient.dentist_dp}
                alt='dr1 '
                className='w-10 rounded-full object-contain'
                width='40px'
                height='40px'
              />
              <p className=' font-medium text-[#BABABA] capitalize'>
                with {patient.dentist}
              </p>
            </div>
            <div className='flex items-center gap-2'>
              <div className='cursor-pointer' onClick={() => handleEdit(data)}>
                <Tooltip placement='top' title='Edit Appointment'>
                  <FaEdit size={20} />
                </Tooltip>
              </div>
              <div className='cursor-pointer'>
                <Tooltip placement='top' title='Delete Appointment'>
                  <MdDelete
                    size={20}
                    style={{ color: 'red' }}
                    onClick={() => handleDelete(data?.id)}
                  />
                </Tooltip>
              </div>
            </div>
          </div>
          <hr className='border-t-2 border-[#F3F3F3] mt-1'></hr>
          <div className='grid grid-cols-2 pt-2 px-4 gap-6'>
            <div className='col-span-1 rounded-[10px]'>
              <div>
                <p className='text-[#BABABA]'>Date</p>
                <p>
                  {dayjs(patient?.time?.split(' ')[0]).format('MM/DD/YY')}

                  {/* {formatDate(data.start_time)} */}
                  {/* {new Date(data.start_time).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-').toString()} */}
                </p>
              </div>

              <div>
                <p className='text-[#BABABA]'>Patient Name</p>
                <p className='capitalize'>{patient.name}</p>
              </div>

              <div className=''>
                <p className='text-[#BABABA] '>Appointment Type</p>
                <p className='capitalize'>{patient.type}</p>
              </div>
              <div className=''>
                <p className='text-[#BABABA] '>Status</p>
                <p className='capitalize'>
                  <DropDown
                    arr={showStatus}
                    callback={(key, value) => {
                      handleMenuClick(key, value, data?.id)
                    }}
                    _for={'status'}
                    size='middle'
                    req_msg={'Status'}
                    maxWidth='150px'
                    width='150px'
                    defaultValue={patient?.status}
                    icon={
                      updStatusLoading ? <LoadingOutlined /> : <DownOutlined />
                    }
                  />
                </p>
              </div>

              <div className='flex flex-col'>
                    {Object.keys(data?.dependent || {}).length > 0 && <p className='text-gray-400 font-bold mt-2'>Parent Details</p>}
                <div className={`${Object.keys(data?.dependent || {}).length > 0 ? "ml-3": ""}`}>
                  <p className='text-[#BABABA] '>Phone No</p>
                  <p className='capitalize'>{patient.phone} </p>
                </div>

                <div className={`${Object.keys(data?.dependent || {}).length > 0 ? "ml-3": ""}`}>
                  <p className='text-[#BABABA] '>Email</p>
                  <p>{patient.email} </p>
                </div>
              </div>
            </div>

            <div className='ml-4'>
              <div className='px-4'>
                <p className='text-[#BABABA] '>Start Time</p>
                <p className='capitalize'>
                  {/* {data.time.split(" ").splice(1, 2)} */}
                  {/* {`${new Date(data.start_time)
                          .getHours()
                          .toString()
                          .padStart(2, "0")}:${new Date(
                          data.start_time
                        )
                          .getMinutes()
                          .toString()
                          .padStart(2, "0")}`} */}
                  {`${new Date(patient.start_time).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}`}
                </p>
              </div>

              <div className='px-4'>
                <p className='text-[#BABABA] '>End Time</p>
                <p className='capitalize'>
                  {`${new Date(patient.end_time).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}`}
                </p>
              </div>

              <div className='px-4'>
                <p className='text-[#BABABA] '>Duration</p>
                <p className='capitalize'>{patient.duration}</p>
              </div>

              <div className='px-4'>
                <p className='text-[#BABABA] '>Gender</p>
                <p className='capitalize'>{patient.gender}</p>
              </div>

              <div className='px-4'>
                <p className='text-[#BABABA] '>Dob</p>
                <p className='capitalize'>{dayjs(patient.dob).format('MM/DD/YY')}</p>
              </div>

              {/* <div className="px-4">
                      <p className="text-[#BABABA] ">Age</p>
                      <p className="capitalize">
                        {val - (data.dob)}</p>
                    </div> */}
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
      {/* </Popup> */}
    </Modals>
  )
}

export default PopUp
