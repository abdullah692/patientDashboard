import React, { useEffect, useState } from 'react'
import { Input, Button, Form, Select, DatePicker } from 'antd'
import { useNavigate } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import PatientInputFields from './PatientInputFields'

import { GiCheckMark } from 'react-icons/gi'
import { RxCross1 } from 'react-icons/rx'
import { getInsuranceType, getPatientVerification } from '../CreateAppointment/Slices/PatientVerification'
import CancelButton from './CancleButton/CancelButton'
// import { NotificationWithIcon } from '../Notification'

function SelectPateint({ setCurrent, current }) {
  const [verify, setVerify] = useState(false)
  const [addRelation, setAddRelation] = useState(false)
  const [selectedPatientIndex, setSelectedPatientIndex] = useState('')
  const [showField, setShowField] = useState(false)
  const [PhoneNoVerification, setPhoneNoVerification] = useState('')
  

  console.log('setCureent Select Patient', current)
  const [form] = Form.useForm()

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const patientPhoneNo = useSelector(
    (state) => state.VerifyPatientPhoneNo.PatientPhoneNo
  )

  const PatientVerification = useSelector(
    (state) => state.PatientReducer.verifyPatient
  )
  console.log('Patient Phone No', patientPhoneNo)
  console.log('aaaaaaaaaaaaaa', PatientVerification)

  
  const [patientInfo, setPatientInfo] = useState([
    {
      id: PatientVerification?.patient?.id,
      name: PatientVerification?.patient?.fname,
      email: PatientVerification?.patient?.email,
      phone:  PatientVerification?.patient?.phone,
      gender: PatientVerification?.patient?.gender,
      maritalStatus: PatientVerification?.patient?.marital_status,
      dob: PatientVerification?.patient?.dob,
      insurance:''
      // relation:null
    },
  ])

  const addPatient = () => {
    const newPatientFields = {
      id: (patientInfo.length + 1).toString(),
      name: '',
      email: '',
      phone: '',
      gender: '',
      maritalStatus: '',
      dob: '',
      insurance:'',
      relation: '',

    }
    const updatedPatients = [...patientInfo, newPatientFields]
    setPatientInfo(updatedPatients)
    setAddRelation(true)
  }

  console.log('PatientInfo', patientInfo)
  const handleVerify = () => {
    if (PatientVerification?.success && PatientVerification?.message) {
      setVerify(false)
    } else if (PatientVerification?.patient && PatientVerification?.success) {
      setVerify(true)
    }
  }

  const handleChange = (event) => {
    const { value } = event.target
    console.log('value', value)
    setSelectedPatientIndex(value)
    const selectedPatient = patientInfo.find((patient) => patient.id === value)
    // console.log(selectedPatient, 'aaaaaaaaaaaaaaaaaa')
  }

  const handleCancel = () => {
    console.log('Cancel ')
    setShowField(false)
  }

  const handleDeletePatient = (id) => {
    const updatedPatients = patientInfo.filter((patient) => patient.id !== id)
    setPatientInfo(updatedPatients)
    setSelectedPatientIndex('')
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    const newValue = value.replace(/[^\+0-9]/g, '')
    e.target.value = newValue
    console.log('Phone No', newValue)
    // dispatch(storePatientPhoneNo(newValue))
    setPhoneNoVerification(newValue)
  }

  // const handleChangePhoneNo=()=>{
  //   const value = e.target.value
  //   const newValue = value.replace(/[^\+0-9]/g, '')
  //   e.target.value = newValue
  //   console.log('Phone No', newValue)
  //   // dispatch(storePatientPhoneNo(newValue))
  //   setAddPhone(newValue)
  // }

//   const handleSubmit = (values,event) => {
//     console.log('Event',event);
//     if (event.target.name === 'save') {
//       // execute form submission logic
//       console.log('The vvalues are', values)
//       setPatientInfo(values)
//       setCurrent(2)
//     }
    
//   }
const handleSubmit = (saveAction) => (values) => {
    console.log('The values are', values);
    console.log('SaveAction',saveAction);
    if (saveAction === 'save') {
      setPatientInfo(values);
      setCurrent(2);
    }
  };


  const handleAddField = () => {
    // console.log(PhoneNoVerification.length,'assa');
    setShowField(true)
  }

  const handleCheck = (event) => {
    // console.log('Events',event.target.name);
    // if(event.target.name === "check")
    // {

        try {
          console.log('Patient Phone No', PhoneNoVerification)
          if (PhoneNoVerification.length <= 0) {
            console.log('fill the field')
          } else {
            dispatch(
              getPatientVerification({ patientPhoneNo: PhoneNoVerification })
            )
              .unwrap()
              .then((x) => {
                console.log('x', x)
                try {
                  const newPatientFields = {
                    id: x?.patient ? x?.patient?.id: "",
                    name: x?.patient ? x?.patient?.fname: "",
                    email: x?.patient ? x?.patient?.email: "",
                    phone: x?.patient ? x?.patient?.phone: "",
                    gender: x?.patient ? x?.patient?.gender: "",
                    maritalStatus: x?.patient ? x?.patient?.marital_status: "",
                    dob: x?.patient ? x?.patient?.dob: "",
                    relation: '',
                  }
                  const updatedPatients = [...patientInfo, newPatientFields]
                  console.log('sssddd',updatedPatients);
                  setPatientInfo(updatedPatients)
                  setAddRelation(true)
                  setShowField(false)
                } catch (error) {
                  console.log('Error Message', error)
                }
                // if (x) {
                //   setCurrent(1)
                // } else {
                //   NotificationWithIcon('error', 'There is some error with Network')
                // }
              })
          }
        } 
        catch (error) {
          console.log('Error Message', error)
        }
    }
    
//   }

  useEffect(() => {
    handleVerify()
  }, [current, patientPhoneNo])

  useEffect(()=>{
    dispatch(getInsuranceType());
  },[])

  return (
    <>
      <div className="ml-10 mt-10">
        <p className="text-[#464D59]">
          <span className="border-b-2 border-[#5ECCB9]">Patient</span> Details
        </p>
        {!verify ? (
          <p className="mt-4 pr-10 text-[#464D59]">
            We apologize, but it appears that we do not have a record of your
            number in our system. In order to proceed with your medical care, we
            kindly ask that you provide us with your information so that we can
            update our records.
          </p>
        ) : (
          ''
        )}
      </div>

      <div className="mt-10 px-10">
        <Form form={form} onFinish={handleSubmit('save')}>
          {patientInfo.map((patient, index) => {
            return (
              <PatientInputFields
                key={index}
                patientInfo={patientInfo}
                patient={patient}
                index={index}
                addRelation={addRelation}
                id={patient.id}
                verify={verify}
                handleChange={handleChange}
                selectedPatientIndex={selectedPatientIndex}
                onDelete={handleDeletePatient}
                patientData={PatientVerification}
                PhoneNoVerification={PhoneNoVerification}
              />
            )
          })}

          {!showField ? (
            <div className="">
              <Button
                className="border-2 border-[#14226D] text-[#14226D]  rounded-lg mt-10"
                onClick={handleAddField}
              >
                Add Another Patient
              </Button>
            </div>
          ) : (
            <div className="flex">
              <hr className="border-[1px] border-slate-200 mb-5" />
              <Form.Item
                name="phone"
                label="Enter Phone No"
                rules={[
                  {
                    required: true,
                    message: "Please input patient's phone number!",
                  },
                ]}
              >
                <Input
                  name="phone"
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  className=" m-2 w-[100%]  border-2 border-slate-200  rounded-md"
                  onKeyDown={(e) => {
                    if (
                      e.key !== 'Backspace' &&
                      e.key !== 'Delete' &&
                      e.key !== 'ArrowLeft' &&
                      e.key !== 'ArrowRight' &&
                      e.key !== 'ArrowUp' &&
                      e.key !== 'ArrowDown' &&
                      e.key !== 'Tab' &&
                      (e.key < '0' || e.key > '9') &&
                      e.key !== '+'
                    ) {
                      e.preventDefault()
                    }
                  }}
                />
              </Form.Item>
              <div className=" ml-10 mt-[10px]">
                <button
                  className="p-2 rounded-full mr-4  bg-green-400 text-white" name="check"
                  type="button"
                  onClick={handleCheck}
                >
                  <GiCheckMark />
                </button>
                <button
                  className="p-2 rounded-full mr-4  bg-red-600 text-white cursor-pointer" 
                  onClick={handleCancel}
                >
                  <RxCross1 />
                </button>
              </div>
            </div>
          )}

          <div className="mt-[50px] flex justify-end">
            <Form.Item>
              <button
                className="m-2 px-8 py-[6px] rounded-md text-white bg-[#5ECCB9]"
                htmlType="submit"
                
              >
                Proceed
              </button>
            </Form.Item>
            {/* <Form.Item>
              <Button className="m-2" onClick={handleCancel}>
                Cancel
              </Button>
            </Form.Item> */}
            <CancelButton setCurrent={setCurrent} current={current} />
          </div>
        </Form>
      </div>
    </>
  )
}

export default SelectPateint
