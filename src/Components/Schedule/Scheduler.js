import React, { useState, useRef, useEffect } from 'react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import FullCalendar from '@fullcalendar/react'
import interactionPlugin from '@fullcalendar/interaction'
import { Popup } from 'reactjs-popup'
import { IoClose } from 'react-icons/io5'
import { Button, Dropdown, Menu, Tooltip } from 'antd'
import axios from 'axios'
import dr from '../../assets/images/profile.png'
import { FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import { useNavigate } from 'react-router'
import { DownOutlined, LoadingOutlined } from '@ant-design/icons'
import { NotificationWithIcon } from '../../Utils/Notification'
import { ClipLoader, PropagateLoader, RiseLoader } from 'react-spinners'
import { useDispatch, useSelector } from 'react-redux'
import {
  deleteAppointment,
  getAllAppointmentDispatch,
  updatedAptPriority,
} from '../../Slices/Appointment.slice'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import { statusList } from '../../Utils/utils'
import DropDown from '../DropDown/Dropdown'
import timeGridWeekPlugin from '@fullcalendar/timegrid'
import '../../App.css'
import DropDownComp from '../DropDown/DropdownComp'
import { getDentistList } from '../../Slices/Dentist.slice'
import authHeader from '../../Services/authHeader'
import dayjs from 'dayjs'
import PopUp from '../../Utils/PopUp'
import { fetchGroupById } from '../../Slices/Group.slice'
import FullPageLoader from '../../Utils/FullPageLoader'
import CalendarSch from './CalendarSch'
import { getAllApt } from '../../Slices/Dashboard.slice'

function Scheduler({ groupId, memberId }) {
  // const [schedulerEvents,setSchedulerEvents]=useState(events);

  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [groupLoading, setGroupLoading] = useState(false)
  const [updStatusLoading, setUpdStatusLoading] = useState(false)
  const [dltApmntLoading, setDltApmntLoading] = useState(false)
  const [openPopup, setOpenPopup] = useState(false)
  const [showPopupData, setshowPopupData] = useState()
  const [showStatus, setShowStatus] = useState(statusList)
  const [fullCalendarEvent, setFullCalendaEvent] = useState()
  const [selectedOption, setSelectedOption] = useState(null)
  const [updatedApt, setUpdatedApt] = useState(null)
  const [dentistNameList, setDentistName] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [selectedDentistName, setSelectedDentistName] = useState(null)
  const [currentDate, setCurrentDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [eventsForMem, setEventsForMem] = useState({})
  const [selectedGroup, setSelectedGroup] = useState({})

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const getAllAptDetail = useSelector(getAllApt)
  const group = useSelector(state => state.Group.group)
  const groupNameList = useSelector(state => state.Group.groupNameList)
  const groupMember = useSelector(state => state.Group.groupMember)
  const appoinmentList = useSelector(state => state.Appointment.appoinmentList)
  // const calendarRef = useRef(group.GroupMembers.map(x => React.createRef([])));

  console.log(appoinmentList, 'appoinmentList')
  console.log(groupNameList, 'groupNameList')

  const inputRoom = process.env.RESOURCE_CALENDAR_ROOM || 3
  console.log({ inputRoom })
  const rooms = []
  for (let i = 1; i <= inputRoom; i++) {
    console.log(i, `rooms${i}`, 'valllyyy')
    rooms.push({ id: `${i}`, title: `P ${i}` })
  }

  const dentistName = async () => {
    dispatch(getDentistList())
      .unwrap()
      .then(x => {
        console.log(x, 'xxxxxxxxxxxxxxxProvider')
        const data = x.map(x => ({
          name: x.name,
          id: x.id,
          profession: x.profession,
        }))
        setSelectedDentistName(data[0])
        setDentistName(data)
      })
  }

  const todayDate = new Date()
  const day = String(todayDate.getDate()).padStart(2, '0') // Get the day component and add leading zeros if necessary
  const month = String(todayDate.getMonth() + 1).padStart(2, '0') // Get the month component and add leading zeros if necessary
  const year = todayDate.getFullYear() // Get the year component
  const val = `${year}-${month}-${day}`
  console.log(val)

  function handleMenuClick(key, value, apmnt_id) {
    setUpdStatusLoading(true)
    const selectedOptionToBeRemoved = selectedOption

    setSelectedOption(value)
    // const apt_id = showPopupData.extendedProps.apt_id
    // let dataToBeSend = {
    //   startTime: new Date(showPopupData.extendedProps.start_time),
    //   endTime: new Date(showPopupData.extendedProps.end_time),
    //   status: value,
    //   phone: showPopupData.extendedProps.Patient.phone,
    //   email: showPopupData.extendedProps.Patient.email,
    //   patientName: showPopupData.extendedProps.Patient.name,
    //   dentistName: showPopupData.extendedProps.AppointmentType.Dentist.name,
    // }
    let apmnt = appoinmentList.find(x => x.id === apmnt_id);
    console.log(apmnt, "apmntapmntapmnt", apmnt_id);
    let dataToBeSend = {
      startTime: new Date(apmnt.start_time),
      endTime: new Date(apmnt.end_time),
      status: value,
      phone: apmnt?.patient?.phone,
      email: apmnt?.patient?.email,
      patientName: apmnt.dependent ? apmnt?.dependent?.name : apmnt?.patient?.name,
      dentistName: apmnt?.AppointmentType?.Dentist?.name,
    }
    console.log(dataToBeSend, 'dataToBeSend2', apmnt_id)

    axios
      .put(
        process.env.REACT_APP_BACKEND_API_URL +
          `/api/appointment/update/${apmnt_id}`,
        dataToBeSend,
        { headers: authHeader() }
      )
      .then(async res => {
        console.log('Res', res.data)
        NotificationWithIcon('success', 'Successfully Updated Appointment')
        await handleApi()
        setUpdStatusLoading(false)
      })
      .catch(error => {
        console.log(error)
        NotificationWithIcon('error', "Can't Update Appointment")
        setSelectedOption(selectedOptionToBeRemoved)
        setUpdStatusLoading(false)
      })
  }

  const handleAllStatus = currStatus => {
    console.log('currStatus: ', currStatus)
    const newStatus = statusList.filter(st => st !== currStatus)
    console.log(newStatus, 'newStatus')
    setShowStatus(newStatus)
  }

  const handleEventClick = info => {
    setOpenPopup(true)
    console.log('HAHAHAAHAHAHA', info.event)
    const apmnt_id = info.event.extendedProps.apt_id;
    console.log(appoinmentList, "apmntapmnt2");
    let apmnt = appoinmentList.find(x => x.id === apmnt_id);
    console.log(apmnt, "apmntapmnt2", apmnt_id);
    setshowPopupData(apmnt)
    setSelectedOption(
      info.event.extendedProps.status.charAt(0).toUpperCase() +
        info.event.extendedProps.status.slice(1)
    )
    handleAllStatus(info.event.extendedProps.status)
    console.log('Events Info', info.event.extendedProps)
    // log the event object to the console
  }

  useEffect(() => {
    console.log('selectedOption = ', selectedOption)
    handleAllStatus(selectedOption?.toLowerCase())
  }, [selectedOption])

  const handleEdit = data => {
    console.log('Data Popup', data)
    // console.log('Show Popup Data', showPopupData)
    // const datas = data?.extendedProps
    const id = data?.apt_id
    navigate(`/edit-schedule/${id}`, {
      state: { datas: { ...data, status: selectedOption } },
    })
  }

  function handleDrop(data) {
    dispatch(updatedAptPriority(data))
  }

  console.log({ updatedApt })

  const filterData = (data, dentistName) => {
    const filterDentist = data.filter(
      x => x.AppointmentType.Dentist.name !== dentistName.map(x => x)
    )
    console.log(filterDentist, 'filterDentist')
  }

  const handleApi = async () => {
    // await axios
    //   .get(`${process.env.REACT_APP_BACKEND_API_URL}/api/appointment`, {
    //     headers: authHeader(),
    //   })
    dispatch(getAllAppointmentDispatch())
      .unwrap()
      .then(res => {
        console.log('appointment/Dataaaaaaaaaaaa', res)
        const formattedEvents = res.map(appointment => {
          console.log(appointment, 'dddddddddddddddddddddddddddddddddddd')
          return {
            apt_id: appointment.id,
            title: appointment.AppointmentType.type, // Use the appointment type name as the event title
            start: new Date(appointment.start_time), // Use the start_time property as the start time of the event
            end: new Date(appointment.end_time), // Use the end_time property as the end time of the event
            ...appointment,
          }
        })
        setFullCalendaEvent(res)
        setLoading(false)
        console.log(formattedEvents, 'eeeeeeeeeeeeeeeeeeeeee')
        const dentistName = formattedEvents.map(
          val => val.AppointmentType.Dentist.name
        )
        const uniqueArr = [...new Set(dentistName)]
        console.log(uniqueArr, 'uniqueArr')

        filterData(formattedEvents, uniqueArr)
        console.log(formattedEvents, 'HAHAAHAHAHAHAHAHAHAHA')
        const newArray = formattedEvents?.map((obj, i) => ({
          ...obj,
          resourceId: `${obj.priority}`,
          eventColor:
            obj.AppointmentType.color === ''
              ? 'blue'
              : obj.AppointmentType.color,
        }))
        //
        const initalData = newArray?.filter(
          x => x.AppointmentType.Dentist.name == selectedDentistName.name
        )
        console.log(initalData, 'inistallData')

        setEvents(newArray)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const providerAppoitment = dentistId => {
    const apmntForSelDentist = appoinmentList.filter(
      obj => obj.AppointmentType.d_id === dentistId
    )
    const finalApmntData = apmntForSelDentist?.map((obj, i) => {
      return {
        ...obj,
        resourceId: `${obj.priority}`,
        eventColor:
          obj.AppointmentType.color === '' ? 'blue' : obj.AppointmentType.color,
      }
    })
    return finalApmntData
  }

  useEffect(() => {
    if (groupId || memberId) {
      dispatch(getAllAppointmentDispatch())
    }
  }, [groupId, memberId, currentDate])

  useEffect(() => {
    if (events.length && selectedDentistName) {
      const initalData = events.filter(
        x => x.AppointmentType.Dentist.name == selectedDentistName.name
      )
      console.log(selectedDentistName, 'kllklklklklklklk', events)
      console.log({ initalData })

      setFilteredData(initalData)
    } else if (!events.length && selectedDentistName) {
      ;(async () => await handleApi())()
    }
  }, [events, selectedDentistName])

  useEffect(() => {
    ;(async () => {
      await dentistName()
    })()

    // let interval;
    if (
      process.env.REACT_APP_DEVELOPMENT === 'false' ||
      process.env.REACT_APP_DEVELOPMENT === false
    ) {
      // interval = setInterval(() => {
      //   console.log('Function called after every 5 seconds')
      //   handleApi()
      // }, 30000);
    }

    // return () => clearInterval(interval)
  }, [])

  function handleDateClick(arg) {
    navigate(`/addappointment`, { state: { datas: arg.dateStr.toString() } })
    // alert("Clicked on: " + arg.dateStr);
  }

  function formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [year, month, day].join('-')
  }

  const handleDelete = apmnt_id => {
    console.log(apmnt_id, 'apt_dataaaaaaa_id')
    setDltApmntLoading(true)
    dispatch(deleteAppointment({ apt_id: apmnt_id }))
      .unwrap()
      .then(async x => {
        NotificationWithIcon('success', 'Successfully Deleted Appointment')
        await handleApi()
        setOpenPopup(false)
        setDltApmntLoading(false)
      })
      .catch(e => {
        NotificationWithIcon('error', "Can't Delete Appointment")
        setDltApmntLoading(false)
      })
  }

  console.log({ events }, 'eveveveveev')
  // console.table(events)

  console.log({ dentistNameList })

  // console.log({items});

  const handleDropDown = (key, value) => {
    console.log(key, value, 'keyvalue')
    const data = dentistNameList.find(x => x.name === value)
    setSelectedDentistName(data)
    setSelectedGroup({})
    const filterData1 = events.filter(
      data => data.AppointmentType.Dentist.name == value
    )
    console.log(filterData1, 'DATA!')
    setFilteredData(filterData1)
    console.log(filterData1, 'apmnttttttttttttttttttttttttttfilterData1')
  }

  function eventContent(info) {
    console.log(info, 'infoinfo')
    return (
      <div
        className=' rounded-lg h-full p-1'
        style={{
          backgroundColor: info.event._def.extendedProps.AppointmentType.color,
        }}
      >
        {dayjs(info.event._def.extendedProps.start_time).format('hh:mm A')}
        <span> - </span>
        {dayjs(info.event._def.extendedProps.end_time).format('hh:mm A')}
        <br />
        {/* {info.timeText}
        <br /> */}
        {info.event.title}
      </div>
    )
  }

  // const handlePrevClick = () => {
  //   const calendarApi = calendarRef.current.getApi();
  //   const prevDate = calendarApi.getDate();
  //   prevDate.setDate(prevDate.getDate() - 1);
  //   calendarApi.gotoDate(prevDate);
  //   setCurrentDate(prevDate);
  // };

  // const handleNextClick = () => {
  //   const calendarApi = calendarRef.current.getApi();
  //   const nextDate = calendarApi.getDate();
  //   nextDate.setDate(nextDate.getDate() + 1);
  //   calendarApi.gotoDate(nextDate);
  //   setCurrentDate(nextDate);
  // };
  const calendarRefs = useRef([])
  const calendarRefsSingle = useRef()

  useEffect(() => {
    calendarRefs.current.forEach((ref, i) => {
      if (ref && group?.GroupMembers[i]) {
        ref.getApi().gotoDate(currentDate)
      }
    })
    calendarRefsSingle?.current?.getApi()?.gotoDate(currentDate)
  }, [currentDate, group?.GroupMembers])

  const handleNextClick = () => {
    const tomorrow = dayjs(currentDate).add(1, 'day').format('YYYY-MM-DD')
    setCurrentDate(tomorrow)
  }
  const handlePrevClick = () => {
    const yesterday = dayjs(currentDate).subtract(1, 'day').format('YYYY-MM-DD')
    setCurrentDate(yesterday)
  }
  const handleCustomDate = date => {
    const customDate = dayjs(date).format('YYYY-MM-DD')
    setCurrentDate(customDate)
  }

  const professionColor = prof => {
    let bgColor = {
      dentist: '#000',
      orthodontist: '#00008B',
      hygienist: '#17A88F',
    }
    return bgColor[prof]
  }

  console.log(group?.GroupMembers, 'groupMemberss?.Dentist')
  let groupCalenders = group?.GroupMembers?.map((mem, i) => {
    const apmnt = providerAppoitment(mem?.provider_id)
    const color = professionColor(mem?.Dentist?.profession)
    console.log(apmnt, 'apmntttttttttttttttttttttttttt', color)
    return (
      <div
        className={`${
          group.GroupMembers.length === 1
            ? 'w-full'
            : group.GroupMembers.length === 2
            ? 'min-w-[49%]'
            : 'min-w-[33%]'
        } mr-3`}
      >
        <div
          style={{ background: color }}
          className={`rounded-lg border-2 border-gray-400 w-full py-1 flex justify-center items-center flex-col`}
        >
          <div className='text-base font-semibold'>{mem?.Dentist?.name}</div>
          <div className='text-sm'>
            {mem?.Dentist?.profession?.slice(0, 1)?.toUpperCase() +
              mem?.Dentist?.profession?.slice(1)}
          </div>
        </div>
        <FullCalendar
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            interactionPlugin,
            resourceTimeGridPlugin,
            timeGridWeekPlugin,
          ]}
          allDaySlot={false}
          slotDuration={'00:05:00'}
          initialView={'resourceTimeGridDay'}
          // customButtons={{
          //   customTitle: {
          //     text: mem?.Dentist?.name,
          //     click: function () {},
          //   },
          // }}
          headerToolbar={{
            left: '',
            // center: 'customTitle',
            center: '',
            right: '',
            color: 'black',
            // left: 'prev,next today',
            // center: 'title',
            // right: 'resourceTimeGridDay,resourceTimeGridWeek',
            // color: 'black',
          }}
          ref={ref => (calendarRefs.current[i] = ref)}
          resources={rooms}
          datesAboveResources={true}
          height='calc(100vh - 270px)'
          width='600px'
          editable={true}
          selectable={true}
          displayEventTime={true}
          events={apmnt}
          schedulerLicenseKey='CC-Attribution-NonCommercial-NoDerivatives'
          eventResizableFromStart={false}
          eventStartEditable={false}
          eventDurationEditable={false}
          eventContent={eventContent}
          eventClick={handleEventClick}
          // dateClick={handleDateClick}
          eventDrop={info => {
            console.log({ info })
            const updatedAppointment = {
              apt_id: info?.event?._def?.extendedProps?.apt_id,
              resourceId: info?.event?._def?.resourceIds,
            }
            handleDrop(updatedAppointment)
          }}
          date={currentDate}
        />
      </div>
    )
  })

  useEffect(() => {
    if (selectedGroup.key) {
      setGroupLoading(true)
      dispatch(fetchGroupById({ id: selectedGroup.key }))
        .unwrap()
        .then(x => {
          setGroupLoading(false)
        })
        .catch(e => {
          console.log(e, 'fetchGroupById:scheduler')
          setGroupLoading(false)
        })
    }
  }, [selectedGroup.key])

  // Drop down of Group
  const menuForGroup = (
    <Menu
      onClick={e => {
        const selGroup = groupNameList.find(x => x.key === Number(e.key))
        setSelectedGroup(selGroup)
        setSelectedDentistName('')
      }}
    >
      {groupNameList?.map(obj => (
        <Menu.Item key={obj.key}>
          {obj?.group_name?.charAt(0)?.toUpperCase() +
            obj?.group_name?.slice(1)}
        </Menu.Item>
      ))}
    </Menu>
  )

  if (loading) {
    return (
      <div className='text-black flex justify-center items-center w-[calc(100%-50px)] h-[calc(100vh-200px)]'>
        {/* <RiseLoader color="#36d7b7" /> */}
        <PropagateLoader color='#36d7b7' />
      </div>
    )
  } else {
    console.log(currentDate, 'currentDate')
    return (
      <div className='w-full'>
        <FullPageLoader isShow={groupLoading} />

        {!groupId && !memberId && (
          <div className=' flex justify-between '>
            <div className=' flex gap-x-4'>
              <div className='py-2 text-black'>
                <span className='mr-3 text-base'>Providers:</span>
                <DropDownComp
                  size=''
                  width='250px'
                  maxWidth='430px'
                  _for={'providerName'}
                  value={
                    selectedDentistName?.name
                      ? selectedDentistName.name
                      : 'Select Provider'
                  }
                  arr={dentistNameList?.map(x => x.name)}
                  req_msg={'Provider Name'}
                  callback={handleDropDown}
                />
              </div>
              <div className='py-2 text-black'>
                <span className='mr-3 text-base'>Groups:</span>
                <Dropdown overlay={menuForGroup} placement='bottom'>
                  <Button
                    style={{
                      width: 250,
                      background: '#fff',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                    size=''
                  >
                    <span>
                      {Object.keys(selectedGroup).length === 0
                        ? 'Select Group'
                        : selectedGroup?.group_name?.charAt(0)?.toUpperCase() +
                          selectedGroup?.group_name?.slice(1)}
                    </span>{' '}
                    <span>
                      <DownOutlined />
                    </span>
                  </Button>
                </Dropdown>
              </div>
            </div>
            <CalendarSch handleCustomDate={handleCustomDate} />
          </div>
        )}

        <div className=''>
          {groupId || memberId || Object.keys(selectedGroup).length > 0 ? (
            <div>
              <div className='flex flex-col mb-2'>
                <div className='text-base text-black flex justify-between '>
                  <span>{group?.group_name}</span>
                  <span className='rounded-base bg-slate-300 px-2 shadow-md'>
                    {dayjs(currentDate).format('MM/DD/YY')}
                  </span>
                  <div className='flex gap-x-1 items-center justify-center mr-3'>
                    <button
                      onClick={handlePrevClick}
                      className='px-3 text-base font-semibold bg-[#5eccb9] text-white rounded-md hover:bg-[#3db6a2]'
                    >
                      &lt;
                    </button>
                    <button
                      onClick={handleNextClick}
                      className='px-3 text-base font-semibold bg-[#5eccb9] text-white rounded-md hover:bg-[#3db6a2]'
                    >
                      &gt;
                    </button>
                  </div>
                </div>
                {/* <div className='border-t-2 border-sea-green w-[40px]'></div> */}
              </div>
              <div className='flex w-full pr-10 overflow-auto'>
                {groupCalenders}
              </div>
            </div>
          ) : (
            <div className=''>
              <div className='flex flex-col mb-4'>
                <div className='text-base text-black flex justify-between '>
                  <span>{selectedDentistName.name}</span>
                  <span className='rounded-lg bg-slate-300 px-2 shadow-md'>
                    {dayjs(currentDate).format('MM/DD/YY')}
                  </span>
                  <div className='flex gap-x-1 items-center justify-center mr-3'>
                    <button
                      onClick={handlePrevClick}
                      className='px-3 text-base font-semibold bg-[#5eccb9] text-white rounded-md hover:bg-[#3db6a2]'
                    >
                      &lt;
                    </button>
                    <button
                      onClick={handleNextClick}
                      className='px-3 text-base font-semibold bg-[#5eccb9] text-white rounded-md hover:bg-[#3db6a2]'
                    >
                      &gt;
                    </button>
                  </div>
                </div>
                {/* <div className='border-t-2 border-sea-green w-[40px]'></div> */}
              </div>
              <div
                style={{
                  background: professionColor(selectedDentistName.profession),
                }}
                className={`rounded-lg border-2 border-gray-400 w-full py-1 flex justify-center items-center flex-col`}
              >
                <div className='text-base font-semibold'>
                  {selectedDentistName.name}
                </div>
                <div className='text-sm'>
                  {selectedDentistName?.profession?.slice(0, 1)?.toUpperCase() +
                    selectedDentistName?.profession?.slice(1)}
                </div>
              </div>
              <FullCalendar
                plugins={[
                  dayGridPlugin,
                  timeGridPlugin,
                  listPlugin,
                  interactionPlugin,
                  resourceTimeGridPlugin,
                  timeGridWeekPlugin,
                ]}
                allDaySlot={false}
                slotDuration={'00:05:00'}
                initialView={'resourceTimeGridDay'}
                // customButtons={{
                //   customTitle: {
                //     text: selectedDentistName.name,
                //     click: function () {},
                //   },
                // }}
                headerToolbar={{
                  left: '',
                  center: '',
                  right: '',
                  color: 'black',
                }}
                // headerToolbar={{
                //   left: 'prev,next today',
                //   center: 'title',
                //   right: 'resourceTimeGridDay,resourceTimeGridWeek',
                //   color: 'black',
                // }}
                resources={rooms}
                datesAboveResources={true}
                height='calc(100vh - 270px)'
                editable={true}
                selectable={true}
                displayEventTime={true}
                events={filteredData}
                schedulerLicenseKey='CC-Attribution-NonCommercial-NoDerivatives'
                eventResizableFromStart={false}
                eventStartEditable={false}
                eventDurationEditable={false}
                eventContent={eventContent}
                eventClick={handleEventClick}
                // dateClick={handleDateClick}
                eventDrop={info => {
                  console.log({ info })
                  const updatedAppointment = {
                    apt_id: info?.event?._def?.extendedProps?.apt_id,
                    resourceId: info?.event?._def?.resourceIds,
                  }
                  handleDrop(updatedAppointment)
                }}
                date={currentDate}
                ref={ref => (calendarRefsSingle.current = ref)}
              />
            </div>
          )}
        </div>

        {dltApmntLoading && (
          <div className='fixed top-0 left-0 z-[9999999] h-screen w-screen bg-gray-200/60'>
            <div className='flex w-screen h-screen justify-center items-center'>
              <ClipLoader
                cssOverride={{
                  display: 'block',
                  marginLeft: '1rem',
                  borderColor: '#5eccb9',
                }}
                color={'black'}
                loading={true}
                size={30}
              />
            </div>
          </div>
        )}
        {openPopup && (
          <div
            className='fixed top-0 left-0 z-[500] h-screen w-screen bg-gray-200/60'
            onClick={() => {
              console.log('abcdefghijklm')
              setOpenPopup(false)
            }}
          ></div>
        )}
        {openPopup && (
          <PopUp
            open={openPopup}
            setOpenPopup={setOpenPopup}
            handleEdit={handleEdit}
            selectedOption={selectedOption}
            handleMenuClick={handleMenuClick}
            showStatus={showStatus}
            handleDelete={handleDelete}
            updStatusLoading={updStatusLoading}
            data={showPopupData}
          />
        )}
      </div>
    )
  }
}

export default Scheduler
