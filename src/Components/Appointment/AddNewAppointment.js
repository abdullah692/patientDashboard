import { useState } from 'react'
import { ClipLoader } from 'react-spinners'
import { Button, DatePicker, Input, TimePicker, Form } from 'antd'
import dayjs from 'dayjs'
import 'dayjs/locale/en' // Load the English language pack
import 'dayjs/plugin/timezone'
import { Menu, Dropdown } from 'antd'
import {
  DownOutlined,
  UserOutlined,
  MobileOutlined,
  MailOutlined,
} from '@ant-design/icons'
import dr from '../../assets/images/profile.png'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  appointmentBooked,
  getAppointmentTypes,
  getAvailibility,
} from '../../Slices/Appointment.slice'
import { NotificationWithIcon } from '../../Utils/Notification'
import { useLocation, useNavigate } from 'react-router-dom'
import { addTenMinutes } from '../../Utils/time_date'
import { getAllAppointments } from '../../Slices/Dashboard.slice'
import DropDown from '../DropDown/Dropdown'
import DatePickers from '../DateTimePicker/DatePickers'
import { getDentistList, getInsurance } from '../../Slices/Dentist.slice'
import { statusList } from "../../Utils/utils";

const AddNewAppointment = () => {
  const [form] = Form.useForm()
  const location = useLocation()
  const apmntDate = location?.state?.datas
  const [loading, setLoading] = useState(false)
  const [availibility, setAvailibility] = useState([])
  const [aptDate, setAptDate] = useState({
    date: dayjs(new Date()).format('YYYY-MM-DD'),
    dayOfWeek: '',
  })
  const [patientinfo, setPatientinfo] = useState({
    aptDate: apmntDate.toString().slice(0, 10),
    startTime: new Date(apmntDate)
      .toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
      .padStart(5, '0'),
    endTime: addTenMinutes(apmntDate),
    appointmentType: '',
    status: '',
    phone: '',
    email: '',
    fname: '',
    lname: '',
    gender: '',
    dob: '',
    maritalStatus: '',
    provider: '',
    insurenceType: '',
  })
  // console.log(patientinfo, "patientinfo");
  const user = useSelector(state => state.auth.user)
  const dentistList = useSelector(state => state.Dentist.dentistList);
  const insurenceList = useSelector(state => state.Dentist.insurenceList);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const appointmentTypes = useSelector(
    state => state.Appointment.appointmentTypes
  )

  useEffect(() => {
    console.log(apmntDate, "apmntDate");
    // dispatch(getAppointmentTypes())
    dispatch(getDentistList())
    dispatch(getInsurance())
    handleDateChange(apmntDate)
  }, [])

  const handleInputChange = e => {
    setPatientinfo({ ...patientinfo, [e.target.name]: e.target.value })
  }

  const handleDateChange = date => {
    console.log('formattedDate', dayjs(date).format('YYYY-MM-DD'))
    if (dayjs(date).format('YYYY-MM-DD') == 'Invalid Date') {
      setAptDate({ date: null, dayOfWeek: null })
      return
    }
    const dayOfWeek = dayjs(date).locale('en').format('dddd')
    console.log(dayOfWeek, 'dayOfWeek')
    setAptDate({ date: dayjs(date).format('YYYY-MM-DD'), dayOfWeek })
  }

  const handleTime = (time, _for) => {
    console.log(time, 'timeeee')
    if (time === null) {
      setPatientinfo({ ...patientinfo, [_for]: '' })
      return
    }
    const timeOnly = dayjs(time).format('HH:mm')
    console.log(timeOnly, 'timeOnly', _for)
    setPatientinfo({ ...patientinfo, [_for]: timeOnly })
    form.setFieldValue({ [_for]: timeOnly })
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
  const combineDateAndTime = (date, time) => {
    console.log(date, 'rrrr')
    const time24 = convertTo24Hour(time)
    const dateTime = date + ' ' + time24
    console.log(dateTime, 'rrrr')
    return dateTime
  }

  const covertTimeToLocalTime = time => {
    return dayjs(time, 'HH:mm').locale('en').format('h:mm')
  }

  const handleSubmit = values => {
    // e.preventDefault();
    const dataToBeSubmit = { ...patientinfo }

    if (new Date(patientinfo.dob).getTime() >= new Date().getTime()) {
      NotificationWithIcon(
        'error',
        'Date Of Birth Must be less than todays date'
      )
      return
    }
    if (!aptDate.date) {
      NotificationWithIcon('error', 'Please Select Appointment Date')
      return
    }
    if (!patientinfo.startTime) {
      NotificationWithIcon('error', 'Please Select Appointment Start Time')
      return
    }
    if (!patientinfo.endTime) {
      NotificationWithIcon('error', 'Please Select Appointment End Time')
      return
    }
    if (!availibility.length === 0) {
      NotificationWithIcon('error', 'No Time Available')
      return
    }

    setLoading(true)

    const dentist = dentistList?.filter(
      x => x?.name === patientinfo?.provider
    )[0]

    const avail_day = availibility?.filter(
      av => av.days === aptDate.dayOfWeek.toLowerCase()
    )[0]

    console.log(avail_day, 'avail_day')
    if(!avail_day){
      setLoading(false);
      return NotificationWithIcon("error", `Provider is not available on ${aptDate?.dayOfWeek}`)
    }
    const av_st_time = dayjs(avail_day?.start_time, 'HH:mm:ss').format('HH:mm')
    const av_end_time = dayjs(avail_day?.end_time, 'HH:mm:ss').format('HH:mm')
    const sel_st_time = dayjs(
      dataToBeSubmit?.startTime.toString(),
      'HH:mm'
    ).format('HH:mm')
    const sel_end_time = dayjs(
      dataToBeSubmit?.endTime.toString(),
      'HH:mm'
    ).format('HH:mm')
    console.log(
      'av_st_time = ',
      av_st_time,
      ' sel_st_time= ',
      sel_st_time,
      ' av_end_time= ',
      av_end_time,
      ' sel_end_time= ',
      sel_end_time
    )
    if (sel_st_time < av_st_time || sel_end_time > av_end_time) {
      NotificationWithIcon('error', 'Provider is not available at this time')
      setLoading(false)
      return
    }

    // compare
    if (sel_st_time > sel_end_time) {
      NotificationWithIcon('error', 'Start Time must be less than End Time')
      setLoading(false)
      return
    }
    const appmntType = appointmentTypes?.filter(
      x => x?.type === patientinfo?.appointmentType
    )[0]

    dataToBeSubmit.startTime = combineDateAndTime(
      aptDate?.date,
      dataToBeSubmit?.startTime
    )
    dataToBeSubmit.endTime = combineDateAndTime(
      aptDate?.date,
      dataToBeSubmit?.endTime
    )
    dataToBeSubmit.atId = appmntType.id
    dataToBeSubmit.priority = appmntType.priority
    // dataToBeSubmit.dp_id = user.dp_id
    dataToBeSubmit.d_id = dentist.id
    dataToBeSubmit.avId = avail_day.id

    const insurance = insurenceList.filter(x => x.type === patientinfo.insurenceType)[0];
    dataToBeSubmit.insId = insurance.id;

    // Delete Extra info
    delete dataToBeSubmit.aptDate
    delete dataToBeSubmit.appointmentType
    delete dataToBeSubmit.patientName
    delete dataToBeSubmit.provider
    delete dataToBeSubmit.insurenceType

    console.log(dataToBeSubmit, 'submittedd')
    dispatch(appointmentBooked(dataToBeSubmit))
      .unwrap()
      .then(x => {
        if (x.message) {
          NotificationWithIcon('success', 'Appointment Successfully Booked')
          dispatch(getAllAppointments())
          navigate('/schedule')
        } else {
          NotificationWithIcon('error', "Can't Add Appointment at this time")
        }
        setLoading(false)
      })
      .catch(e => {
        console.log(e, 'error: AddNewApmnt')
        NotificationWithIcon('error', e.message)
        setLoading(false)
      })

    // Removed
    // setLoading(false);
  }

  const menuForApmntType = (
    <Menu
      onClick={e => {
        setPatientinfo({ ...patientinfo, appointmentType: e.key })
        form.setFieldsValue({ apmntType: e.key })
      }}
    >
      {appointmentTypes?.map(apmntType => (
        <Menu.Item key={apmntType?.type}>{apmntType?.type}</Menu.Item>
      ))}
    </Menu>
  )

  const handleProvideChange = (key, value) => {
    setPatientinfo({ ...patientinfo, [key]: value })
    form.setFieldsValue({ [key]: value })

    const dentist = dentistList?.filter(x => x?.name === value)[0];

    dispatch(getAppointmentTypes({ Docid: dentist.id }));
    dispatch(getAvailibility({ Docid: dentist.id }))
      .unwrap()
      .then(x => {
        setAvailibility(x.data)
      })
  }

  return (
    <div>
      <div className='flex justify-center sm:px-5 md:px-10 lg:px-16 min-h-screen'>
        <div className='py-10 px-4 md-px-10 m-4 border-2 h-fit bg-white border-slate-200 drop-shadow-lg w-[15pc] sm:w-[90%] md:w-[80%] lg:w-[45pc] xl:w-[65%] rounded-[10px]'>
          <div>
            <p className='mb-6 text-xl'>
              Add Patients Info<span className='text-[red]'>*</span>
            </p>
            <Form form={form} onFinish={handleSubmit}>
              <div className=''>
                <hr className='border-t-2 mt-[-10px] border-[#71d3c3]'></hr>
                <div className='grid grid-cols-2 pt-2 px-4 gap-6 mt-5'>
                  <div className='col-span-1 rounded-[10px]'>
                    <div className='mb-2'>
                      <p className='text-[#BABABA]'>Date</p>
                      <DatePickers
                        defaultValue={dayjs(apmntDate.toString().slice(0, 10))}
                        callback={date => handleDateChange(date)}
                        required={false}
                        _for={'aptDate'}
                        req_msg={'Appointment Date'}
                      />
                    </div>
                    <div className="mb-2">
                      <p className="text-[#BABABA] ">Provider</p>
                      <DropDown arr={dentistList?.map(x => x.name)} 
                        callback={(key, value)=> handleProvideChange(key, value)}
                        _for={"provider"}
                        size="middle"
                        req_msg={"Provider"}
                      />
                    </div>

                        <div className="mb-2">
                          <p className="text-[#BABABA]">Pateint First Name</p>
                          <Form.Item  
                              style={{ marginBottom: 0 }}
                              name="fname"
                              rules={[
                                {
                                  required: true,
                                  message: 'Please Enter Patient First Name',
                                },
                              ]}
                          >
                            <Input
                            name="fname"
                            onChange={handleInputChange} placeholder="Enter First Name" style={{ width:180, }} prefix={<UserOutlined />} />
                          </Form.Item>
                        </div>
                        <div className="mb-2">
                          <p className="text-[#BABABA]">Pateint Last Name</p>
                          <Form.Item
                              style={{ marginBottom: 0 }}
                              name="lname"
                              rules={[
                                {
                                  required: true,
                                  message: 'Please Enter Patient Last Name',
                                },
                              ]}
                          >
                            <Input
                            name="lname"
                            onChange={handleInputChange} placeholder="Enter Last Name" style={{ width:180, }} prefix={<UserOutlined />} />
                          </Form.Item>
                        </div>
    
                        <div className="mb-2">
                          <p className="text-[#BABABA] ">Appointment Type</p>
                          <Form.Item 
                              style={{ marginBottom: 0 }}
                              name="apmntType"
                              valuePropName={patientinfo.appointmentType}
                              rules={[
                                {
                                  required: true,
                                  message: 'Please Select Appointment Type',
                                },
                              ]}
                          >
                            <Dropdown overlay={menuForApmntType}>
                              <Button style={{ width:180, overflow: "hidden"}}>
                                  {patientinfo?.appointmentType?.length > 20 ? patientinfo?.appointmentType?.slice(0,15)+"..."  : patientinfo?.appointmentType === "" ? "Appointment Type" : patientinfo?.appointmentType} <DownOutlined />
                              </Button>
                            </Dropdown>
                          </Form.Item>
                        </div>
                        <div className="mb-2">
                          <p className="text-[#BABABA] ">Status</p>
                          <DropDown arr={statusList} 
                            callback={(key, value)=>{setPatientinfo({ ...patientinfo, [key]: value }); form.setFieldsValue({ [key]: value })}}
                            _for={"status"}
                            size="middle"
                            req_msg={"Status"}
                          />
                        </div>
    
                        <div className="mb-2">
                          <p className="text-[#BABABA] ">Email</p>
                          <Form.Item 
                            style={{ marginBottom: 0 }}
                            name="email"
                            rules={[
                              {
                                required: true,
                                message: 'Please Enter Email Address',
                              },
                            ]}
                          >
                           <Input name="email" value={patientinfo.email} onChange={handleInputChange} placeholder="john@techdrop.com" style={{ width:180, }} prefix={<MailOutlined />} />
                          </Form.Item>
                        </div>
                      </div>
    
                      <div className="ml-4">
                        <div className="px-4 mb-2">
                          <p className="text-[#BABABA] ">Start Time</p>
                          <Form.Item 
                            style={{ marginBottom: 0 }}
                            name="startTime"
                          >
                          <TimePicker
                            style={{ width:180 }}
                            defaultValue={dayjs(patientinfo.startTime, "HH:mm")}
                            onChange={(time)=> handleTime(time, "startTime")}
                            minuteStep={5}
                            secondStep={60}
                            hourStep={1}
                            use12Hours
                            format="h:mm a"
                          />
                          </Form.Item>
                        </div>
    
                        <div className="px-4 mb-2">
                          <p className="text-[#BABABA] ">End Time</p>
                          <Form.Item 
                            style={{ marginBottom: 0 }}
                            name="endTime"
                          >
                            <TimePicker
                              style={{ width:180 }}
                              defaultValue={dayjs(patientinfo.endTime, "HH:mm")}
                              onChange={(time)=> handleTime(time, "endTime")}
                              minuteStep={5}
                              secondStep={60}
                              hourStep={1}
                              use12Hours
                              format="h:mm a"
                            />
                          </Form.Item>
                        </div>
    
                        <div className="px-4 mb-2">
                          <p className="text-[#BABABA] ">Gender</p>
                          <DropDown size='middle' width="180px" maxWidth="180px" _for={"gender"}
                            arr={["male", "female"]}
                            req_msg={"Gender"}
                            callback={(key, value)=>{setPatientinfo({ ...patientinfo, [key]: value }); form.setFieldsValue({ [key]: value })}} />
                        </div>
                        
                        <div className="px-4 mb-2">
                          <p className="text-[#BABABA] ">Marital Status</p>
                          <DropDown size='middle' width="180px" maxWidth="180px" _for={"maritalStatus"} req_msg="Marital Status"
                            arr={["single", "married", "divorced", "widowed"]}
                            callback={(key, value)=>{setPatientinfo({ ...patientinfo, [key]: value }); form.setFieldsValue({ [key]: value })}} />
                        </div>
    
                        <div className="px-4 mb-2">
                          <p className="text-[#BABABA] ">Date Of Birth</p>
                          <DatePickers size='middle' callback={(date) => setPatientinfo({ ...patientinfo, dob: date})} _for={"dob"} req_msg={"Date Of Birth"} />
                        </div>
                        <div className="mb-2 ml-4">
                          <p className="text-[#BABABA] ">Phone No</p>
                          <Form.Item 
                            style={{ marginBottom: 0 }}
                            name="phone"
                            rules={[
                              {
                                required: true,
                                message: 'Please Enter Mobile Number',
                              },
                            ]}
                          >
                            <Input name="phone" value={patientinfo.phone} onChange={handleInputChange} placeholder="+923400000000" style={{ width:180, }} prefix={<MobileOutlined />} />
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                  </div>
                    <div className='mb-2 ml-4'>
                      <p className='text-[#BABABA] '>Insurance Type</p>
                      <DropDown
                        arr={insurenceList.map(x => x.type)}
                        callback={(key, value) => {
                          setPatientinfo({ ...patientinfo, [key]: value })
                          form.setFieldsValue({ [key]: value })
                        }}
                        _for={'insurenceType'}
                        size='middle'
                        req_msg={'Insurance Type'}
                      />
                    </div>
                  {/* </div> */}
                {/* </div> */}
              {/* </div> */}

              <div className='text-center mt-[30px] '>
                <button
                  disabled={loading}
                  className={`w-full rounded-lg bg-gradient-to-r text-white from-sea-green to-dashboard-green ${
                    loading
                      ? ''
                      : 'hover:from-dashboard-green hover:to-[#10967f]'
                  }  flex items-center justify-center
                   site p-2 `}
                  type='submit'
                >
                  Add Appointment
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
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddNewAppointment
