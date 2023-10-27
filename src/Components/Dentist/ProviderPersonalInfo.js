import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import dr from '../../assets/images/dr1.jpg'
import { BsFillTelephoneFill } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'
import { FaEdit } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import email from '../../assets/images/envelope.png'
import { Tooltip } from 'antd'
import { getProviderInfoByProviderId } from '../../Slices/Dentist.slice'
import { daysOfWeek } from './data'
import { ClipLoader } from 'react-spinners'
import { useParams } from 'react-router-dom'

function ProviderPersonalInfo(props) {
  // const location = useLocation()
  const { id } = useParams()
  console.log('id sssssssssss', id)
  const dispatch = useDispatch()
  const [loading, setLoaidng] = useState(false)
  // const providerInfoId = location?.state?.id
  // console.log('dentistIdaaaaaa', providerInfoId)
  const navigate = useNavigate()
  const providerInfo = useSelector((state) => state?.Dentist?.providerInfoById)
  console.log('providerPersonalList', providerInfo)

  useEffect(() => {
    setLoaidng(true)
    dispatch(getProviderInfoByProviderId({ providerInfoId: id }))
      .unwrap()
      .then((x) => {
        console.log(x, 'xxxxxxxxxxxxxxxxxxxx')
        setLoaidng(false)
      })
      .catch((e) => {
        console.log('Error Message', e)
        setLoaidng(false)
      })
  }, [])

  return (
    <div>
      {loading ? (
        <>
          <div className="flex justify-center mt-20">
            <ClipLoader color="#5ECCB9" size={50} />
          </div>
        </>
      ) : (
        <>
          <div className="mx-8  bg-white rounded-xl">
            <div className="ml-5 pt-4">
              <p className="text-[#464D59] p-2 text-[16px] font-normal">
                <span className="border-b-2 border-[#5ECCB9]">Personal</span>{' '}
                Information
              </p>
            </div>
            <div className="m-8">
              {providerInfo?.map((dentistInfo) => {
                const titles = dentistInfo?.Qualifications?.map(
                  (qualification) => qualification?.title
                )
                const titlesJoined = titles.join(', ')
                return (
                  <>
                    <div className="grid grid-cols-3">
                      <div className="col-span-2 flex">
                        <img
                          src={`${process.env.REACT_APP_BACKEND_API_URL}/api/files/${dentistInfo?.dp_url}`}
                          className="h-[132px] w-[132px] rounded-xl "
                        />

                        <div>
                          <p className="ml-2 text-[28px] font-semibold text-[#5ECCB9]">
                            {dentistInfo?.name}
                          </p>
                          <p className="ml-2 text-[#14226D] font-medium text-[18px]">
                            {`(${titlesJoined})`}
                          </p>
                          <div className="mt-5 grid grid-cols-3 gap-10 ml-2">
                            <div>
                              <p className="text-[#14226D] text-[14px]">
                                Gender
                              </p>
                              <p className="text-[16px] font-medium text-[#333333]">
                                {dentistInfo?.gender}
                              </p>
                            </div>
                            <div>
                              <p className="text-[#14226D] text-[14px]">
                                Marital Status
                              </p>
                              <p className="text-[16px] font-medium text-[#333333]">
                                {dentistInfo?.marital_status}
                              </p>
                            </div>
                            <div>
                              <p className="text-[#14226D] text-[14px]">
                                Appointment Types
                              </p>
                              <div className="flex">
                                {dentistInfo?.AppointmentTypes?.map(
                                  (appType) => {
                                    return (
                                      <Tooltip title={appType?.type}>
                                        <div
                                          className="h-4 w-4 rounded-full"
                                          style={{
                                            backgroundColor: appType?.color,
                                            margin: '2px',
                                          }}
                                        />
                                      </Tooltip>
                                    )
                                  }
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <div className="flex px-2">
                          <BsFillTelephoneFill />{' '}
                          <span className="ml-2">{dentistInfo?.phone}</span>
                        </div>
                        <div className="flex px-2">
                          <MdEmail className="mt-1" />{' '}
                          <span className="ml-2">{dentistInfo?.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="text-[#14226D] font-medium">
                        Brief Bio
                      </div>
                      <p className="mt-2 text-[15px] ">{dentistInfo?.bio}</p>
                    </div>

                    <div className="mt-10">
                      {daysOfWeek.map((days) => {
                        const availability = dentistInfo?.Availabilities?.find(
                          (item) => item?.days?.toLowerCase() === days.day
                        )
                        console.log('availability', availability)
                        if (availability) {
                          const {
                            start_time,
                            end_time,
                            break_start_time,
                            break_end_time,
                          } = availability

                          return (
                            <div
                              className="flex justify-between py-2"
                              key={days.day}
                            >
                              <div className="p-2 text-[16px] font-medium">
                                {days.day}
                              </div>
                              <div className="flex">
                                {break_start_time == null ? (
                                  <div className="mx-2 px-4 py-2 rounded-lg border-2 border-slate-300 bg-[#F8FBFF]">
                                    {start_time} - {end_time}
                                  </div>
                                ) : (
                                  <>
                                    <div className="mx-2 px-4 py-2 rounded-lg border-2 border-slate-300 bg-[#F8FBFF]">
                                      {start_time} - {break_start_time}
                                    </div>
                                    <div className="mx-2 px-4 py-2 rounded-lg border-2 border-slate-300 bg-[#F8FBFF]">
                                      {break_end_time} - {end_time}
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          )
                        }

                        return (
                          <div
                            className="flex justify-between py-2"
                            key={days.day}
                          >
                            <div className="p-2 text-[16px] font-medium">
                              {days.day}
                            </div>
                            <div className="flex">
                              <div className="mx-2 px-6 py-2 rounded-lg border-2 border-red-500 bg-red-300">
                                Off
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )
              })}

              <div className="mt-8">
                <div className="flex justify-end">
                  <button
                    className="px-10 py-2 text-white bg-[#14226D] rounded-md mx-3 flex mb-7"
                    onClick={() =>
                      navigate(`/editProviderInfo/${id}`
                      //  {
                      //   state: { providerInfoEdit: providerInfo[0] },
                      // }
                      )
                    }
                  >
                    <FaEdit className="mt-1" />{' '}
                    <span className="ml-2">Edit</span>{' '}
                  </button>
                  <button
                    className="px-6 py-2 text-gray-500 border-[1px] border-slate-500 rounded-md mx-1 mb-7"
                    onClick={() => navigate('/provider')}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ProviderPersonalInfo
