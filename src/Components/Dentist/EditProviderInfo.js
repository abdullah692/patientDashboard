import React, { useEffect, useState } from 'react'
import { Form, Upload, Button, Input, Select, DatePicker } from 'antd'
import { BsUpload } from 'react-icons/bs'
import { AiOutlineDelete } from 'react-icons/ai'
import TextArea from 'antd/es/input/TextArea'
import { MdDelete } from 'react-icons/md'
import AppointmentTypeModal from './AppointmentTypeModal'
import AddProviderSchedule from './AddProviderSchedule'
import ProviderAppointmentType from './ProviderAppointmentTypes'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import dayjs from 'dayjs'
import { useSelector, useDispatch } from 'react-redux'
import {
  getProviderInfoByProviderId,
  updateProviderInfo,
} from '../../Slices/Dentist.slice'
import { NotificationWithIcon } from '../../Utils/Notification'
import { ClipLoader } from 'react-spinners'
import { useParams } from 'react-router-dom'
import DropDownComp from '../DropDown/DropdownComp'

function EditProviderInfo() {
  const location = useLocation()
  const { id } = useParams()
  console.log('id sssssssssss', id)
  const dispatch = useDispatch()
  const providerInfo = location?.state?.providerInfoEdit
  console.log('providerInfoEdit', providerInfo)
  const [imageData, setImageData] = useState({ preview: false, fileList: [] })
  const [loading, setLoading] = useState(false)
  const [schedule, setSchedule] = useState({
    sunday: { startTime: '', endTime: '', isCheck: false },
    monday: { startTime: '', endTime: '', isCheck: false },
    tuesday: { startTime: '', endTime: '', isCheck: false },
    wednesday: { startTime: '', endTime: '', isCheck: false },
    thursday: { startTime: '', endTime: '', isCheck: false },
    friday: { startTime: '', endTime: '', isCheck: false },
    saturday: { startTime: '', endTime: '', isCheck: false },
  })

  const [dentistInfo, setDentistInfo] = useState({
    name: '',
    gender: '',
    dob: null,
    phone: '',
    email: '',
    d_id: providerInfo?.id,
    dp_url: null,
    maritalStatus: '',
    breakEndTime: '',
    breakStartTime: '',
    chairSize: null,
    schedule: {},
    apmntTypes: [],
    qualifications: [],
    bio:'',
    profession:""
  })

  const [providerQualification, setProviderQualification] = useState(
    providerInfo?.Qualifications
  )

  console.log(providerQualification, 'providerQualification')

  console.log('parentScehdule', schedule)
  const navigate = useNavigate()

  const props = {
    name: 'avatar',
    headers: {
      authorization: 'authorization-text',
    },
    accept: 'image/png, image/jpeg, image/jpg',
    maxCount: 1,
    // listType: "picture",
    beforeUpload: () => false,
    onChange: ({ fileList }) => {
      setDentistInfo({ ...dentistInfo, dp_url: null })
      setImageData((prev) => ({
        ...prev,
        fileList,
        preview: URL.createObjectURL(fileList[0].originFileObj),
      }))
    },
  }
  const [form] = Form.useForm()
  const { Option } = Select

  console.log('imageData', imageData)

  // const handleUpdateDentist = async (value) => {
  //   console.log('the values are', value)
  //   console.log('dentistSchedule',dentistInfo.schedule);
  //   console.log('dentistScheduleaaaaaaaaaa',schedule);
  //   console.log('proffesionalinfo', dentistInfo.qualifications)

  //   setLoading(true)
  //  handleUpdateProviderInfo();
  // }

  const handleUploadChange = () => {
    return new Promise((resolve) => {
      setDentistInfo((prevState) => ({
        ...prevState,
        dp_url: imageData?.fileList[0]?.originFileObj,
      }), () => {
        resolve();
      });
    });
  };
  

  const updateSchedule = () => {
    const filteredSchedule = Object.fromEntries(
      Object.entries(schedule).filter(([day, data]) => data.isCheck === true)
    )

    console.log('filteredSchedule', filteredSchedule)
    //  setSchedule(updatedSchedule);
    setDentistInfo((prevState) => ({
      ...prevState,
      schedule: filteredSchedule,
    }))
  }

  // const handleUpdateProviderInfo = () => {
  const handleUpdateDentist = () => {
    setLoading(true)
    console.log('providerAAAAAAAAAAAAAAAAAAA', dentistInfo)
    const dataToBeSend = { ...dentistInfo,phone:"+1"+ dentistInfo?.phone };
    console.log('providerAAAAAAAAAAAAAAAAAAA', dataToBeSend)

    if(!dataToBeSend.dp_url){ 
      if(imageData?.fileList?.length === 0){
        NotificationWithIcon("error", "Please Upload Provider's Image");
        return;
      }

      else{
        dataToBeSend.avatar = imageData?.fileList[0]?.originFileObj;
      }
    }
    dataToBeSend.schedule=schedule;
    console.log('dataToBeSendAAAAAAAAAAAAAAAAAAA', dataToBeSend)
    // handleUploadChange();
    // const allDaysArray = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

    // const denSchedule = Object.keys(dataToBeSend.schedule);

    // const daysNotIncluded = allDaysArray.filter(value => !denSchedule.includes(value));

    // const notIncludedSchedule = {}
    // daysNotIncluded.forEach(day => {
    //   notIncludedSchedule[day] = { startTime: "00:00:00", endTime: "00:00:00", isCheck: false }
    // })
    // const newSchedule = {
    //   ...dataToBeSend.schedule,
    //   ...notIncludedSchedule,

    // }

    // dataToBeSend.schedule = newSchedule;

    console.log(imageData?.fileList[0]?.originFileObj,'imageUrl');
    
    const isScheduleValid = Object.values(schedule).every((day) => {
      const { startTime, endTime, breakStartTime, breakEndTime } = day
      const invalidTimePattern = /\s/ // Regex pattern to check for whitespace

      if (
        (startTime && invalidTimePattern.test(startTime)) ||
        (endTime && invalidTimePattern.test(endTime)) ||
        (breakStartTime && invalidTimePattern.test(breakStartTime)) ||
        (breakEndTime && invalidTimePattern.test(breakEndTime))
      ) {
        return false // Return false if any condition is matched
      }
      return true
    })

    console.log('Is schedule valid?', isScheduleValid)
    if (isScheduleValid) {
      dispatch(
        updateProviderInfo({
          dentistInfo: dataToBeSend,
          providerId: id,
        })
      )
        .unwrap()
        .then((x) => {
          console.log(x, 'updateMessage')
          setLoading(false)
          if (x.message === 'Successfully Updated') {
            NotificationWithIcon('success', 'Provider Successfully Updated')
            navigate('/provider')
          }
        })
        .catch((err) => {
          console.log(err.data, 'error in updateDen')
          NotificationWithIcon('error', err?.data?.message)
          setLoading(false)
        })
    } else {
      setLoading(false)
      NotificationWithIcon(
        'error',
        'Please fill the schedule information properly..'
      )
    }
  }

  console.log('providerInformation', dentistInfo)

  const generateId = () => {
    const id = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0')
    return id
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    console.log('name', name)
    console.log('value', value)
    setDentistInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleDropDown = (value, name) => {
    setDentistInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const updateQualification = (index, fieldName, value) => {
    setDentistInfo((prevState) => {
      const updatedQualifications = [...prevState.qualifications]
      updatedQualifications[index] = {
        ...updatedQualifications[index],
        [fieldName]: value,
      }
      return {
        ...prevState,
        qualifications: updatedQualifications,
      }
    })
  }

  const handleQualificationChange = (index, event) => {
    const { name, value } = event.target
    console.log('name111111111111111', name)
    console.log('value', value)

    if (value.trim() !== '') {
      const fieldName = name.slice(0, -index.toString().length) // Extract the field name
      updateQualification(index, fieldName, value)
    }
  }

  console.log('DentistInfo', dentistInfo)
  console.log('providerQualification', providerQualification)

  const addApmntType = (data) => {
    console.log('datasssssssAAAAA', data)
    console.log('datasssssssAAAAA', dentistInfo?.apmntTypes)
    const isAlreadyExist = dentistInfo?.apmntTypes?.findIndex(
      (apmntT) => apmntT?.key == data?.key
    )

    let updatedApmnt = [...dentistInfo.apmntTypes]
    console.table(dentistInfo?.apmntTypes)
    console.log(data, 'isAlreadyE', isAlreadyExist)
    if (data.key === null) {
      data.key = Math.floor(1000 + Math.random() * 9000)
    }
    if (isAlreadyExist !== -1) {
      updatedApmnt[isAlreadyExist] = data
    } else {
      updatedApmnt.push(data)
    }
    setDentistInfo({ ...dentistInfo, apmntTypes: updatedApmnt })
  }

  const deleteApmntType = (data) => {
    // const updatedApmnt = dentistInfo?.apmntTypes?.filter(apmntT => apmntT.key !== data.key);
    console.log(data, 'dleteApmt')
    let updatedApmnt
    if (data.id) {
      updatedApmnt = dentistInfo?.apmntTypes?.map((apmntT) => {
        if (apmntT.key == data.key) {
          return { ...apmntT, isDeleted: true }
        }
        return apmntT
      })
    } else {
      updatedApmnt = dentistInfo?.apmntTypes?.filter(
        (apmntT) => apmntT.key != data.key
      )
    }
    console.log(updatedApmnt, 'dleteApmtA')
    setDentistInfo({ ...dentistInfo, apmntTypes: updatedApmnt })
  }

  const addQualification = () => {
    console.log('Hello World')
    const addNewQualification = {
      // id: generateId(),
      title: '',
      description: '',
      isDeleted: false,
      key: generateId(),
    }
    console.log('addNewQualification', addNewQualification)
    setDentistInfo((prevState) => ({
      ...prevState,
      qualifications: [...prevState?.qualifications, addNewQualification],
    }))
    // console.log('updateproviderQualification', updateproviderQualification)
    // setProviderQualification(updateproviderQualification)
    console.log('dentistInfo', dentistInfo)
  }

  console.log('dentistInfogggggggggggg', dentistInfo)
  const handleDelete = (id, key) => {
    console.log('Id is ', id)
    console.log('dentistInfo.apmntTypes', dentistInfo.qualifications)
    const deleteQualification = dentistInfo.qualifications?.map((item) => {
      if (id === undefined) {
        // Delete the qualification based on key
        if (item.key === key) return { ...item, isDeleted: true }
      } else {
        // Delete the qualification based on id
        if (item.id === id) return { ...item, isDeleted: true }
      }

      return item
    })
    // const deleteQualification = dentistInfo.qualification.filter((item) => {
    //   return item.id !== id
    // })
    console.log('deleteQualification', deleteQualification)
    // setProviderQualification(deleteQualification)
    setDentistInfo((prevState) => ({
      ...prevState,
      qualifications: deleteQualification,
    }))
  }

  const disabledDate = (current) => {
    // Disable future dates
    if (current && current > new Date().setHours(0, 0, 0, 0)) {
      return true
    }

    return false
  }

  const validatePhoneNumber = (_, value) => {
    if (value && value.length !== 10) {
      return Promise.reject("Phone number must be 10 digits!");
    }
    return Promise.resolve();
  };

  const handleScheduleSubmit = (schedule) => {
    // setOpenPopUp(false);
    // console.log('schedulesssssssssssssssssssssssssss',schedule);
    // setDentistInfo({ ...dentistInfo, schedule });
  }

  console.log('DentistInfoccccccccccDelete', dentistInfo)

  useEffect(() => {
    dispatch(getProviderInfoByProviderId({ providerInfoId: id }))
      .unwrap()
      .then((x) => {
        console.log(x, 'xxxxxxxxxxxxxxxxxxxx')

        const updatedSchedule = { ...schedule }
        for (let i = 0; i < x?.Availabilities?.length; i++) {
          updatedSchedule[x?.Availabilities[i]?.days] = {
            id: x?.Availabilities[i]?.id,
            startTime: x?.Availabilities[i]?.start_time,
            endTime: x?.Availabilities[i]?.end_time,
            breakStartTime: x?.Availabilities[i]?.break_start_time,
            breakEndTime: x?.Availabilities[i]?.break_end_time,
            isCheck: x?.Availabilities[i]?.isShow,
          }
        }
        console.log('updatedSchedule', updatedSchedule)
        const filteredSchedule = Object.fromEntries(
          Object.entries(updatedSchedule).filter(
            ([day, data]) => data.isCheck === true
          )
        )

        console.log('filteredSchedule', filteredSchedule)
        //  setSchedule(updatedSchedule);
        setDentistInfo((prevState) => ({
          ...prevState,
          schedule: filteredSchedule,
        }))
        console.log(updatedSchedule, 'updatedSchedule')
        setSchedule(updatedSchedule)
        const appointmentTypes = x?.AppointmentTypes?.map((y) => ({
          ...y,
          key: y.id,
        }))
        // console.log(appointmentTypes, "x.AppointmentTypes");
        
        function removePlusOne(phoneNumber) {
          if (phoneNumber.includes("+1")) {
            return phoneNumber.replace("+1", "");
          }
          return phoneNumber;
        }

        const dentist = {
          name: x?.name,
          gender: x?.gender,
          chairSize: x?.max_chair_size,
          maritalStatus: x?.marital_status,
          phone: removePlusOne(x?.phone),
          bio: x?.bio,
          email: x?.email,
          dp_url: x?.dp_url,
          dob: x?.dob ? dayjs(x?.dob) : null,
          schedule: filteredSchedule,
          apmntTypes: appointmentTypes,
          qualifications: x?.Qualifications,
          profession:x?.profession
        }
// console.log('dentist isi',dentist);
        const qual = {}
        x?.Qualifications.forEach((eachQual, index) => {
          qual[`title${index}`] = eachQual.title
          qual[`description${index}`] = eachQual.description
        })

        form.setFieldsValue({ ...dentist, ...qual })
        setDentistInfo(dentist)
      })
    // console.log('updatedSchedule', x?.Qualifications)
  }, [])

  // useEffect(() => {
  //   updateSchedule()
  // }, [schedule])

  return (
    <div>
      <Form
        form={form}
        onFinish={handleUpdateDentist}
        className=""
        initialValues={dentistInfo}
      >
        <div className="mx-8  bg-white rounded-xl">
          <div className="ml-5 pt-4">
            <p className="text-[#464D59] p-2 text-[16px] font-normal">
              <span className="border-b-2 border-[#5ECCB9]">Personal</span>{' '}
              Information
            </p>
          </div>
          <div>
            <div className="ml-5 mt-8 flex w-full">
              <div className=" col-span-1">
                <span className="h-[100px] w-[100px] overflow-hidden rounded-lg bg-gray-100 flex items-center border border-gray-300">
                  {imageData.preview ? (
                    <img src={imageData.preview} alt="" />
                  ) : dentistInfo.dp_url ? (
                    <img
                      src={`${process.env.REACT_APP_BACKEND_API_URL}/api/files/${dentistInfo.dp_url}`}
                      alt=""
                    />
                  ) : (
                    <svg
                      className="h-full w-full text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                  <div className="mt-14  bg-[#EAEAEA] ">
                    <button
                      type="button"
                      className="absolute"
                      onClick={() => {
                        setImageData({ fileList: [], preview: false })
                        setDentistInfo({ ...dentistInfo, dp_url: null })
                      }}
                    >
                      <AiOutlineDelete size={20} className="text-red-600" />
                    </button>
                  </div>
                </span>

                <Upload {...props}>
                  <button type='button' className="flex text-[#5ECCB9] mt-2">
                    <BsUpload className="mt-1 mr-2" /> <span>Upload New</span>
                  </button>
                </Upload>
              </div>

              <div className="grid grid-cols-1 col-span-1 ml-[30px] w-[86%]">
                <Form.Item
                  initialValue={dentistInfo?.bio || ' '}
                  style={{ marginBottom: 0 }}
                  name="bio"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter Brief's Info",
                    },
                  ]}
                >
                  <TextArea
                    //   showCount
                    //   maxLength={100}
                    name="bio"
                    value={dentistInfo?.bio}
                    style={{
                      height: 100,
                      resize: 'none',
                    }}
                    onChange={handleChange}
                    placeholder="Enter brief bio"
                  />
                </Form.Item>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-x-6 mx-5 mt-5">
              <Form.Item
                style={{ marginBottom: 0 }}
                name="name"
                initialValue={dentistInfo?.name || ''}
                rules={[
                  {
                    required: true,
                    message: "Please Enter Provider's Name",
                  },
                ]}
              >
                <Input
                  value={dentistInfo?.name}
                  name="name"
                  onChange={handleChange}
                  placeholder={`Provider's Name`}
                  // style={{ minWidth: "430px" }}
                  // prefix={<UserOutlined/>}
                />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: 0 }}
                name="email"
                initialValue={dentistInfo?.email || ''}
                rules={[
                  {
                    required: true,
                    message: 'Please Enter Email Address',
                  },
                ]}
              >
                <Input
                  name="email"
                  onChange={handleChange}
                  value={dentistInfo?.email}
                  placeholder="Email Address"
                />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: 0 }}
                name="phone"
                initialValue={dentistInfo?.phone || ''}
                rules={[
                  {
                    required: true,
                    message: 'Please Enter Phone Number',
                    validator:validatePhoneNumber
                  },

                ]}
              >
                <Input
                  name="phone"
                  addonBefore="+1"
                  maxLength={10}
                  placeholder="Phone Number"
                  value={dentistInfo?.phone}
                  onChange={handleChange}
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
                name="gender"
                // label="Gender"
                initialValue={dentistInfo?.gender || null}
                rules={[{ required: true, message: 'Please select gender!' }]}
              >
                <Select
                  name="gender"
                  placeholder="Select Gender"
                  onSelect={(value) => handleDropDown(value, 'gender')}
                >
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="maritalStatus"
                // label="Gender"
                initialValue={dentistInfo?.maritalStatus || null}
                rules={[
                  { required: true, message: 'Please select Marital Status!' },
                ]}
              >
                <Select
                  placeholder="Marital Status"
                  name="maritalStatus"
                  onSelect={(value) => handleDropDown(value, 'maritalStatus')}
                >
                  <Option value="single">Single</Option>
                  <Option value="married">Married</Option>
                  <Option value="divorced">Divorced</Option>
                  <Option value="widow">Widow</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="dob"
                // format={dateFormat}
                initialValue={dentistInfo.dob}
                rules={[
                  { required: true, message: 'Please Select Date Of Birth!' },
                ]}
              >
                <DatePicker
                  format={'DD/MM/YY'}
                  showToday={false}
                  // format="MM/DD/YYYY"
                  placeholder="Date Of Birth"
                  className="w-full"
                  name="dob"
                  onSelect={(value) => handleDropDown(value, 'dob')}
                  disabledDate={disabledDate}
                />
              </Form.Item>

              <Form.Item
                name="profession"
                // label="Gender"
                initialValue={dentistInfo?.maritalStatus || null}
                rules={[
                  { required: true, message: 'Please select Marital Status!' },
                ]}
              >
                <Select
                  placeholder="Profession"
                  name="profession"
                  onSelect={(value) => handleDropDown(value, 'profession')}
                >
                  <Option value="orthodontist">Orthodontist</Option>
                  <Option value="hygienist">Hygienist</Option>
                  <Option value="dentist">Dentist</Option>
                </Select>
              </Form.Item>
            </div>
          </div>
        </div>

        <div className="mx-8  bg-white rounded-xl mt-10 ">
          <div className="ml-5 pt-4">
            <p className="text-[#464D59] p-2 text-[16px] font-normal">
              <span className="border-b-2 border-[#5ECCB9]">Professional</span>{' '}
              Information
            </p>
          </div>

          <div className="mx-5 mt-4">
            {dentistInfo?.qualifications?.map((val, index) => {
              console.log('index is', val.description)
              console.log('vlauessssssssssssssssssss', val)
              //
              if (!val.isDeleted) {
                return (
                  <>
                    <div key={val?.id}>
                      <div className="flex justify-between">
                        <Form.Item
                          style={{ marginBottom: 0 }}
                          name={`title${index}`}
                          className="flex-grow"
                          rules={[
                            {
                              required: val?.title ? true : false,
                              message:
                                'Please Enter Degree or any Qualification',
                            },
                          ]}
                        >
                          <Input
                            defaultValue={val?.title}
                            name={`title${index}`}
                            value={val?.title}
                            onChange={(event) =>
                              handleQualificationChange(index, event)
                            }
                            placeholder={`Enter Degree/Qualification/Certificate`}
                            className="w-[30%]"
                          />
                        </Form.Item>

                        <span
                          className={`flex mt-2 justify-end text-red-600 cursor-pointer`}
                          onClick={() => handleDelete(val?.id, val?.key)}
                        >
                          <MdDelete size={20} /> Delete
                        </span>
                      </div>

                      <Form.Item
                        style={{ marginBottom: 0 }}
                        name={`description${index}`}
                        rules={[
                          {
                            required: val?.description ? true : false,
                            message: 'Please Enter Degree details',
                          },
                        ]}
                      >
                        <TextArea
                          defaultValue={
                            val?.description ? val?.description : ''
                          }
                          name={`description${index}`}
                          value={val?.description}
                          onChange={(event) =>
                            handleQualificationChange(index, event)
                          }
                          style={{
                            height: 100,
                            resize: 'none',
                            marginTop: '20px',
                            marginBottom: '20px',
                          }}
                          placeholder="Detail Information"
                        />
                      </Form.Item>
                    </div>
                  </>
                )
              }
            })}

            <button
              className="border-2 border-[#14226D] rounded-md px-6 py-2 my-5 text-[#14226D] font-medium"
              type="button"
              onClick={addQualification}
            >
              Add Qualification
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-0">
          <div className="ml-5 bg-white rounded-xl my-10">
            <div className="ml-5 pt-4">
              <p className="text-[#464D59] p-2 text-[16px] font-normal">
                <span className="border-b-2 border-[#5ECCB9]">Appointment</span>{' '}
                Information
              </p>
            </div>

            <div>
              <ProviderAppointmentType
                addApmntType={addApmntType}
                deleteApmntType={deleteApmntType}
                list={dentistInfo?.apmntTypes?.filter(
                  (x) => x?.isDeleted === false
                )}
                // list={dentistInfo.apmntTypes}
              />
            </div>
          </div>

          <div className="ml-5 mr-8 bg-white rounded-xl my-10">
            <div className="ml-5 pt-4">
              <p className="text-[#464D59] p-2 text-[16px] font-normal">
                <span className="border-b-2 border-[#5ECCB9]">Schedule</span>{' '}
                Information
              </p>
            </div>

            <div>
              <AddProviderSchedule
                schedule={schedule}
                setSchedule={setSchedule}
                handleScheduleSubmit={handleScheduleSubmit}
              />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex justify-end">
            {!loading ? (
              <button
                htmlType="submit"
                className="px-10 py-2 text-white bg-[#5ECCB9] rounded-md mx-3 flex mb-7"
                //   onClick={() => navigate('/provider')}
              >
                <span className="ml-2">Save</span>{' '}
              </button>
            ) : (
              <button
                // htmlType="submit"
                className="px-10 py-2 text-white bg-[#5ECCB9] rounded-md mx-3 flex mb-7"
                //   onClick={() => navigate('/provider')}
              >
                <span className="flex mx-2">
                  Save <ClipLoader className="mx-2" size={20} color="white" />
                </span>{' '}
              </button>
            )}

            <button
              className="px-6 py-2 text-gray-500 border-[1px] border-slate-500 rounded-md mx-1 mb-7"
              onClick={() => navigate('/provider')}
            >
              Cancel
            </button>
          </div>
        </div>
      </Form>
    </div>
  )
}

export default EditProviderInfo
