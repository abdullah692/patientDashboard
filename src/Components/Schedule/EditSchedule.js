import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useLocation } from 'react-router'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

import dr from '../../assets/images/profile.png'
// import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'
import { TimePicker } from 'antd'
import dayjs from 'dayjs'
import axios from 'axios'
import { NotificationWithIcon } from '../../Utils/Notification'
import { ClipLoader } from 'react-spinners'
import { DatePicker, Space } from 'antd'
import DropDown from '../DropDown/Dropdown'
import { statusList } from '../../Utils/utils'
import authHeader from '../../Services/authHeader'
import { getAppointmentById } from '../../Slices/Appointment.slice'
import { useDispatch } from 'react-redux'

function EditSchedule(props) {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const location = useLocation()
  const pateintData = location?.state
  const { id } = useParams()
  const [selected, setSelected] = useState(new Date())
  const [showStatus, setShowStatus] = useState(statusList)
  const [active, setActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const { datas: paitents } = pateintData
  console.log('Patient Info Data', paitents)
  const PatientsInfo = {
    apt_id: paitents?.apt_id || '',
    name: paitents?.Patient?.name || paitents?.name || '',
    email: paitents?.Patient?.email || paitents?.email || '',
    phone: paitents?.Patient?.phone || paitents?.phone || '',
    type: paitents?.AppointmentType?.type || paitents?.appointmentType || '',
    dentist:
      paitents?.AppointmentType?.Dentist?.name || paitents?.dentist || '',
    gender: paitents?.Patient?.gender || paitents?.gender || '',
    dob: paitents?.Patient?.dob || paitents?.dob || '',
    start_time: paitents?.start_time || '',
    end_time: paitents?.end_time || '',
    status: paitents?.status || '',
  }
  const [aptDate, setAptDate] = useState(
    dayjs(new Date(PatientsInfo?.start_time.toString())).format('YYYY-MM-DD')
  )

  // use this
    // useEffect(()=>{
    //   dispatch(getAppointmentById({ id })).unwrap().then(x => {
    //     console.log(x, "getAppointmentById");
    //   })
    // }, []);

  // const EasternTimezone = "America/New_York";
  // const apt_id=pateintData?.datas?.apt_id;
  // console.log(pateintData?.datas, "pateintData.datas");

  // const patientData = {
  //   name: pateintData.
  // }
  // const patient = JSON.parse(JSON.stringify(pateintData?.datas?.Patient))
  // console.log(
  //   "patientStartHour",
  //   new Date(pateintData?.datas?.start_time.toString()).getHours()
  // );
  // console.log(
  //   "aaaaaaaaaaaaaaaaaaaaaa",
  //   pateintData?.datas?.start_time.toString().slice(0, 10)
  // );
  // console.log(`${new Date(
  //   pateintData?.datas?.start_time.toString()
  // ).getHours()} : ${new Date(
  //   pateintData?.datas?.start_time.toString()
  // ).getMinutes()}`,"startTime Edit");

  // console.log( `${new Date(
  //   pateintData?.datas?.end_time.toString()
  // ).getHours()} : ${new Date(
  //   pateintData?.datas?.end_time.toString()
  // ).getMinutes()}`,"endTime Edit");

  console.log('aptDate', aptDate)

  // const [aptDate, setAptDate] = useState(
  //   moment.tz(pateintData?.datas?.start_time, 'America/New_York').format('YYYY-MM-DD')
  // );

  // console.log("aptDate",aptDate);
  const [editPateintInfo, setEditPatientInfo] = useState({
    // date: new Date(pateintData?.datas?.start_time),
    startTime: new Date(PatientsInfo?.start_time).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }),
    endTime: new Date(PatientsInfo?.end_time).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }),
    status: PatientsInfo?.status.toLowerCase(),
    phone: PatientsInfo?.phone,
    email: PatientsInfo?.email,
    patientName: PatientsInfo?.name,
    dentistName: PatientsInfo?.dentist,
  })
  // const date = pateintData?.datas?.start_time.slice(0, 10);

  const handleAllStatus = currStatus => {
    console.log('currStatus: ', currStatus)
    const newStatus = statusList.filter(st => st !== currStatus)
    console.log(newStatus, 'newStatus')
    setShowStatus(newStatus)
  }

  const handleDateChange = date => {
    console.log('formattedDate', dayjs(date).format('YYYY-MM-DD'))
    setAptDate(dayjs(date).format('YYYY-MM-DD'))

    // console.log("formattedDate", moment(date).tz('America/New_York').locale('en').format("YYYY-MM-DD"));
    // setAptDate(moment(date).tz('America/New_York').locale('en').format("YYYY-MM-DD"));
  }

  // const handleDateChange = (date) => {
  //   // const newDate = moment(date).tz('America/New_York').format('YYYY-MM-DD');
  //   console.log('formattedDate', date);
  //   setAptDate(date);
  // };

  const handleInputChange = event => {
    const target = event.target
    const value = target.value
    const name = target.name
    console.log('Status', { [name]: value })

    setEditPatientInfo({
      ...editPateintInfo,
      [name]: value,
    })
  }

  const handleStartTime = time => {
    const currentInfo = { ...editPateintInfo }
    const timeOnly = dayjs(time).format('HH:mm')
    // console.log(timeOnly, "timeOnlyyyyy");
    // Update the endTime field with the selected time
    currentInfo.startTime = timeOnly

    console.log(currentInfo, 'handleStartTime')
    setEditPatientInfo({ ...editPateintInfo, startTime: currentInfo.startTime })
    // Update the state variable with the new value
    // setEditPatientInfo(currentInfo);
    // setEditPatientInfo({
    //   ...editPateintInfo,
    //   startTime: time,
    // });
  }

  const handleEndTime = time => {
    const currentInfo = { ...editPateintInfo }
    const timeOnly = dayjs(time).format('HH:mm')
    currentInfo.endTime = timeOnly
    console.log(currentInfo, 'handleEndTime')
    setEditPatientInfo(currentInfo)
  }
  const convertTo24Hour = time => {
    var hours = parseInt(time.substr(0, 2))
    var minutes = parseInt(time.substr(3, 2))

    if (time.indexOf('AM') !== -1 && hours === 12) {
      hours -= 12
    } else if (time.indexOf('PM') !== -1 && hours !== 12) {
      hours += 12
    }

    var hoursStr = hours.toString().padStart(2, '0')
    var minutesStr = minutes.toString().padStart(2, '0')
    var result = `${hoursStr}:${minutesStr}`
    return result
  }
  const handleTime = (date, time) => {
    console.log(date, 'rrrr')
    console.log('time', time)
    // const d1 = new Date(date);
    const time24 = convertTo24Hour(time)
    const dateTime = date + ' ' + time24
    console.log(dateTime, 'rrrrass')
    // console.log(time.split(":")[0].padStart(2, '0'), " = ", time.split(":")[1].slice(0,2), "handleTime");
    // d1.setHours(time.split(":")[0].padStart(2, '0'));
    // d1.setMinutes(time.split(":")[1].slice(0,2) || "00");
    // d1.setSeconds(0);
    // d1.setMilliseconds(0);
    // console.log(d1, "handleTime");
    return dateTime
  }

  const handleSubmit = async e => {
    e.preventDefault()
    console.log('Edit Patient Info', editPateintInfo)
    const st_time = handleTime(aptDate, editPateintInfo?.startTime.toString())
    const end_time = handleTime(aptDate, editPateintInfo?.endTime.toString())
    console.log(st_time, end_time, 'ssssssssssssssssssssssssssssss')
    if(new Date(st_time) > new Date(end_time)){
      return NotificationWithIcon('error', "Please select correct time")
    }
    // else if(new Date(st_time) < new Date()){
    //   return NotificationWithIcon('error', "Can't add appoinment of past time")
    // }
    setLoading(true)
    const dataToBeSend = {
      ...editPateintInfo,
      startTime: st_time,
      endTime: end_time,
    }
    console.log(dataToBeSend, 'dataToBeSend')
    axios
      .put(
        process.env.REACT_APP_BACKEND_API_URL +
          `/api/appointment/update/${PatientsInfo?.apt_id}`,
        dataToBeSend,
        { headers: authHeader() }
      )
      .then(res => {
        console.log('Res', res.data)
        NotificationWithIcon('success', 'Successfully Updated Appointment')
        setLoading(false)
        navigate(-1)
      })
      .catch(error => {
        console.log(error)
        NotificationWithIcon('error', "Can't Update Appointment")
        setLoading(false)
      })
  }

  const disabledDate = current => {
    // Disable dates before today
    return current && current.isBefore(dayjs().startOf('day'))
  }

  // console.log(editPateintInfo.date,"assssssssssssssssssssssssssssssssss");
  console.log(aptDate, 'aptDate')
  return (
    <div>
      <div className='flex justify-center  py-6 px-16'>
        <div className='py-10 px-4 md-px-10 m-4 border-2 bg-white border-slate-200 drop-shadow-lg w-[15pc] sm:w-[20pc] md:w-[25pc] lg:w-[45pc] xl:w-[65%] rounded-[10px]'>
          <div>
            <p className='mb-3'>
              Edit Patients Info<span className='text-[red]'>*</span>
            </p>
            <form onSubmit={handleSubmit}>
              <div className=''>
                <p className='text-[20px] font-semibold font-sans capitalize'>
                  {PatientsInfo.type}
                </p>
                <div className='flex'>
                  <img src={dr} alt='dr1' className='ml-[-20px]' />
                  <p className='mt-4 ml-[-10px] font-medium text-[#BABABA] capitalize'>
                    with {PatientsInfo.dentist}
                  </p>
                </div>
                <hr className='border-t-2 mt-[-10px] border-[#71d3c3]'></hr>
                <div className='grid grid-cols-2 pt-2 px-4 gap-6'>
                  <div className='col-span-1 rounded-[10px]'>
                    <div className='mb-3'>
                      <p className='text-[#BABABA]'>Date</p>
                      {/* <p>
                        {pateintData?.datas?.start_time.slice(0, 10)}
                      </p> */}
                      {/* <DatePicker defaultValue={dayjs('2015-06-06', "yyyy-MM-dd")} /> */}
                      {/* <DatePicker
                        selected={new Date(aptDate)}
                        // value={editPateintInfo.date}
                        // defaultValue={dayjs(pateintData?.datas?.start_time.toString().slice(0, 10), "yyyy-MM-dd")}
                        // defaultValue={dayjs("2023-03-13", "yyyy-MM-dd")}
                        onChange={handleDateChange}
                        dateFormat="yyyy-MM-dd"
                        // placeholderText="Appointment Date"
                        className="border-b-2 border-slate-200 w-[150px] py-1 text-red-900"
                        name="Appointment Date"
                      /> */}

                      <Space direction='vertical'>
                        <DatePicker
                        showToday={false}
                          format={'DD/MM/YY'}
                          onChange={handleDateChange}
                          selected={dayjs(aptDate).toDate()}
                          defaultValue={dayjs(aptDate, 'YYYY-MM-DD')}
                          // selected={aptDate}
                          placeholderText='Appointment Date'
                          className='border-b-2 border-slate-200 w-[150px] py-1 text-red-900'
                          name='Appointment Date'
                          disabledDate={disabledDate}
                        />
                      </Space>
                    </div>

                    <div>
                      <p className='text-[#BABABA]'>Pateint Name</p>
                      <p className='capitalize'>{PatientsInfo.name}</p>
                    </div>

                    <div className=''>
                      <p className='text-[#BABABA] '>Appointment Type</p>
                      <p className='capitalize'>{PatientsInfo.type} </p>
                    </div>
                    <div className=''>
                      <p className='text-[#BABABA] '>Status</p>
                      <DropDown
                        arr={showStatus}
                        callback={(key, value) => {
                          setEditPatientInfo({
                            ...editPateintInfo,
                            [key]: value,
                          })
                          handleAllStatus(value)
                        }}
                        _for={'status'}
                        size='middle'
                        req_msg={'Status'}
                        maxWidth='150px'
                        width='150px'
                        defaultValue={editPateintInfo.status}
                      />
                    </div>
                    {/* <div className="">
                      <p className="text-[#BABABA] ">Status</p>
                      <select
                        name="status"
                        defaultValue={editPateintInfo.status}
                        onChange={handleInputChange}
                        className="px-6 sm:px-4 md:px-10 lg:px-6 xl:px-6 ml-3 py-2 rounded-lg drop-shadow-lg"
                      >
                        <option value="booked">Booked</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div> */}

                    <div className=''>
                      <p className='text-[#BABABA] '>Phone No</p>
                      <p className='capitalize'>{PatientsInfo.phone} </p>
                    </div>

                    <div className=''>
                      <p className='text-[#BABABA] '>Email</p>
                      <p>{PatientsInfo.email} </p>
                    </div>
                  </div>

                  <div className='ml-4'>
                    <div className='px-4'>
                      <p className='text-[#BABABA] '>Start Time</p>
                      {/* <p className="capitalize">
                        {pateintData?.datas?.start_time.slice(11, 16)}
                      </p> */}
                      <TimePicker
                        // value={editPateintInfo.startTime}
                        defaultValue={dayjs(
                          editPateintInfo.startTime,
                          'HH:mm A'
                        )}
                        onChange={handleStartTime}
                        minuteStep={5}
                        secondStep={60}
                        hourStep={1}
                        use12Hours
                        format='h:mm a'
                      />
                    </div>

                    <div className='px-4'>
                      <p className='text-[#BABABA] '>End Time</p>
                      {/* <p className="capitalize">
                        {pateintData?.datas?.end_time.slice(11, 16)}
                      </p> */}
                      <TimePicker
                        // value={editPateintInfo.endTime}
                        defaultValue={dayjs(editPateintInfo.endTime, 'HH:mm A')}
                        onChange={handleEndTime}
                        minuteStep={5}
                        secondStep={60}
                        hourStep={1}
                        use12Hours
                        format='h:mm a'
                      />
                    </div>

                    {/* <div className="px-4">
                      <p className="text-[#BABABA] ">Duration</p>
                      <p className="capitalize">
                        {pateintData?.datas?.AppointmentType.duration}
                      </p>
                    </div> */}

                    <div className='px-4'>
                      <p className='text-[#BABABA] '>Gender</p>
                      <p className='capitalize'>{PatientsInfo.gender}</p>
                    </div>

                    <div className='px-4'>
                      <p className='text-[#BABABA] '>Dob</p>
                      <p className='capitalize'>
                        {dayjs(PatientsInfo.dob).format('DD/MM/YY')}
                      </p>
                    </div>

                    {/* <div className="px-4">
                      <p className="text-[#BABABA] ">Age</p>
                      <p className="capitalize">
                        {val - (showPopupData.extendedProps.Patient.dob)}</p>
                    </div> */}
                  </div>
                </div>
              </div>

              <div className='text-center mt-[50px] flex gap-x-4 '>
                <button
                  onClick={() => navigate('/schedule')}
                  className='w-full rounded-lg bg-gradient-to-r hover:from-[#b3b3b3] hover:to-[#9f9e9e] from-[#dfdede] to-[#cbcaca] flex items-center justify-center
               site p-2 '
                >
                  Back
                </button>
                <button
                  className='w-full rounded-lg bg-gradient-to-r text-white hover:from-dashboard-green hover:to-sea-green from-sea-green to-dashboard-green flex items-center justify-center
               site p-2 '
                  type='submit'
                >
                  SUBMIT
                  <span>
                    <ClipLoader
                      cssOverride={{
                        display: 'block',
                        marginLeft: '1rem',
                        borderColor: 'white',
                      }}
                      color={'black'}
                      loading={loading}
                      size={20}
                    />
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditSchedule
