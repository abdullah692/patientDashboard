import { Input, Form, InputNumber, Radio, DatePicker } from 'antd'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import { storePatientPhoneNo } from '../Slices/PatientNoSlice'

import { NotificationWithIcon } from '../../Utils/Notification'
import { getPatientVerification } from './Slices/PatientVerification'

// import { storePatientPhoneNo } from '../Slices/PatientNoSlice'

function PatientVerification({ current, setCurrent }) {
  console.log('the current state is', current)

  const [phoneNo, setPhoneNo] = useState('')
  const [selectedOption, setSelectedOption] = useState('number')
  const dispatch = useDispatch()
  const PatientVerification = useSelector(
    (state) => state.PatientReducer.verifyPatient
  )

  const handleInputChange = (e) => {
    const value = e.target.value
    const newValue = value.replace(/[^\+0-9]/g, '')
    e.target.value = newValue
    console.log('Phone No', newValue)
    // dispatch(storePatientPhoneNo(newValue))
    setPhoneNo(newValue)
  }

  //   const handleSubmit = (values) => {
  //     form
  //       .validateFields()
  //       .then(() => {
  //         // if all fields are filled out, submit the form
  //         console.log('Form submitted successfully!', values)
  //         setCurrent(1)
  //       })
  //       .catch((error) => {
  //         console.log('Form submission error:', error)
  //       })
  //   }
  const handleValue = (e) => {
    setSelectedOption(e.target.value)
  }
  const handleSubmit = async (values) => {
    try {
      console.log('Form submitted successfully!', values)
      dispatch(getPatientVerification({ patientPhoneNo: phoneNo }))
        .unwrap()
        .then((x) => {
          console.log('x', x)
          if (x) {
            setCurrent(1)
          } else {
            NotificationWithIcon('error', 'There is some error with Network')
          }
        })
    } catch (error) {
      console.log('Form submission error:', error)
    }
    //         console.log('Form submitted successfully!', values)
    //         setCurrent(1)
  }

  const [form] = Form.useForm()

  return (
    <div>
      <div className="mt-10  ">
        <p className="flex justify-center text-[#464D59] text-[16px] font-semibold ">
          <span className="my-5 border-b-2 border-[#5ECCB9]">
            Enter Patient Phone Number
          </span>
        </p>
        <p className="mt-4 text-[#464D59] text-center mx-[150px]">
          In order to keep in touch with you, we kindly request that you provide
          us with your phone number. This information will be kept confidential
          and will only be used for the purposes of communicating with you about
          your medical care.
        </p>
      </div>
      <div className="text-center mt-10">
        <div className="mb-3">
          <p className="mb-3">Search by</p>
          <Radio.Group onChange={handleValue} value={selectedOption}>
            <Radio value="number">Number</Radio>
            <Radio value="name&dob">Name & Date of Birth</Radio>
          </Radio.Group>
        </div>
        {selectedOption == 'number' ? (
          <Form form={form} onFinish={handleSubmit}>
            <Form.Item
              name="phone"
              // label="Phone Number"
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
                className="p-3 m-2 w-[100%] md:w-[50%] lg:w-[25%] xl:w-[25%] border-2 border-slate-200  rounded-md"
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
            <Form.Item>
              <button
                className="text-white bg-[#5ECCB9] w-[100%] md:w-[50%] lg:w-[25%] xl:w-[25%]
py-2 rounded-md mb-10 mt-4"
              >
                Enter
              </button>
            </Form.Item>
          </Form>
        ) : (
          <Form form={form} onFinish={handleSubmit}>
            <Form.Item
              name="name"
              // label="Phone Number"
              rules={[
                {
                  required: true,
                  message: "Please input patient's name!",
                },
              ]}
            >
              <Input
                name="name"
                onChange={handleInputChange}
                placeholder="Patient's Name"
                className="p-3 w-[100%] md:w-[50%] lg:w-[25%] xl:w-[25%] border-2 border-slate-200  rounded-md"
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
            <Form.Item
              name="dob"
              // label="Phone Number"
              rules={[
                {
                  required: true,
                  message: "Please input patient's dob!",
                },
              ]}
            >
              <DatePicker showToday={false} placeholder="Select Date of Birth" className='p-3  w-[100%] md:w-[50%] lg:w-[25%] xl:w-[25%] border-2 border-slate-200  rounded-md'/>
            </Form.Item>
            <Form.Item>
              <button
                className="text-white bg-[#5ECCB9] w-[100%] md:w-[50%] lg:w-[25%] xl:w-[25%]
py-2 rounded-md mb-10 mt-4"
              >
                Enter
              </button>
            </Form.Item>
          </Form>
        )}

        <br />

        {/* {!phoneNo.length == 0 ? (
          <button
            className="text-white bg-[#5ECCB9] w-[100%] md:w-[50%] lg:w-[25%] xl:w-[25%]
         py-2 rounded-md mb-10 mt-4"
            onClick={() => setCurrent(1)}
          >
            Enter
          </button>
        ) : (
          <button
            className="text-white bg-[#5ECCB9] w-[100%] md:w-[50%] lg:w-[25%] xl:w-[25%]
         py-2 rounded-md mb-10 mt-4"
          >
            Enter
          </button>
        )} */}
      </div>
    </div>
  )
}

export default PatientVerification
