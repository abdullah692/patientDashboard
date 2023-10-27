import React, { useState } from 'react'
import PatientVerification from '../Components/Appointment/Steps/PatientVerification'
import PatientDetails from '../Components/Appointment/Steps/PatientDetails'
import AppoinmentDetails from '../Components/Appointment/Steps/AppoinmentDetails'
import { CaretUpOutlined } from '@ant-design/icons'
import AppointmentTable from '../Components/Appointment/Steps/AppointmentTable'
import AppointmentConfirmed from '../Components/Appointment/Steps/AppointmentConfirmed'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { fetchPatient, removeAllDataFromPatientSlice } from '../Slices/Patient.slice'
import { getAppointmentById, resetEveryThingFromAppointment } from '../Slices/Appointment.slice'
// import Otp from '../Components/Appointment/Steps/Otp'
import { useEffect } from 'react'
import { getAllInsurance } from '../Slices/Insurance.slice'

const AddAppointmentNew = () => {
  const dispatch = useDispatch()
  const [isTableShow, setIsTableShow] = useState(false)
  const [isBooked, setIsBooked] = useState(false)
  const navigate = useNavigate()
  const { apmnt_id } = useParams()
  const location = useLocation()
  
  useEffect(()=>{
    dispatch(getAllInsurance());
  }, []);
  
  // useEffect(()=>{
  //   console.log(apmnt_id, "apmnt_idapmnt_idapmnt_id");
  //   if(apmnt_id){
  //     handleComponentChange(2);
  //     const pateintPhone = location?.state?.datas?.Patient?.phone
  //     dispatch(getAppointmentById({ id: apmnt_id })).unwrap().then(x => {
  //       console.log(x, "getAppointmentById:edit-apmnt");
  //       dispatch(fetchPatient({ id: x.p_id, phone: pateintPhone, isRemovePlusOne: true }));
  //     })
  //   }
  // }, []);

  const handleComponentChange = (step) => {
    let newSteps = [...steps]
    let i = 0
    while (i < step) {
      newSteps[i].status = 'complete'
      i++
    }
    if (step !== 3) newSteps[i].status = 'current'
    setSteps(newSteps)
    if (step === 3) {
      setIsTableShow(true)
    }
  }

  const handleTabsChange = (id) => {
    if (id === 1) {
      dispatch(removeAllDataFromPatientSlice())
      dispatch(resetEveryThingFromAppointment())
    }
    const newSteps = [...steps]
    const clickedStep = newSteps.find((step) => step.id === id)
    if (clickedStep?.status === 'upcoming') return
    let i = 0
    while (i < id) {
      newSteps[i].status = 'complete'
      i++
    }
    while (i < newSteps.length) {
      newSteps[i].status = 'upcoming'
      i++
    }
    newSteps[clickedStep?.id - 1].status = 'current'
    setSteps(newSteps)
    setIsTableShow(false)
  }

  const [steps, setSteps] = useState([
    {
      id: 1,
      name: 'Patient Verification',
      href: '#',
      status: 'current',
      component: (
        <PatientVerification
          key={1}
          handleComponentChange={handleComponentChange}
        />
      ),
    },
    // {
    //   id: 2,
    //   name: 'Enter OTP',
    //   href: '#',
    //   status: 'upcoming',
    //   component: (
    //     <Otp
    //       key={2}
    //       handleComponentChange={handleComponentChange}
    //       handleCancel={() => handleTabsChange(1)}
    //     />
    //   ),
    // },
    {
      id: 2,
      name: 'Patient Details/Select Patient',
      href: '#',
      status: 'upcoming',
      component: (
        <PatientDetails
          key={3}
          handleComponentChange={handleComponentChange}
          handleCancel={() => handleTabsChange(1)}
        />
      ),
    },
    {
      id: 3,
      name: 'Appointment Details',
      href: '#',
      status: 'upcoming',
      component: (
        <AppoinmentDetails
          key={4}
          handleComponentChange={handleComponentChange}
          handleCancel={() => handleTabsChange(1)}
        />
      ),
    },
  ])

  let data = ''
  if (isTableShow) {
    data = (
      <AppointmentTable
        handleBooked={() => {
          setIsTableShow(false)
          setIsBooked(true)
        }}
        handleTabsChange={handleTabsChange}
      />
    )
  } else if (isBooked) {
    data = (
      <AppointmentConfirmed handleClickOkay={() => navigate('/dashboard')} />
    )
  }

  return (
    <div className="px-8 min-h-[90vh] mt-5">
      <div className="w-full min-h-[80vh] rounded-lg mb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center px-6 pt-5 cursor-pointer bg-white">
          {steps.map((step) => (
            <div
              onClick={
                isTableShow || isBooked
                  ? () => {}
                  : () => handleTabsChange(step.id)
              }
              key={step.name}
              className="h-[60px] md:flex-1 mt-0 min-w-[110px] md:min-w-[100px] ml-1 my-1"
            >
              {step.status === 'complete' ? (
                <span className="group flex flex-col border-l-4 sm:border-l-0 sm:border-b-4 border-sea-green py-2 pl-4 hover:border-sea-green md:border-l-0 md:border-b-4 md:pl-0 md:pb-2 md:pt-2">
                  <span className="text-sm font-medium border-sea-green text-sea-green w-full text-center flex justify-center">
                    {step.name}
                  </span>
                </span>
              ) : step.status === 'current' ? (
                <div
                  onClick={
                    isTableShow || isBooked
                      ? () => {}
                      : () => handleTabsChange(step.id)
                  }
                  className="flex flex-col items-center"
                >
                  <span
                    href={step.href}
                    className="flex flex-col border-l-4 sm:border-l-0 sm:border-b-4 border-yellow-500 w-full text-center justify-center pl-4 md:border-l-0 md:border-b-4 md:pl-0 md:pb-2 md:pt-2"
                    aria-current="step"
                  >
                    <span className="text-sm font-medium text-yellow-500">
                      {step.name}
                    </span>
                  </span>
                  <span className="text-sm font-medium text-yellow-500">
                    <CaretUpOutlined />
                  </span>
                </div>
              ) : (
                <span
                  href={step.href}
                  className="group flex flex-col border-l-4 sm:border-l-0 sm:border-b-4 border-gray-200 w-full text-center justify-center pl-4 hover:border-gray-300 md:border-l-0 md:border-b-4 md:pl-0 md:pb-2 md:pt-2"
                >
                  <span className="text-sm font-medium">{step.name}</span>
                </span>
              )}
            </div>
          ))}
        </div>
        {isTableShow || isBooked ? (
          data
        ) : (
          <div className="flex justify-center md:justify-start px-2 sm:px-0 min-h-[70vh]">
            {steps.map((x) => {
              if (x.status === 'current') {
                return x.component
              }
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default AddAppointmentNew
