import React, { useState } from 'react'
import { Table, Tabs } from 'antd'
import { Checkdata } from './data'
// import { RxCalendar } from "react-icons/rx";
import { getAllAppointments, getAllApt } from '../../Slices/Dashboard.slice'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import generateDataFromToday from '../../Utils/utils'
import { useNavigate } from 'react-router-dom'
import { statusList } from '../../Utils/utils'
import axios from 'axios'
import { ClipLoader } from 'react-spinners'
import { NotificationWithIcon } from '../../Utils/Notification'
import authHeader from '../../Services/authHeader'
import { getDentistList } from '../../Slices/Dentist.slice'
import dayjs from 'dayjs'
import PopUp from '../../Utils/PopUp'
import { deleteAppointment } from '../../Slices/Appointment.slice'

const VistsTab = () => {
  const getAllAptDetail = useSelector(getAllApt)
  const [keys, setKeys] = useState('1')
  const [dataApt, setDataApt] = useState()
  const [openPopup, setOpenPopup] = useState(false)
  const [showPopupData, setshowPopupData] = useState()
  const [selectedOption, setSelectedOption] = useState(showPopupData?.status)
  const [updStatusLoading, setUpdStatusLoading] = useState(false)
  const [showStatus, setShowStatus] = useState(statusList)
  const [dltApmntLoading, setDltApmntLoading] = useState(false)
  const [dentistNameList, setDentistName] = useState([])
  const navigate = useNavigate()
  const dispatch = useDispatch()
  console.log({ dentistNameList })
  console.log(showPopupData?.status, selectedOption, 'pppppppppppppppp')

  console.log({ selectedOption })
  console.log({ getAllAptDetail })

  const dentistName = async () => {
    dispatch(getDentistList())
      .unwrap()
      .then(x => {
        console.log(x, 'iliuuuuu')
        const data = x?.map(x => x.name)
        setDentistName(data)
      })
      .catch(error => {
        console.log(error, 'errrorrorororo')
      })
  }
  const handleDelete = deleteId => {
    console.log(deleteId, 'popupdataaa:apmnt:deleteId')
    setDltApmntLoading(true)
    dispatch(deleteAppointment({ apt_id: deleteId }))
      .unwrap()
      .then(async x => {
        NotificationWithIcon('success', 'Successfully Deleted Appointment')
        // await handleApi()
        dispatch(getAllAppointments())
        setOpenPopup(false)
        setDltApmntLoading(false)
      })
      .catch(e => {
        NotificationWithIcon('error', "Can't Delete Appointment")
        setDltApmntLoading(false)
      })
  }

  // useEffect(() => {
  //   if(selectedOption == "cancelled"){
  //     setOpenPopup(false)
  //   }
  // }, [selectedOption])

  function handleMenuClick(key, value, apmnt_id) {
    // console.log(showPopupData, 'nnnnnnnnnnnnnnn')
    setUpdStatusLoading(true)
    const selectedOptionToBeRemoved = selectedOption

    setSelectedOption(value)
    // const apt_id = showPopupData.apt_id
    let apmnt = getAllAptDetail.find(x => x.id === apmnt_id);
    // console.log(apmnt, "apmntapmntapmnt");
    let dataToBeSend = {
      startTime: new Date(apmnt.start_time),
      endTime: new Date(apmnt.end_time),
      status: value,
      phone: apmnt?.patient?.phone,
      email: apmnt?.patient?.email,
      patientName: apmnt.dependent ? apmnt?.dependent?.name : apmnt?.patient?.name,
      dentistName: apmnt?.AppointmentType?.Dentist?.name,
    }
    // console.log(dataToBeSend, 'dataToBeSend2', apmnt_id)

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
        dispatch(getAllAppointments())
        setUpdStatusLoading(false)
        if (value === 'cancelled') {
          setOpenPopup(false)
        }
      })
      .catch(error => {
        console.log(error)
        NotificationWithIcon('error', "Can't Update Appointment")
        setSelectedOption(selectedOptionToBeRemoved)
        setUpdStatusLoading(false)
      })
  }
  // const handleAllStatus = currStatus => {
  //   console.log('currStatus: ', currStatus)
  //   const newStatus = statusList.filter(st => st !== currStatus)
  //   console.log(newStatus, 'newStatus')
  //   setShowStatus(newStatus)
  // }
  function groupByTime(data) {
    console.log('datasaaaaaaaaaaaaaaaaaa', data)
    const groups = {}
    data?.forEach(obj => {
      const time = obj?.time?.toString()?.split('T')[0]
      console.log(time, 'timeeee')
      if (!groups[time]) {
        groups[time] = []
      }
      groups[time].push(obj)
    })
    console.log(groups, 'grouppppppp')
    return groups
  }

  const data = generateDataFromToday()

  console.log(showPopupData, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')

  useEffect(() => {
    ;(async () => {
      // await handleApi()
      dispatch(getAllAppointments())
      await dentistName()
    })()
  }, [])

  useEffect(() => {
    console.log(getAllAptDetail, 'nnnnnnnnn')
    // const dataAll = groupByTime(getAllAptDetail)
    // console.log(dataAll, "dataAlldataAll");
    setDataApt(getAllAptDetail)
    if (
      process.env.REACT_APP_DEVELOPMENT !== 'false' ||
      process.env.REACT_APP_DEVELOPMENT !== false
    ) {
      // const intervalId = setInterval(() => {
      //   const dataAll = groupByTime(getAllAptDetail)
      //   setDataApt(dataAll)
      // }, 10000)
      // run every 1 second
      // return () => clearInterval(intervalId)
    }
  }, [getAllAptDetail])

  // useEffect(() => {
  //   const dataAll = groupByTime(getAllAptDetail)
  //   setDataApt(dataAll)
  // }, [getAllAptDetail])

  console.log({ dataApt })

  const dentists = {}

  // if (dataApt && Object.keys(dataApt).length) {
  //   Object.keys(dataApt)?.forEach(date => {
  //     const appointments = dataApt[date]
  //     appointments?.forEach(appointment => {
  //       const dentistName = appointment?.dentist
  //       if (!dentists[dentistName]) {
  //         dentists[dentistName] = []
  //       }
  //       dentists[dentistName].push(appointment)
  //     })
  //   })
  // }
  const dentistsArr = Object.keys(dentists).map(dentistName => {
    return { name: dentistName, appointments: dentists[dentistName] }
  })

  console.log({ dentistsArr })
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //   const dataAll = groupByTime(getAllAptDetail)
  //   console.log({ dataAll })
  //   setDataApt(dataAll)
  //   }, 1000) // run every 1 second

  //   return () => clearInterval(intervalId)
  // }, [getAllAptDetail])

  const print = key => {
    setKeys(key)
    console.log('key,', key)
  }

  const secondObject = Checkdata.filter(item => item.userId === keys)
  console.log('Second Object', secondObject)
  const dentistNames = [...new Set(dentistNameList?.map(x => x))]

  console.log({ dentistNames })

  const columns = [
    // {
    //   title: 'apmnt ID',
    //   dataIndex: 'id',
    // },
    {
      title: 'Paitent Name',
      dataIndex: 'name',
      // sorter: (a, b) => a.name.length - b.name.length,
      // sortDirections: ["descend"],
    },
    {
      title: 'Time',
      dataIndex: 'time',
      defaultSortOrder: 'descend',
      width:100
      // sorter: (a, b) => a.time - b.time,
    },
    {
      title: 'Provider',
      dataIndex: 'dentist',
      filters: dentistNames?.map(name => ({ text: name, value: name })),
      onFilter: (value, record) => record?.dentist === value,
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Booked By',
      dataIndex: 'bookedBy',
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      width: 80,
    },
    {
      title: 'Sched Production',
      value: 'nan',
      dataIndex: 'sched1',
      width: 150,
    },
    {
      title: 'UnSched Production',
      dataIndex: 'sched2',
      width: 110,
    },
    {
      title: 'UnSched Family',
      dataIndex: 'sched3',
      width: 110,
    },
    {
      title: 'AR Balance',
      dataIndex: 'balance',
      width: 90,
    },
  ]
  const onChange = value => {
    console.log('params:record', value)
    setOpenPopup(true)
    // console.log("HAHAHAAHAHAHA", info.event);
    setshowPopupData(value)

    // console.log("Events Info", info.event.extendedProps);
  }

  const handleEdit = data => {
    console.log('clickkkkkkkkkkk')
    console.log('Data Popup', data)
    // console.log('Show Popup Data',showPopupData);
    const datas = { ...data, status: selectedOption }
    // const id = data.apt_id
    navigate(`/edit-schedule/${data.id}`, { state: { datas: datas } })
  }

  function capitalize(word) {
    const lower = word.toLowerCase()
    return word.charAt(0).toUpperCase() + lower.slice(1)
  }

  const printData = date => {
    if (dataApt?.length) {
      console.log(dataApt, 'TIMEEE123')
    }
    const dataForTime = dataApt?.filter(apt =>
      apt?.start_time?.split('T')[0].includes(date)
    )
    console.log({ dataForTime }, dataApt, 'dataaaa')
    const data2 = dataForTime?.map((item, index) => {
      const startTime = new Date(item?.start_time)
      const endTime = new Date(item?.end_time)
      const durationInMs = startTime - endTime
      console.log(durationInMs, 'timee23232')

      // Convert the duration to hours, minutes, and seconds
      const hours = Math.floor(durationInMs / 3600000)
      const minutes = Math.floor((durationInMs % 3600000) / 60000)
      const seconds = Math.floor(((durationInMs % 3600000) % 60000) / 1000)
      console.log(item, 'itemmmm')
      let data = {}
      const timestamp = item?.start_time
      const date = new Date(timestamp)
      const formattedTime = date?.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      })
      data = {
        id: item?.id,
        key: index,
        name: item?.dependent?.name ?? item?.patient?.name,
        // this field is hard-coded as it is not available

        // time: item?.start_time,
        time: `${dayjs(item?.start_time?.split('T')[0]).format(
          'MM/DD/YY'
        )} ${formattedTime}`,
        dentist: item?.AppointmentType?.Dentist?.name,
        dentist_dp: item?.dentist_dp,
        phone: item.phone,
        dob: item.dob,
        gender: item.gender,
        email: item.email,
        status: capitalize(item.status),
        start_time: item.start_time,
        end_time: item.end_time,
        duration: `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
        appointmentType: item.appointment_type,
        apt_id: item.apt_id,
        priority: item.priority,
        bookedBy: !item.dependent_id
          ? item.book_by_id === item.p_id
            ? 'self'
            : 'partner'
          : 'parent',
        sched1: 'N/A',
        sched2: 'N/A',
        sched3: 'N/A',
        balance: 'N/A',
      }
      return data
    })
    // setAptDetail(data2);
    console.log(date, data2, 'Dataa222220')

    return (
      <>
        <Table
          pagination={false}
          // bordered
          columns={columns}
          dataSource={data2}
          // onChange={onChange}
          onRow={record => {
            return {
              onClick: () => onChange(record), // click row
            }
          }}
          size='large'
          scroll={{ y: 300}}
        />
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
          <PopUp
            open={openPopup}
            setOpenPopup={setOpenPopup}
            handleEdit={handleEdit}
            selectedOption={selectedOption}
            handleMenuClick={handleMenuClick}
            showStatus={showStatus}
            handleDelete={handleDelete}
            updStatusLoading={updStatusLoading}
            // data={showPopupData}
            data={getAllAptDetail.find(x => x.id === showPopupData.id)}
          />
        )}
      </>
    )
  }

  return (
    <div>
      <div className='tabsStyles '>
        <Tabs
          tabBarGutter={120}
          defaultActiveKey='1'
          onChange={print}
          tabBarStyle={{
            color: 'gray',
            marginLeft: '20px',
            marginRight: '20px',
          }}
          items={data.map(x => {
            console.log(x, 'xxxxxxxxxxx')
            return {
              label: (
                <div className='text-center'>
                  <div className='rounded-full border-2 w-6'>
                    <p>{x.day}</p>
                  </div>
                  <p className='text-[12px]'>{x.dayOfWeek}</p>
                </div>
              ),
              key: x.key,
              children: printData(x.date),
            }
          })}
        />
      </div>
    </div>
  )
}

export default VistsTab
