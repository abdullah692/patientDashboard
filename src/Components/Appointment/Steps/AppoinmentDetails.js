import React, { useState, useEffect, useMemo } from 'react'
import DropDownComp from '../../DropDown/DropdownComp'
import { useDispatch, useSelector } from 'react-redux'
import {
  addApmntForTable,
  addApmntInList,
  appointmentBooked,
  deleteApmntFromList,
  getAppointmentById,
  getAppointmentTypes,
  setUpdateAppointment,
  updateApmntById,
  updateApmntFromTable,
  updateApmntInList,
} from '../../../Slices/Appointment.slice'
import { getDentistAndAvailibilityByApmntType } from '../../../Slices/Dentist.slice'
import { Button, Dropdown, Menu, Radio } from 'antd'
import SideCalendar from '../../Schedule/SideCalendar'
import dayjs from 'dayjs'
import FullPageLoader from '../../../Utils/FullPageLoader'
import { DownOutlined } from '@ant-design/icons'
import { convertDayNameToDate } from '../../../Utils/time_date'
import { NotificationWithIcon } from '../../../Utils/Notification'
import { ClipLoader } from 'react-spinners'
import FinalConfirmModel from './FinalConfirmModel'
import ModalForCancel from './ModalForCancel'
import { useNavigate, useParams } from 'react-router-dom'

const AppoinmentDetails = ({ handleComponentChange, handleCancel }) => {
  const navigate = useNavigate();
  let isExistAll = []
  const [data, setData] = useState({ apmntType: '', provider: '', providerId: null, searchBy: 'anytime' })
  const [selectedDate, setSelectedDate] = useState(dayjs().format('MM-DD-YY'));
  const [allDoctorsData, setAllDoctorsData] = useState([]);
  const [filterDoctorData, setFilterDoctorData] = useState([])
  // const [earliestDoctorData, setEarliestDoctorData] = useState([]);
  const [appointmentData, setAppointmentData] = useState({
    startTime: '',
    endTime: '',
    providerId: null,
    date: null,
    av_id: null,
  })
  const [loading, setLoading] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const [modalForCancel, setModalForCancel] = useState(false)
  // const [value, setValue] = useState(() => dayjs('2017-01-25'));
  const { 
    appointments, appointmentsForTable, 
    appointmentFor, appointmentTypes,
    updateAppointment, 
  } = useSelector(state => state.Appointment);

  const { patientData, partnerData, dependents } = useSelector(state => state.Patient);

  const dispatch = useDispatch()
  const { apmnt_id } = useParams()

//   console.log(updateAppointment, 'updateAppointment:editAlq')
console.log(appointments, "appointment:editAlq");
//   console.log(appointmentFor, "appointmentFor:editAlq");
// console.log(appointmentData, "appointmentData");

useEffect(()=>{
  console.log(apmnt_id, "apmnt_idapmnt_idapmnt_id");
  if(apmnt_id){
    dispatch(getAppointmentById({ id: apmnt_id }))
  }
}, []);

  useEffect(() => {
    setLoading(true)
    dispatch(getAppointmentTypes({ Docid: 1 }))
      .unwrap()
      .then(_ => {
        setLoading(false)
      })
      .catch(e => {
        console.log(e, 'error: getAppointmentTypes')
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    let day = selectedDate
      ? dayjs(selectedDate).format('dddd').toLocaleLowerCase()
      : ''
    if (!day && data.searchBy === 'firstavailable') {
      day = dayjs().format('dddd').toLocaleLowerCase()
    }
    console.log(day, 'today')
    if (data?.apmntType) {
      setLoading(true)
      dispatch(
        getDentistAndAvailibilityByApmntType({ type: data.apmntType, day: day })
      )
        .unwrap()
        .then(x => {
          console.log(x, 'getDentistAndAvailibilityByApmntType')
          const docData = x?.data?.map(eachDoc => {
            let av_time = {
              anytime: [],
              morning: [],
              afternoon: [],
              firstavailable: [],
            }
            Object.keys(x.uniqueTimeSlots)?.forEach(slot => {
              let t = x.uniqueTimeSlots[slot]?.filter(eachTimeObj =>
                eachTimeObj?.d_id?.includes(eachDoc?.id)
              )
              // filter for firstavailable, morning and avening
              if (t.length > 0) {
                av_time['anytime'].push(...t)
                av_time['firstavailable'] = [t[0]]
                const morningData = []
                const afternoonData = []
                for (let i = 0; i < t.length; i++) {
                  const eachSlot = t[i]
                  if (
                    eachSlot?.startTime?.includes('AM') &&
                    eachSlot?.endTime?.includes('AM')
                  ) {
                    morningData.push(eachSlot)
                  }
                }
                for (let i = 0; i < t.length; i++) {
                  const eachSlot = t[i]
                  if (
                    eachSlot?.startTime?.includes('PM') &&
                    eachSlot?.endTime?.includes('PM')
                  ) {
                    afternoonData.push(eachSlot)
                  }
                }
                av_time['morning'].push(...morningData)
                av_time['afternoon'].push(...afternoonData)
              }
            })
            return {
              id: eachDoc.id,
              name: eachDoc.name,
              email: eachDoc.email,
              phone: eachDoc.phone,
              dp_url: eachDoc.dp_url,
              timeSlots: av_time,
              AppointmentTypes: eachDoc.AppointmentTypes,
            }
          })
          console.log(docData, 'docDatadocData')

          if (data.provider && data.providerId) {
            const selDoctor = docData.filter(x => x.id == data.providerId)
            setFilterDoctorData(selDoctor)
          } else {
            setFilterDoctorData(docData)
          }

          // setEarliestDoctorData(x?.earliestDentistList);
          setAllDoctorsData(docData)
          setLoading(false)
        })
        .catch(e => {
          console.log(e, 'error in fetc dentist')
          setLoading(false)
        })
    }
  }, [data.apmntType, selectedDate])

  useEffect(() => {
    console.log(updateAppointment, "updateAppointment");
    if (Object.keys(updateAppointment || {})?.length > 0 && appointmentsForTable.length > 0) {
      console.log(updateAppointment, "updateAppointment");
      const apmntFromTable = appointmentsForTable.find(eachApmnt => 
        eachApmnt.key === updateAppointment.key && eachApmnt.isDependent === updateAppointment?.isDependent
      );
      const apmnt = appointments.find(eachApmnt => 
        eachApmnt.key === updateAppointment.key && eachApmnt.isDependent === updateAppointment?.isDependent
      )
      console.log(apmnt, 'apmntToBeUpd')
      console.log(apmntFromTable, 'apmntToBeUpd')
      setSelectedDate(apmntFromTable.date)
      setData({
        searchBy: 'anytime',
        apmntType: apmntFromTable.apmntType,
        provider: apmntFromTable.d_name,
        providerId: apmnt.d_id,
      })
      setAppointmentData({
        startTime: apmntFromTable.startTime,
        endTime: apmntFromTable.endTime,
        date: apmntFromTable.date,
        av_id: apmnt.avId,
        providerId: apmnt.d_id,
      })
    }
  }, [updateAppointment])

  useEffect(()=>{
    if(apmnt_id && appointments.length > 0) {
      console.log(dayjs(appointments[0]?.date).format("MM-DD-YY"), "selectedDay:alqa");
      setSelectedDate(dayjs(appointments[0]?.date).format("MM-DD-YY"))
      setData({
        searchBy: 'anytime',
        apmntType: appointments[0]?.apmntType,
        provider: appointments[0]?.d_name,
        providerId: appointments[0]?.d_id,
      })
      setAppointmentData({
        startTime: appointments[0]?.startTime,
        endTime: appointments[0]?.endTime,
        date: appointments[0]?.date,
        av_id: appointments[0]?.avId,
        providerId: appointments[0]?.d_id,
      })
    }
  }, [apmnt_id, appointments]);

  const handleDropDown = (key, value) => {
    console.log(key, value, 'apmntDet:dropdown')
    if (key === 'apmntType') {
      setData({ ...data, provider: '', providerId: null, [key]: value })
    } else {
      setData({ ...data, [key]: value })
    }
  }

  const onChangeRadioBtn = e => {
    console.log('radio checked', e.target.value)
    setData({ ...data, searchBy: e.target.value })
  }

  // calender date change handler
  const handleCalenderDate = value => {
    console.log(value.format('YYYY-MM-DD'), 'hahehehehe1')
    setSelectedDate(value.format('MM-DD-YY'))
    setAppointmentData({
      ...appointmentData,
      startTime: null,
      endTime: null,
      av_id: null,
      date: null,
    })
  }

  const handleSelectTime = (d_id, eachSlot) => {
    console.log(d_id, 'd_idsssss', eachSlot)
    setAppointmentData({
      ...appointmentData,
      providerId: d_id,
      startTime: eachSlot.startTime,
      endTime: eachSlot.endTime,
      av_id: eachSlot.av_id,
      date: selectedDate,
    })
  }

  const handleDocChange = val => {
    const dentist = allDoctorsData.find(doc => doc.id == val)
    console.log(allDoctorsData, 'currentDentist')
    console.log(dentist, 'currentDentist')
    console.log(val, 'currentDentist')
    setFilterDoctorData([dentist])
    setData({ ...data, provider: dentist.name, providerId: val })
  }

  const disabledCalender = current => {
    if (data.apmntType.length === 0) {
      return true
    }
    return current && current < dayjs().startOf('day')
  }

  function combineDateAndTime(dateString, timeString) {
    let formatDate = dayjs(dateString, "MM-DD-YY").format("MM-DD-YYYY");
    const [time, period] = timeString.replace(/\s/g, ' ').split(' ')
    const [hours, minutes] = time.split(':')
    const [month, day, year] = formatDate.includes('/')
      ? formatDate.split('/')
      : formatDate.split('-')

    const combinedDate = new Date(
      year,
      month - 1,
      day,
      period === 'PM' ? parseInt(hours, 10) + 12 : hours,
      minutes
    )

    return combinedDate
  }

  const handleSubmit = () => {
    if (!selectedDate)
      return NotificationWithIcon('error', 'Please Select Date')
    if (!appointmentData.startTime || !appointmentData.endTime)
      return NotificationWithIcon('error', 'Please Select Appointment Time')
    // if(new Date(selectedDate) < new Date()){
    //   return NotificationWithIcon("error", "Can't add appointment of past time or days");
    // }
    setBtnLoading(true)
    // find dentist for getting appointment types data
    const allDentistList = [...allDoctorsData]
    const dentist = allDentistList.find(
      doc => doc.id == appointmentData.providerId
    )
    console.log(dentist, 'dentistInApmntDetails')

    // debugger

    // let currApmntFor = appointmentFor ? appointmentFor : updateAppointment
    let currApmntFor, isDependent = false, patientName = '';
    if(appointmentFor === 'parent') {
      currApmntFor = patientData?.id;
      patientName = patientData?.name;
    }
    else if(appointmentFor === 'partner') {
      currApmntFor = partnerData?.id;
      patientName = partnerData?.name;
    }
    else {
      const dep = dependents.find(x => x.id == appointmentFor);
      currApmntFor = dep?.id;
      isDependent = true;
      patientName = dep?.name;
    }
    console.log(currApmntFor, "currApmntFor");

    const apmntData = {
      avId: appointmentData.av_id,
      startTime: combineDateAndTime(
        appointmentData.date,
        appointmentData.startTime
      ),
      endTime: combineDateAndTime(
        appointmentData.date,
        appointmentData.endTime
      ),
      d_id: appointmentData.providerId,
      insId: 15,
      key: currApmntFor,
      atId: dentist.AppointmentTypes[0].id,
      priority: dentist.AppointmentTypes[0].priority,
      isDependent,
      name: patientName,
      appointmentFor,
    }

    const extraData = {
      d_id: dentist?.id,
      d_name: dentist?.name,
      apmntType: dentist?.AppointmentTypes[0]?.type,
      date: appointmentData?.date,
      startTime: appointmentData?.startTime,
      endTime: appointmentData?.endTime,
      patientName: patientName ,             // apmnt_id ? appointments[0]?.patientName :
      key: currApmntFor,
      isDependent,
      appointmentFor,
    }

    console.log(extraData, "apmntDataapmntData:extra");

    if (Object.keys(updateAppointment).length > 0) {
      const newApmnt = appointments?.map(eachApmnt => {
        if (eachApmnt?.key !== updateAppointment?.key) return eachApmnt
        else return apmntData
      })
      const newApmntForTable = appointmentsForTable?.map(eachApmnt => {
        if (eachApmnt?.key !== updateAppointment?.key) return eachApmnt;
        else return extraData
      })

      dispatch(updateApmntInList(newApmnt))
      dispatch(updateApmntFromTable(newApmntForTable))
      dispatch(setUpdateAppointment({}))
    } else {
      dispatch(addApmntInList(apmntData))
      dispatch(addApmntForTable(extraData))
    }
    setBtnLoading(false);
    handleComponentChange(3);
  }

  const handleUpdateSubmit = () => {
    setBtnLoading(true);
    const dataToBeSend = { ...appointmentData, avId: appointmentData.av_id, d_id: appointmentData.providerId }
    const dentist = allDoctorsData.find(doc => doc.id == appointmentData.providerId);
    // console.log(dentist, "appointmentDataappointmentData");
    dataToBeSend.dentistName = dentist.name;
    dataToBeSend.atId = dentist.AppointmentTypes[0].id
    dataToBeSend.startTime = combineDateAndTime(appointmentData.date, appointmentData.startTime);
    dataToBeSend.endTime = combineDateAndTime(appointmentData.date, appointmentData.endTime);
    dataToBeSend.apmnt_id = apmnt_id
    dataToBeSend.status = appointments[0].status;
    dataToBeSend.priority = dentist.AppointmentTypes[0].priority;
    console.log('dentistInApmntDetails', dataToBeSend)
    dispatch(updateApmntById(dataToBeSend)).unwrap().then(x => {
      console.log(x, "handleUpdateSubmit:res");
      NotificationWithIcon("success", x?.message || "Appointment updated");
      setBtnLoading(false);
      navigate(-1);
    }).catch(err => {
      console.log(err, "handleUpdateSubmit:err");
      // NotificationWithIcon("error", err?.message);
      setBtnLoading(false);
    })
  }

  const providerMenu = (
    <Menu
      onClick={e => {
        handleDocChange(e.key)
      }}
    >
      {allDoctorsData?.map(eachDoc => (
        <Menu.Item key={eachDoc?.id}>{eachDoc?.name}</Menu.Item>
      ))}
    </Menu>
  )

  // console.log(filterDoctorData, "filterDoctorData");

  function checkFill(eachSlot, eachDoc) {
    let fill = false
    const a = eachSlot?.startTime.includes(String.fromCharCode(8239)) && Boolean(apmnt_id);
    if(a){
      const startTimeWithSpace = eachSlot?.startTime?.replace(new RegExp(String.fromCharCode(8239), 'g'), ' ');
      const endTimeWithSpace = eachSlot?.endTime?.replace(new RegExp(String.fromCharCode(8239), 'g'), ' ');
// console.log(startTimeWithSpace, " = startTimeWithSpace, ", endTimeWithSpace, " = endTimeWithSpace");
      if (
        startTimeWithSpace === appointmentData?.startTime &&
        endTimeWithSpace === appointmentData?.endTime &&
        eachDoc?.id === appointmentData?.providerId
        ) {
          fill = true
        }
    }
    // else 
    if (
      eachSlot?.startTime === appointmentData?.startTime &&
      eachSlot?.endTime === appointmentData?.endTime &&
      eachDoc?.id === appointmentData?.providerId
      ) {
        fill = true
      }
    return fill
  }

  return (
    <div className='w-full min-h-full bg-white'>
      <FullPageLoader isShow={loading} />
      <div className='flex pb-1 mb-2 px-4'>
        <div className='flex-1 ml-2 bg-gray-50/100 px-4 rounded-md py-4'>
          <div className='flex  gap-x-4'>
            <div className='w-[250px]'>
              <p className='mb-1 ml-1'>Appointment Types</p>
              <DropDownComp
                value={data.apmntType}
                size='large'
                width='250px'
                maxWidth='250px'
                _for={'apmntType'}
                req_msg='Select Appointment Types'
                arr={appointmentTypes?.map(x => x.type)}
                callback={handleDropDown}
              />
            </div>
            <div className='w-[250px]'>
              <p className='mb-1 ml-1'>Select Provider</p>
              <Dropdown
                overlay={providerMenu}
                disabled={data.apmntType.length === 0}
              >
                <Button
                  style={{ width: 250, maxWidth: 250, background: '#fff' }}
                  size={'large'}
                >
                  {data.provider || 'Select Provider'} <DownOutlined />
                </Button>
              </Dropdown>
            </div>
          </div>
          <div className='my-4 '>
            <p className='mr-3'>Search By</p>
            <Radio.Group onChange={onChangeRadioBtn} value={data.searchBy}>
              <Radio value={'anytime'}>Anytime</Radio>
              <Radio value={'firstavailable'}>First Available</Radio>
              <Radio value={'morning'}>Morning</Radio>
              <Radio value={'afternoon'}>After Noon</Radio>
            </Radio.Group>
          </div>
          <div className='mt-4'>
            {console.log(selectedDate, "selectedDateselectedDateselectedDate")}
            <SideCalendar
              value={dayjs(selectedDate, "MM-DD-YY")}
              onSelect={handleCalenderDate}
              disabledDate={disabledCalender}
              // defaultValue={dayjs()}
              // value={value}
              // defaultValue={dayjs(selectedDate, "MM-DD-YY")}
            />
          </div>
        </div>
        <div className='flex-1 ml-2 mr-2 bg-gray-50/100 px-3 rounded-md py-4'>
          <div className='font-semibold text-lg'>Time Slots</div>
          <div className='border-b-2 border-sea-green w-[50px] mb-4'></div>
          <div
            className={`flex flex-col max-h-[430px] overflow-auto ${
              filterDoctorData.length > 0 ? 'pb-4' : 'pb-2'
            }`}
          >
            {filterDoctorData.length > 0 ? (
              filterDoctorData?.map((eachDoc, i) => {
                if (eachDoc?.timeSlots[data.searchBy].length > 0) {
                  isExistAll.push(true)
                  return (
                    <EachProviderData
                      key={i}
                      eachDoc={eachDoc}
                      data={data}
                      checkFill={checkFill}
                      handleSelectTime={handleSelectTime}
                    />
                  )
                } else {
                  isExistAll.push(false)
                  if (
                    filterDoctorData.length === isExistAll.length &&
                    isExistAll.includes(false)
                  ) {
                    return (
                      <div key={i} className='w-full h-full flex justify-center items-center font-semibold'>
                        No Slots Available
                      </div>
                    )
                  }
                  return <></>
                }
              })
            ) : data.provider ? (
              <div className='w-full h-full flex justify-center items-center font-semibold'>
                No Slots Available
              </div>
            ) : (
              <div className='w-full h-full flex justify-center items-center font-semibold'>
                No Provider available
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Buttons */}
      <ModalForCancel
        isOpen={modalForCancel}
        closeModal={() => setModalForCancel(false)}
        handleCancel={handleCancel}
      />
      <div className='flex my-2 gap-x-3 justify-end mr-6'>
        <button
          disabled={btnLoading}
          className='rounded-lg py-2 px-5 border border-black hover:bg-gray-200'
          onClick={() => setModalForCancel(true)}
        >
          Cancel
        </button>
        <button
          onClick={apmnt_id ? handleUpdateSubmit : handleSubmit}
          className={` ${
            btnLoading ? 'disabled' : ''
          } rounded-lg bg-gradient-to-r border border-sea-green text-white from-sea-green to-dashboard-green hover:from-dashboard-green hover:to-[#10967f] flex items-center justify-center site py-2 px-5`}
          disabled={btnLoading}
        >
          {btnLoading ? 'Loading' : apmnt_id ? 'Submit' : 'Proceed'}
          <span>
            <ClipLoader
              cssOverride={{
                display: 'block',
                marginLeft: '1rem',
                borderColor: 'white',
              }}
              color={'seagreen'}
              loading={btnLoading}
              size={20}
            />
          </span>
        </button>
      </div>
    </div>
  )
}

const EachProviderData = ({ eachDoc, data, checkFill, handleSelectTime }) => {
  return (
    <div className='mt-5' key={eachDoc.id}>
      <div className='doctor-details flex items-center'>
        <div className='flex justify-center items-center w-[30px] h-[30px] overflow-hidden rounded-full bg-gray-400 border border-sea-green'>
          <img
            src={`${process.env.REACT_APP_BACKEND_API_URL}/api/files/${eachDoc.dp_url}`}
            width={60}
            height={60}
            alt=''
            className='object-cover'
          />
        </div>
        <div className='ml-2'>
          <p className='text-base'>{eachDoc?.name}</p>
          {/* <p className='text-gray-400 text-[12px]'>{eachDoc?.email}</p> */}
          {/* <p className='text-gray-400 text-[12px]'>{eachDoc?.phone}</p> */}
        </div>
      </div>
      <div className='mt-3'>
        <div className=''>
          <SlotsDataForEachProvider
            eachDoc={eachDoc}
            slotsArray={eachDoc?.timeSlots[data.searchBy]}
            handleSelectTime={handleSelectTime}
            checkFill={checkFill}
          />
        </div>
      </div>
    </div>
  )
}

const SlotsDataForEachProvider = ({
  eachDoc,
  slotsArray,
  handleSelectTime,
  checkFill,
}) => {
  return (
    <div className='flex flex-wrap gap-3'>
      {slotsArray.map((eachSlot, ind) => {
        const fill = checkFill(eachSlot, eachDoc)
        return (
          <div
            key={ind}
            onClick={() => handleSelectTime(eachDoc?.id, eachSlot)}
            className={`flex justify-center border-2  px-3 py-2 rounded-md w-[160px] cursor-pointer ${
              fill ? 'bg-blue-800 text-white' : ''
            }`}
          >
            {eachSlot?.startTime} - {eachSlot?.endTime}
          </div>
        )
      })}
    </div>
  )
}

export default AppoinmentDetails
