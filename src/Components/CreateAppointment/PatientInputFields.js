import React, { useState } from 'react'
import { Input, Button, Form, Select, DatePicker } from 'antd'
import { MdDelete } from 'react-icons/md'
import dayjs from 'dayjs'
import { useSelector } from 'react-redux'

function PatientInputFields({
  patient,
  index,
  addRelation,
  patientInfo,
  id,
  handleChange,
  selectedPatientIndex,
  onDelete,
  patientData,
}) {
  const { Option } = Select
  const dateFormat = 'YYYY/MM/DD'
  const InsuranceType = useSelector(
    (state) => state?.PatientReducer?.insuranceTypes
  )
  console.log('cccccccccccc', InsuranceType)

  //   const dateFormat = 'YYYY-MM-DD';
  //   console.log('PatientObject', patientInfo)
  console.log('index', selectedPatientIndex)
  console.log('patientData', patientData)

  const PatientName = () => {
    if (patientData?.message && patientData?.success) {
      return null
    } else if (patientData?.patient && patientData?.success) {
      return patientData?.patient?.fname + ' ' + patientData?.patient?.lname
    }
  }

  return (
    <div key={index}>
      {index !== 0 ? <hr className="border-[1px] border-slate-200 mb-5" /> : ''}
      <div className="flex justify-between">
        <div className="absolute">
          <input
            type="radio"
            value={id}
            name="selectedItem"
            checked={selectedPatientIndex === id}
            onChange={handleChange}
          />
        </div>

        <div className="ml-8 grid grid-cols-4 gap-4 w-full">
          <Form.Item
            style={{ marginBottom: 0 }}
            name={`name${index}`}
            //    initialValue={
            //     patientData ? patientData?.patient?.fname + " " + patientData?.patient?.lname : ""
            //    }
            initialValue={PatientName()}
            rules={[
              {
                required: true,
                message: 'Please Enter Patient Full Name',
              },
            ]}
          >
            <Input
              name="fullname"
              //   onChange={(e) =>
              //     setPatientInfo({ ...patientInfo, name: e.target.value })
              //   }
              placeholder="Enter Full Name"
            />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 0 }}
            name={`email${index}`}
            initialValue={patientData?.patient?.email || ''}
            rules={[
              {
                required: true,
                message: 'Please Enter Email Address',
              },
            ]}
          >
            <Input
              name="email"
              //   onChange={(e) =>
              //     setPatientInfo({ ...patientInfo, email: e.target.value })
              //   }

              placeholder="Email Address"
            />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 0 }}
            name={`phone${index}`}
            initialValue={patientData?.patient?.phone || ''}
            rules={[
              {
                required: true,
                message: 'Please Enter Phone Number',
              },
            ]}
          >
            <Input
              name={`phone${index}`}
              //   onChange={(e) =>
              //     setPatientInfo({ ...patientInfo, phone: e.target.value })
              //   }
              placeholder="Phone Number"
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
              //   style={{ width: 180 }}
            />
          </Form.Item>

          <Form.Item
            name={`gender${index}`}
            // label="Gender"
            initialValue={patientData?.patient?.gender || null}
            rules={[{ required: true, message: 'Please select gender!' }]}
          >
            <Select
              placeholder="Select Gender"
              //   onChange={(value) =>
              //     setPatientInfo({ ...patientInfo, gender: value })
              //   }
            >
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name={`maritalstatus${index}`}
            // label="Gender"
            initialValue={patientData?.patient?.marital_status || null}
            rules={[
              { required: true, message: 'Please select Marital Status!' },
            ]}
          >
            <Select
              placeholder="Marital Status"
              //   onChange={(value) =>
              //     setPatientInfo({ ...patientInfo, materialStatus: value })
              //   }
            >
              <Option value="single">Single</Option>
              <Option value="married">Married</Option>
              <Option value="divorced">Divorced</Option>
              <Option value="widow">Widow</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name={`dob${index}`}
            // format={dateFormat}
            rules={[
              { required: true, message: 'Please Select Date Of Birth!' },
            ]}
          >
            <DatePicker
            showToday={false}
              placeholder="Date Of Birth"
              className="w-full"
              defaultValue={
                patientData?.patient?.dob
                  ? dayjs(patientData?.patient?.dob, 'YYYY/MM/DD')
                  : ''
              }
            />
          </Form.Item>

          <Form.Item
            name={`insuranceType${index}`}
            // label="Gender"
            // initialValue={patientData?.patient?.marital_status || null}
            rules={[
              { required: true, message: 'Please select Insurance Type!' },
            ]}
          >
            <Select
              placeholder="Insurance Type"
              //   onChange={(value) =>
              //     setPatientInfo({ ...patientInfo, materialStatus: value })
              //   }
            >
              {InsuranceType?.map((ins) => {
                return(

                <Option value={ins.type} key={ins.id}>
                  {ins.type}
                </Option>
                )
              })}
              {/* <Option value="Aetna PPO">Aetna PPO</Option>
              <Option value="Anthem BCBS PPO">Anthem BCBS PPO</Option>
              <Option value="Cigna PPO">Cigna PPO</Option> */}
            </Select>
          </Form.Item>

          {index > 0 ? (
            <>
              <Form.Item
                style={{ marginBottom: 0 }}
                name={`relation${index}`}
                rules={[
                  {
                    required: true,
                    message: 'Enter your relation with patient',
                  },
                ]}
              >
                <Select
                  placeholder="relation"
                  //   onChange={(value) =>
                  //     setPatientInfo({ ...patientInfo, materialStatus: value })
                  //   }
                >
                  <Option value="son">Son</Option>
                  <Option value="daughter">Daughter</Option>
                  <Option value="husband">Husband</Option>
                  <Option value="wife">Wife</Option>
                  <Option value="father">Father</Option>
                  <Option value="mother">Mother</Option>
                </Select>
              </Form.Item>
            </>
          ) : (
            ''
          )}
        </div>
        <div className="w-[50px] ml-5">
          {selectedPatientIndex === id && (
            <button onClick={() => onDelete(id)}>
              <MdDelete size={20} className="mt-1 hover:text-red-600" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default PatientInputFields
