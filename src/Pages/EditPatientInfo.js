import React from 'react'
import PatientDetails from '../Components/Appointment/Steps/PatientDetails'
import { useNavigate, useParams } from 'react-router-dom'

import { addPatients } from '../Slices/Patient.slice'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import Button from '../Components/PatientDetail/Button'

const EditPatientInfo = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const allRelations = useSelector((state) => state.Patient.relations)
  const [reUpdate, setReUpdate] = useState(false)
  const [changeBtn, setChangeBtn] = useState(true)

  console.log(id, 'idddddddddddddddd')
  const navigateToPatientList = () => {
    navigate('/patients')
  }

  const handleSubmit = () => {
    setReUpdate(true)
  }

  const callbackForNewData = (data) => {
  
  }

  return (
    <div className="m-4 grid grid-cols-1 gap-4 ">
      <div className="col-span-2 relative">
        <PatientDetails
          rounded={true}
          checkbox={false}
          inputSize={'small'}
          heading={false}
          // isBtnShow={false}
          handleCancel={navigateToPatientList}
          changeBtn={changeBtn}
          refreshId={id}
          callbackForNewData={callbackForNewData}
          reUpdate={reUpdate}
        />
      </div>
      <div className="col-span-3">
        {/* <Button
          b1={'Save'}
          b2={'Cancel'}
          classname={'flex justify-end m-2'}
          submitHandle={handleSubmit}
          cancle={navigateToPatientList}
          // setEditPatient={setEditPatient}
        /> */}
      </div>
    </div>
  )
}

export default EditPatientInfo
