import React, { useEffect, useState } from 'react'
import { Form, Input } from 'antd'
import otpImage from '../../../assets/images/otp.png'
import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createNewPatientRelation, fetchPatient, fetchPatientForRelation, setOtpVerified, verifyOtpOnlyForPatient, } from '../../../Slices/Patient.slice'
import FullPageLoader from '../../../Utils/FullPageLoader'
import { NotificationWithIcon } from '../../../Utils/Notification'

const Otp = ({ handleComponentChange, handleCancel, fromModal=false, closeModal=()=>{}, phoneNum, removePhoneNum, }) => {
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const dataToBeSend = useSelector((state) => ({
    ...state.Patient.patientSearchData,
    sid: state.Patient.sid,
  }))
  const patientRelations = useSelector(
    (state) => state.Patient.patientRelations
  )
  // const sid = useSelector(state => state.Patient.sid);
  const [disabled, setDisabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [otpInputs, setOtpInputs] = useState(['', '', '', ''])
  const otpInputRefs = useRef([
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
  ])

  const handleKeyPress = (e) => {
    const regex = /^[0-9]*$/
    const isValid = regex.test(e.key)
    if (!isValid) {
      e.preventDefault()
    }
  }

  const handleSubmit = () => {
    setLoading(true)
    const otp = otpInputs.join('')
    console.log(otp, 'Otttttttttttttppppppp')
    console.log({ dataToBeSend })
    if(fromModal && phoneNum){
      console.log({ sid: dataToBeSend.sid, otp, phone: phoneNum }, "fromModal && phoneNum");
      dispatch(verifyOtpOnlyForPatient({ sid: dataToBeSend.sid, otp, phone: phoneNum })).unwrap().then(x => {
        console.log(x, "verifyOtpOnlyForPatient:dis");
        if(x.success && x.message === 'otp matched'){
          removePhoneNum();
          NotificationWithIcon("success", "Phone Number Verified");
        }
        dispatch(setOtpVerified({ [phoneNum]: true }));
        setLoading(false);
        closeModal();
        setOtpInputs(['', '', '', ''])
        otpInputRefs.current[0].current.focus()
      }).catch(e => {
        console.log(e, "verifyOtpOnlyForPatient");
        setLoading(false);
        if (e.response.data.message === 'OTP does not match') {
          NotificationWithIcon('error', 'Wrong OTP')
          setOtpInputs(['', '', '', ''])
          otpInputRefs.current[0].current.focus()
        }
      })
    }
    else if(fromModal){
      dispatch(fetchPatientForRelation({...dataToBeSend, otp})).unwrap().then(x => {
        console.log(x, "fetchPatientForRelation:rress");
        if (x && x?.patient && Object.keys(x?.patient).length > 0) {
          dispatch(
            createNewPatientRelation([
              ...patientRelations,
              { ...x?.patient, relation: '', relationId: null },
            ])
          )
          dispatch(setOtpVerified({ [x?.patient?.phone]: true }))
        } else {
          const newPatient = {
            dob: null,
            dp_url: null,
            email: '',
            gender: null,
            marital_status: null,
            name: '',
            phone: '',
            relation: '',
            relationId: null,
            isNew: true,
            isDeleted: false,
            key: Math.floor(Math.random() * 10000),
            ...dataToBeSend,
          }
          dispatch(
            createNewPatientRelation([...patientRelations, newPatient])
            )
          dispatch(setOtpVerified({ [x?.patient?.phone]: true }))
          }
          setLoading(false)
          closeModal();
          setOtpInputs(['', '', '', ''])
          otpInputRefs.current[0].current.focus()
      }).catch(e => {
        setLoading(false)
          console.log(e.response.data.message, 'error in otp component')
          if (e.response.data.message === 'OTP does not match') {
            NotificationWithIcon('error', 'Wrong OTP')
            setOtpInputs(['', '', '', ''])
            otpInputRefs.current[0].current.focus()
          }
      });
    }
    else{
      dispatch(fetchPatient({ ...dataToBeSend, otp }))
        .unwrap()
        .then((x) => {
          console.log(x, 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
          // dispatch(setOtpVerified(true))
          setLoading(false)
          if(!fromModal){
            handleComponentChange(2)
          }else{
            closeModal()
          }
          setOtpInputs(['', '', '', ''])
          otpInputRefs.current[0].current.focus()
        })
        .catch((e) => {
          setLoading(false)
          console.log(e.response.data.message, 'error in otp component')
          if (e.response.data.message === 'OTP does not match') {
            NotificationWithIcon('error', 'Wrong OTP')
            setOtpInputs(['', '', '', ''])
            otpInputRefs.current[0].current.focus()
          }
        });
    }
  }

  const handleOtpInputChange = (value, index) => {
    const updatedInputs = [...otpInputs]
    updatedInputs[index] = value
    setOtpInputs(updatedInputs)

    // Automatically focus on the next input if a number is entered
    if (value && index < otpInputs.length - 1) {
      otpInputRefs.current[index + 1].current.focus()
    }

    // Check if the current input is the last one and all inputs are filled
    // if (index === otpInputs.length - 1 && updatedInputs.every(input => input !== "")) {
    //     // Call your function here
    //     handleSubmit();
    // }
  }

  useEffect(() => {
    if (otpInputs.join('').length === 4) {
      handleSubmit()
    }
  }, [otpInputs])
  

  return (
    <div className="w-full min-h-full bg-white">
      <FullPageLoader isShow={loading} />
      <div className="w-full h-[350px] mt-4 flex justify-center">
        <img src={otpImage} alt="otp" height={330} />
      </div>
      <div className="w-full mt-5 flex justify-center items-center flex-col">
        {phoneNum && <p className="text-center text-gray-500 ">
          You are not verify <span className="font-bold">{phoneNum}</span>
        </p>}
        <p className="text-center text-gray-500 ">
          An <span className="font-bold">OTP</span> has been send on your number
        </p>
        <p className="text-center text-gray-500 ">
          Please Enter <span className="font-bold">OTP</span> in below box
        </p>
      </div>
      <div className="w-full mt-3 flex justify-center">
        <Form form={form} onFinish={() => {}}>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Please Enter Patient's Mobile Number",
              },
            ]}
          >
            {otpInputs.map((inputValue, index) => (
              <Input
                key={index}
                size="large"
                style={{
                  width: 60,
                  border: '2px solid #2E8B57',
                  marginRight: 8,
                  textAlign: 'center',
                  color: '#2E8B57',
                  fontWeight: 'bold',
                  fontSize: 20,
                }}
                autoFocus={index === 0} // Autofocus only on the first input
                value={inputValue}
                placeholder="0"
                onKeyPress={handleKeyPress}
                maxLength={1} // Limit each input to a single character
                onChange={(e) => handleOtpInputChange(e.target.value, index)}
                ref={otpInputRefs.current[index]}
              />
            ))}
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Otp
