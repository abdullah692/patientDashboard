import React, { useState } from 'react'
import { Steps, Popover } from 'antd'
import Header from '../Header/Header'
import PatientVerification from './PatientVerification'
import SelectPateint from './SelectPateint'
import DateTimeSlot from './DateTimeSlot'
import healthH from '../../assets/images/healthH.png'
import genesisG from '../../assets/images/genesisG.png'
import AppointmentSummary from './AppointmentSummary'
import AppointmentTypes from './AppointmentTypes'

const { Step } = Steps

function CreateAppointmentSteps(props) {
  const [current, setCurrent] = useState(0)

  const onChange = (value) => {
    console.log('onChange:', value)
    setCurrent(value)
  }
  console.log('the state of current is on main page', current)
  // const handleStepClick = (step) => {
  //   setCurrent(step)
  // }
  const steps = [
    {
      title: 'Patient Verification',
      status: current >= 0 ? 'finish' : 'wait',
    },
    {
      title: 'Patient Details/Select Patient',
      status: current >= 1 ? 'finish' : 'wait',
    },
    {
      title: 'Appointment Details',
      status: current >= 2 ? 'finish' : 'wait',
    },
  ]
  // steps[current].status = 'process'

  return (
    <>
      <div>
        {/* <img src={healthH} className="fixed top-0 left-0" /> */}
      </div>
      <div>
        {/* <img src={genesisG} className="fixed bottom-0 right-0" /> */}
      </div>
      {/* <Header /> */}
      <div className="!mt-[50px] mx-[100px] rounded-md  bg-white px-8 py-2">
        <Steps
          type="navigation"
          current={current}
          onChange={onChange}
          className="site-navigation-steps"
        >
          {steps.map(({ title, description, status }, index) => (
            <Steps.Step
              key={index}
              status={status}
              // disabled={index>current}
              title={
                <span
                  className={`${status === 'finish' ? 'text-[#5ECCB9]' : ''}`}
                >
                  {title}
                </span>
              }
              description={description}
            />
          ))}
        </Steps>
        {current == 0 ? (
          <div>
            <PatientVerification setCurrent={setCurrent} current={current} />
          </div>
        ) : current == 1 ? (
          <SelectPateint setCurrent={setCurrent} current={current} />
        ) : current == 2 ? (
          <DateTimeSlot setCurrent={setCurrent} current={current} />
        ) : current >= 2 ? (
          <AppointmentSummary setCurrent={setCurrent} current={current} />
        )   : (
          ''
        )}
      </div>

      {/* <div className='grid grid-cols-5'>
    <div className={`m-5 ${current == 0  ? "text-purple-500 border-b-2 border-purple-400" : " text-blue-500 border-b-2 border-blue-500"}`} onClick={() => handleClick(0)}>
        <p>Patient Verification</p>
    </div>
    <div className={`m-5 ${current == 1 ? "text-purple-500 border-b-2 border-purple-400" : " text-blue-500 border-b-2 border-blue-500"}`} onClick={() => handleClick(1)}>
        <p>Patient Details/Select Patient</p>
    </div>
    <div className='m-5 border-b-2' onClick={() => handleClick(2)}>
        <p>Appointment Type</p>
    </div>
    <div className='m-5 border-b-2'>
        <p>Date & Time Slot</p>
    </div>
    <div className='m-5 border-b-2'>
        <p>Provider</p>
    </div>

    
    </div>
    <div >
        {
            current== 0 ? "Patient Verification Tab" : current== 1 ? "Patient Details/Select Patient Tab" : "Appointment Type Tab"
        }
    </div> */}
    </>
  )
}

export default CreateAppointmentSteps
