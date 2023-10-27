import { Table, Tooltip } from 'antd'
import React, { useState } from 'react'
import FinalConfirmModel from './FinalConfirmModel'
import { useDispatch, useSelector } from 'react-redux'
import {
  appointmentBooked,
  deleteApmntFromList,
  deleteApmntFromTable,
  resetEveryThingFromAppointment,
  setUpdateAppointment,
  updateApmntById,
} from '../../../Slices/Appointment.slice'
import { NotificationWithIcon } from '../../../Utils/Notification'
import {
  addPatientData,
  removeAllDataFromPatientSlice,
} from '../../../Slices/Patient.slice'
import Modals from '../../Modals/Modals'
import ModalForCancel from './ModalForCancel'
import { useEffect } from 'react'
import { setAppointmentFor } from '../../../Slices/Appointment.slice'
import dayjs from 'dayjs'
import { useParams } from 'react-router-dom'

const AppointmentTable = ({ handleTabsChange, handleBooked }) => {
  const dispatch = useDispatch()
  const { apmnt_id } = useParams()
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [modalForCancel, setModalForCancel] = useState(false)
  const appointmentsForTable = useSelector(
    state => state.Appointment.appointmentsForTable
  )
  const appointments = useSelector(state => state.Appointment.appointments)
  const { patientData, partnerData, dependents } = useSelector(state => state.Patient);


    console.log(appointmentsForTable, "appointmentsForTable:final");
    console.log(appointments, "appointmentsForTable:final");

  useEffect(() => {
    dispatch(setAppointmentFor({ appointmentFor: '' }))
  }, [])

  const handleDeleteAppointment = (key, patientName) => {
    // console.log(key, "handleDeleteAppointment");
    const newApmnt = appointments.filter(
      eachApmnt => eachApmnt.key !== key && eachApmnt?.name !== patientName
    );
    const newApmntForTable = appointmentsForTable.filter(
      eachApmnt => eachApmnt.key !== key && eachApmnt?.patientName !== patientName
    );
    console.log(newApmnt, "handleDeleteAppointment", newApmntForTable);
    // // console.log(newApmnt, newApmntForTable, "newApmntTable");
    dispatch(deleteApmntFromList(newApmnt))
    dispatch(deleteApmntFromTable(newApmntForTable))
  }

  const handleUpdateAppointment = (apmnt) => {
    console.log(apmnt, "apmntapmntapmnt");
    dispatch(setUpdateAppointment({ key: apmnt?.key, isDependent: apmnt?.isDependent }));
    dispatch(setAppointmentFor({ appointmentFor: apmnt?.appointmentFor }));
    handleTabsChange(3)
  }

  // console.log(appointments, "appointmentsInApmntTable");
  // console.log(appointmentsForTable, "appointmentsInApmntTable");

  const editIcon = (
    <Tooltip title='Edit Appointment'>
      <svg
        width='19'
        height='19'
        viewBox='0 0 21 21'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M19.2168 1.73047C20.0762 2.58984 20.0762 3.95703 19.2168 4.81641L18.0449 5.98828L14.2168 2.16016L15.3887 0.988281C16.248 0.128906 17.6152 0.128906 18.4746 0.988281L19.2168 1.73047ZM6.79492 9.58203L13.3184 3.05859L17.1465 6.88672L10.623 13.4102C10.3887 13.6445 10.0762 13.8398 9.76367 13.957L6.28711 15.0898C5.93555 15.207 5.58398 15.1289 5.34961 14.8555C5.07617 14.6211 4.99805 14.2305 5.11523 13.918L6.24805 10.4414C6.36523 10.1289 6.56055 9.81641 6.79492 9.58203ZM7.57617 2.62891C8.24023 2.62891 8.82617 3.21484 8.82617 3.87891C8.82617 4.58203 8.24023 5.12891 7.57617 5.12891H3.82617C3.12305 5.12891 2.57617 5.71484 2.57617 6.37891V16.3789C2.57617 17.082 3.12305 17.6289 3.82617 17.6289H13.8262C14.4902 17.6289 15.0762 17.082 15.0762 16.3789V12.6289C15.0762 11.9648 15.623 11.3789 16.3262 11.3789C16.9902 11.3789 17.5762 11.9648 17.5762 12.6289V16.3789C17.5762 18.4492 15.8965 20.1289 13.8262 20.1289H3.82617C1.7168 20.1289 0.0761719 18.4492 0.0761719 16.3789V6.37891C0.0761719 4.30859 1.7168 2.62891 3.82617 2.62891H7.57617Z'
          fill='#14226D'
        />
      </svg>
    </Tooltip>
  )

  const deleteIcon = (
    <Tooltip title='Delete Appointment'>
      <svg
        width='16'
        height='19'
        viewBox='0 0 18 21'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M5.66992 0.832031C5.86523 0.402344 6.29492 0.128906 6.76367 0.128906H11.4902C11.959 0.128906 12.3887 0.402344 12.584 0.832031L12.8965 1.37891H16.6465C17.3105 1.37891 17.8965 1.96484 17.8965 2.62891C17.8965 3.33203 17.3105 3.87891 16.6465 3.87891H1.64648C0.943359 3.87891 0.396484 3.33203 0.396484 2.62891C0.396484 1.96484 0.943359 1.37891 1.64648 1.37891H5.39648L5.66992 0.832031ZM15.7871 18.3711C15.748 19.3867 14.9277 20.1289 13.9121 20.1289H4.3418C3.32617 20.1289 2.50586 19.3867 2.4668 18.3711L1.60742 5.12891H16.6465L15.7871 18.3711Z'
          fill='#D61C1C'
        />
      </svg>
    </Tooltip>
  )

  const columns = [
    {
      title: 'Patient Name',
      dataIndex: 'patientName',
      key: 'patientName',
      ellipsis: true,
    },
    {
      title: 'Doctor Name',
      dataIndex: 'doctorName',
      key: 'doctorName',
      ellipsis: true,
    },
    {
      title: 'Appointment Type',
      dataIndex: 'appointmentType',
      key: 'appointmentType',
      ellipsis: true,
    },
    {
      title: 'Appointment By',
      dataIndex: 'appointmentBy',
      key: 'appointmentBy',
      ellipsis: true,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      ellipsis: true,
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      ellipsis: true,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      ellipsis: true,
      render: (_, record) => (
        <div className='flex'>
          <div
            className='text-yellow-500 cursor-pointer'
            onClick={() => handleUpdateAppointment(record)}
          >
            {editIcon}
          </div>
          <div
            className='text-red-600 ml-5 cursor-pointer'
            onClick={() => handleDeleteAppointment(record?.key, record?.patientName)}
          >
            {deleteIcon}
          </div>
        </div>
      ),
    },
  ]

  const dataForTable = appointmentsForTable.map(eachApmnt => {
    console.log(eachApmnt, 'eachApmnt?.date')
    return {
      patientName: eachApmnt.patientName,
      doctorName: eachApmnt?.d_name,
      appointmentType: eachApmnt?.apmntType,
      appointmentBy: 'Front Desk',
      date: dayjs(eachApmnt?.date).format('MM/DD/YY'),
      time: eachApmnt?.startTime + '-' + eachApmnt?.endTime,
      // key: eachApmnt?.appointmentFor,   
      key: eachApmnt?.key,
      isDependent: eachApmnt?.isDependent,
      appointmentFor: eachApmnt?.appointmentFor,
    }
  })

  const handleFinalSubmit = callback => {
    if(apmnt_id){
      dispatch(updateApmntById({ 
        status: appointments[0].status, ...appointments[1], apmnt_id,
        patientName: appointmentsForTable[0]?.patientName,
        dentistName: appointmentsForTable[0]?.d_name,
      })).unwrap().then(x => {
        console.log(x, "updateApmntById:xxxx");
        NotificationWithIcon("success", "Appointment successfully updated");
        callback()
        setIsOpenModal(false);
        handleBooked()
      }).catch(e => {
        callback()
        NotificationWithIcon("error", "Can't update appointment at this time");
      });
    }
    else{
      const dataToBeSend = { ...patientData, patientPartner: partnerData, dependents, appointments };
      console.log(dataToBeSend, 'dataToBeSendFinal')
      dispatch(appointmentBooked(dataToBeSend))
        .unwrap()
        .then(x => {
          console.log(x, 'appointmentBookedDis')
          if (!x) {
            return NotificationWithIcon(
              'error',
              "Can't Booked Appointment At this time"
            )
          }
          NotificationWithIcon('success', 'Successfully Booked Appointment')
          callback()
          setIsOpenModal(false)
          dispatch(removeAllDataFromPatientSlice())
          dispatch(resetEveryThingFromAppointment())
          // handleTabsChange(1);
          handleBooked()
        })
        .catch(e => {
          console.log(e, 'appointmentBookedError')
          NotificationWithIcon('error', "Something went wrong");
          setIsOpenModal(false)
          callback()
          // handleTabsChange(1);
        });
    }
  }

  const submitBtn = (
    <button
      type='submit'
      onClick={() => setIsOpenModal(true)}
      disabled={appointments?.length === 0}
      className={`rounded-lg bg-gradient-to-r border border-sea-green text-white from-sea-green to-dashboard-green ${
        appointments?.length === 0
          ? ''
          : 'hover:from-dashboard-green hover:to-[#10967f]'
      } flex items-center justify-center site py-2 px-5`}
    >
      {apmnt_id ? "Update" : "Submit"}
    </button>
  )

  return (
    <div className='pb-2'>
      <ModalForCancel
        isOpen={modalForCancel}
        closeModal={() => setModalForCancel(false)}
        handleCancel={() => handleTabsChange(1)}
      />
      <div className='flex justify-center min-h-[550px] pt-6 px-4 bg-white'>
        <FinalConfirmModel
          isOpen={isOpenModal}
          closeModal={() => setIsOpenModal(false)}
          appointments={appointmentsForTable}
          handleFinalSubmit={handleFinalSubmit}
        />
        <Table columns={columns} dataSource={dataForTable} loading={false} />
      </div>
      <div className='flex justify-between my-3'>
        {apmnt_id ? <div></div> : <div className=''>
          <button
            onClick={() => handleTabsChange(2)}
            className={`h-[40px] no-underline hover:text-white rounded-lg bg-gradient-to-r text-white from-[#0707ac] to-[#00008B] hover:from-[#0e0e92] hover:to-[#0707ac] flex items-center justify-center site p-2 `}
          >
            Add Another Appointment
          </button>
        </div>}
        <div className='flex gap-x-4'>
          <button
            onClick={() => setModalForCancel(true)}
            className='rounded-lg py-2 px-5 border border-gray-400 text-gray-400 hover:bg-gay-600 hover:text-black'
          >
            Cancel
          </button>
          {appointments?.length > 0 ? (
            submitBtn
          ) : (
            <Tooltip placement='top' title='There is no Appointment'>
              {submitBtn}
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  )
}

export default AppointmentTable
