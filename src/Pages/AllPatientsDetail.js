import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addPatients, fetchPatient } from '../Slices/Patient.slice'
import { useState } from 'react'
import PatientDetails from '../Components/Appointment/Steps/PatientDetails'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import AppointmentHistory from '../Components/PatientDetail/AppointmentHistory'
import Button from '../Components/PatientDetail/Button'

const AllPatientsDetail = () => {
  const navigate = useNavigate()
  // const { state } = location
  // console.log(state, 'valueueueue')
  const [readOnly, setReadOnly] = useState(true)
  const patientData = useSelector((state) => state.Patient.patientData)
  const { id } = useParams()
  console.log(id, 'idddddddddddddddd')
  console.log(patientData, 'patientdataaaaadasdadssad')

  // useEffect(() => {
  //   try {
  //     setLoading(true)
  //     console.log(id, "iiiiiiiiiiiidddddddddd");
  //     dispatch(fetchPatient({ id: id }))
  //       .unwrap()
  //       .then((x) => {
  //         console.log(x, 'xxxxxxxxxxxasdasx')
  //         setLoading(false)
  //       })
  //       .catch((err) => {
  //         console.log(err, 'errorrr')
  //         setLoading(false)
  //       })
  //   } catch (error) {
  //     console.log(error, 'errororororoorr')
  //   }
  // }, [])

  const handleSubmit = () => {
    navigate(`/edit-patient-info/${id}`)
  }

  const navigateToPatientList = () => {
    navigate('/patients')
  }

  return (
    <div className={`m-4 grid grid-cols-3 gap-4  `}>
      <div className="col-span-2 relative ">
        <PatientDetails
          refreshId={id}
          isBtnShow={false}
          heading={false}
          deleteicon={false}
          rounded={true}
          checkbox={false}
          readOnly={readOnly}
        />
      </div>

      <div className="bg-white rounded-2xl col-span-1 relative max-h-[540px] overflow-auto">
        <AppointmentHistory id={id} />
      </div>
      <div className="col-span-3">
        <Button
          b1={'Edit'}
          b2={'Cancel'}
          classname={'flex justify-end m-2'}
          submitHandle={handleSubmit}
          cancle={navigateToPatientList}
          // setEditPatient={setEditPatient}
        />
      </div>
    </div>
  )
}

export default AllPatientsDetail
