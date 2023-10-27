import { Button, DatePicker, Form, Input, Upload } from 'antd'
import { UserOutlined, MailOutlined, MobileOutlined } from '@ant-design/icons'
import { useState } from 'react'
import dayjs from 'dayjs'
import { ClipLoader } from 'react-spinners'
import DatePickers from '../DateTimePicker/DatePickers'
import AddScheduleModel from './AddScheduleModel'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addDentist } from '../../Slices/Dentist.slice'
import { NotificationWithIcon } from '../../Utils/Notification'
import AppointmentTypeModal from './AppointmentTypeModal'
import DropDownComp from '../DropDown/DropdownComp'
import { useEffect } from 'react'

const weekSchedule = {
  sunday: { startTime: '', endTime: '', isCheck: false },
  monday: { startTime: '', endTime: '', isCheck: true },
  tuesday: { startTime: '', endTime: '', isCheck: true },
  wednesday: { startTime: '', endTime: '', isCheck: true },
  thursday: { startTime: '', endTime: '', isCheck: true },
  friday: { startTime: '', endTime: '', isCheck: true },
  saturday: { startTime: '', endTime: '', isCheck: false },
}

const AddDentist = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [openPopUp, setOpenPopUp] = useState(false);
    const [apmntTypePopUp, setApmntTypePopUp] = useState(false);
    const [schedule, setSchedule] = useState(weekSchedule)
    const [imageData, setImageData] = useState({ preview: false, fileList: [] });
    const [dentistInfo, setDentistInfo] = useState({
        name: '',
        gender: '',
        dob: '',
        phone: '',
        email: '',
        maritalStatus: null,
        chairSize: null,
        schedule: {},
        apmntTypes: [],
        profession: '',
    })

  // useEffect(()=>{}, []);

  const handleInputChange = e => {
    setDentistInfo({ ...dentistInfo, [e.target.name]: e.target.value })
    form.setFieldsValue({ [e.target.name]: e.target.value })
  }

  const handleDropDown = (key, value) => {
    form.setFieldsValue({ [key]: value })
    setDentistInfo({ ...dentistInfo, [key]: value })
  }

  const handleScheduleSubmit = schedule => {
    setOpenPopUp(false)
    console.log(schedule, 'scheduleschedule')
    setDentistInfo({ ...dentistInfo, schedule })
  }

  // Add Dentist, Availibility and Appointment Types
  const handleAddDentist = values => {
    console.log(dentistInfo, 'dentistInfo:addDen')
    const dataToBeSend = { ...dentistInfo,phone:"+1"+ dentistInfo?.phone  }
    console.log(dataToBeSend, 'dentistInfo:addDendataToBeSend')

    if (imageData?.fileList?.length === 0) {
      NotificationWithIcon('error', "Please Upload Provider's Image")
      return
    } else {
      dataToBeSend.avatar = imageData?.fileList[0]?.originFileObj
    }

    // if(Object.keys(dataToBeSend?.schedule).length === 0){
    //   NotificationWithIcon("error", "Please Add Provider's Schedule")
    //   return;
    // }
    if (dataToBeSend?.apmntTypes?.length === 0) {
      NotificationWithIcon('error', "Please Add Provider's Appointment Types")
      return
    }

    const filterScheduleDays = Object.keys(dataToBeSend?.schedule).filter(
      eachDay => dataToBeSend['schedule'][eachDay].startTime !== ''
    )

    if (filterScheduleDays.length === 0) {
      NotificationWithIcon('error', "Please Add Provider's Schedule")
      return
    }

    const filterSchedule = {}

    for (let i = 0; i < filterScheduleDays.length; i++) {
      filterSchedule[filterScheduleDays[i]] =
        dataToBeSend['schedule'][filterScheduleDays[i]]
    }

    dataToBeSend.schedule = filterSchedule

    setLoading(true)

    dispatch(addDentist(dataToBeSend))
      .unwrap()
      .then(x => {
        console.log(x, 'handleAddDentist')
        setLoading(false)
        if (x.message === 'Provider Successfully Added') {
          NotificationWithIcon('success', 'Provider successfully added')
        }

        // form.resetFields();
        form.setFieldsValue({})
        setDentistInfo({
          name: '',
          gender: null,
          dob: '',
          phone: '',
          email: '',
          maritalStatus: null,
          chairSize: null,
          schedule: {},
          apmntTypes: [],
        })
        setImageData({ preview: false, fileList: [] })
        setSchedule(weekSchedule)
        navigate('/provider')
      })
      .catch(err => {
        console.log(err, 'error in addDen')
        if (
          err.status === 400 &&
          err?.data?.message === 'This Email is already Registered'
        ) {
          NotificationWithIcon('error', err?.data?.message)
        } else {
          NotificationWithIcon('error', err?.data?.message)
        }
        setLoading(false)
      })
  }

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
      setImageData(prev => ({
        ...prev,
        fileList,
        preview: URL.createObjectURL(fileList[0].originFileObj),
      }))
    },
  }

  const addApmntType = data => {
    const isAlreadyExist = dentistInfo?.apmntTypes?.findIndex(
      apmntT => apmntT.key === data.key
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

  const deleteApmntType = data => {
    console.log(data, 'datatatatata')
    const updatedApmnt = dentistInfo?.apmntTypes?.filter(
      apmntT => apmntT.key !== data.key
    )
    setDentistInfo({ ...dentistInfo, apmntTypes: updatedApmnt })
  }

  // console.log(dentistInfo, "dentistInfooo");
  // const handleTextEnter = (e, type) => {
  //   let regex
  //   if (type === 'text') {
  //     regex = /^[+]?[a-zA-Z ]*$/
  //   } else if (type === 'number') {
  //     regex = /^[+]?[0-9]*$/
  //   } else if (type === 'numpositive') {
  //     regex = /^[0-9]*$/
  //   }
  //   const isValid = regex.test(e.key)
  //   if (!isValid) {
  //     e.preventDefault()
  //   }
  // }

  const handleTextEnter = (e, type) => {
    let regex;
    if (type === 'text') {
      regex = /^[+]?[a-zA-Z ]*$/;
    } else if (type === 'number') {
      regex = /^[+]?[0-9]*$/;
    } else if (type === 'numpositive') {
      regex = /^[0-9]*$/;
    }
  
    // Check if the arrow-down key is pressed and the input value is empty or starts with a negative sign
    if (e.key === 'ArrowDown' && (e.target.value === '' || e.target.value.startsWith('-'))) {
      e.preventDefault(); // Prevent the default behavior of the arrow-down key
    } else {
      const isValid = regex.test(e.key);
      if (!isValid) {
        e.preventDefault();
      }
    }
  };

    return(
        <div className="min-h-screen w-full">
            <div className="flex flex-col px-5 py-2 mt-3">
                {/* <h2 className="text-gray-500 text-3xl font-semibold">Add Provider</h2> */}
                <Form form={form} onFinish={handleAddDentist} className="">
                    <div className="w-full flex flex-wrap mt-6 gap-x-10 gap-y-4">
                      <div className="w-full flex items-center h-20">
                        <span className="h-[70px] w-16 overflow-hidden rounded-lg bg-gray-100">
                          {imageData.preview ? (<img src={imageData.preview} alt="" />):(
                            <svg
                              className="h-full w-full text-gray-300"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          )}
                        </span>
                        <Upload {...props}>
                          <Button style={{ borderRadius: '6px', marginLeft: '25px', background: 'white', color: '#5ECCB9' }}>Upload</Button>
                        </Upload>
                        <button
                          type="button"
                          className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-red-500 shadow-sm hover:bg-gray-50 focus:outline-none"
                          onClick={()=>setImageData({ fileList: [], preview: false })}
                        >
                          Delete
                        </button>
                      </div>
                      <div className="">
                        <p className="text-gray-400 mb-1">Full Name</p>
                        <Form.Item
                          style={{ marginBottom: 0 }}
                          name={"name"}
                          rules={[
                            {
                              required: true,
                              message: "Please Enter Full Name",
                            },
                          ]}
                        >
                          <Input
                            size="large"
                            name="name"
                            onKeyPress={(e) => handleTextEnter(e, "text")}
                            value={dentistInfo.name}
                            onChange={handleInputChange}
                            placeholder={`Full Name`}
                            style={{ minWidth: "430px" }}
                            prefix={<UserOutlined/>}
                          />
                        </Form.Item>
                      </div>
                      <div className="">
                        <p className="text-gray-400 mb-1">Email</p>
                        <Form.Item
                          style={{ marginBottom: 0 }}
                          name={"email"}
                          rules={[
                            {
                              required: true,
                              message: "Please Enter Email",
                            },
                            {
                              type: "email",
                              message: "Please Enter a valid Email",
                            },
                          ]}
                        >
                          <Input
                            size="large"
                            name="email"
                            value={dentistInfo.email}
                            onChange={handleInputChange}
                            placeholder={`Email`}
                            style={{ minWidth: "430px" }}
                            prefix={<MailOutlined/>}
                          />
                        </Form.Item>
                      </div>
                      <div className="">
                        <p className="text-gray-400 mb-1">Mobile Number</p>
                        <Form.Item
                          style={{ marginBottom: 0 }}
                          name={"phone"}
                          rules={[
                            {
                              required: true,
                              message: "Please Enter Mobile Number",
                            },
                          ]}
                        >
                          <Input
                            type="tel"
                            size="large"
                            name="phone"
                            addonBefore="+1"
                            maxLength={10}
                            value={dentistInfo.phone}
                            onKeyPress={(e) => handleTextEnter(e, "number")}
                            onChange={handleInputChange}
                            placeholder={`Mobile Number`}
                            style={{ minWidth: "430px" }}
                            prefix={<MobileOutlined/>}
                          />
                        </Form.Item>
                      </div>
                      <div className="">
                        <p className="text-gray-400 mb-1">Max Chair(s)</p>
                        <Form.Item
                          style={{ marginBottom: 0 }}
                          name={"chairSize"}
                          rules={[
                            {
                              required: true,
                              message: "Please Enter Max Chair Size",
                            },
                          ]}
                        >
                          <Input
                            type={"text"}
                            size="large"
                            name="chairSize"
                            onKeyPress={(e) => handleTextEnter(e, "numpositive")}
                            value={dentistInfo.chairSize}
                            onChange={handleInputChange}
                            placeholder={`Max Chair(s)`}
                            style={{ minWidth: "430px" }}
                            prefix={<></>}
                          />
                        </Form.Item>
                      </div>
                      <div className="mt-1">
                          <p className="text-gray-400">Gender</p>
                          <DropDownComp size='large' width="430px" maxWidth="430px" _for={"gender"} value={dentistInfo.gender}
                            arr={["male", "female"]}
                            req_msg={"Gender"}
                            callback={handleDropDown} />
                      </div>
                      <div className="">
                          <p className="text-[#BABABA] mt-1 provider-dob">Date Of Birth</p>
                          <Form.Item
                            name="dob"
                            rules={[
                              {
                                required: true,
                                message: "Please Enter Patient's Date of birth",
                              },
                            ]}
                          >
                            <DatePicker
                            showToday={false}
                            format={"MM/DD/YY"}
                              className="my-datepicker h-[40px] min-w-[430px]"
                              value={dentistInfo.dob ? dayjs(dentistInfo.dob) : null}
                              onChange={(date, dateString) => setDentistInfo({ ...dentistInfo, dob: dateString})}
                              disabledDate={(current)=>{return current && current.isAfter(dayjs(), 'day');}}
                            />
                          </Form.Item>
                          {/* <DatePickers 
                            callback={(date) => setDentistInfo({ ...dentistInfo, dob: date})} 
                            _for={"dob"} req_msg={"Date Of Birth"} 
                            defaultValue={dentistInfo.dob}
                            width="430px" maxWidth="430px" size="large" height="40px"
                          /> */}
                      </div>
                        <div className="mt-1">
                          <p className="text-[#BABABA] ">Marital Status</p>
                          <DropDownComp value={dentistInfo.maritalStatus}  size='large' width="430px" maxWidth="430px" _for={"maritalStatus"} req_msg="Marital Status"
                            arr={["single", "married", "divorced", "widowed"]}
                            callback={(key, value)=>{setDentistInfo({ ...dentistInfo, [key]: value }); form.setFieldsValue({ [key]: value })}} />
                        </div> 
                        <div className="mt-1">
                          <p className="text-[#BABABA] ">Profession</p>
                          <DropDownComp value={dentistInfo.profession}  size='large' width="430px" maxWidth="430px" _for={"profession"} req_msg="Profession"
                            arr={["orthodontist", "hygienist", "dentist"]}
                            callback={(key, value)=>{setDentistInfo({ ...dentistInfo, [key]: value }); form.setFieldsValue({ [key]: value })}} />
                        </div> 
                        <div className="mt-[25px]">
                          <Link onClick={() => setOpenPopUp(true)}
                            className={`w-[430px] h-[40px] no-underline hover:text-white rounded-lg bg-gradient-to-r text-white from-[#0707ac] to-[#00008B] hover:from-[#0e0e92] hover:to-[#0707ac] flex items-center justify-center site p-2 `}>
                            Add Provider Schedule
                          </Link>
                        </div>
                        <div className="mt-[25px]">
                          <Link onClick={() => setApmntTypePopUp(true)}
                            className={`w-[430px] h-[40px] no-underline hover:border-blue-500 rounded-lg border-[1px] border-gray-400/40 text-black hover:text-blue-500 bg-white flex items-center justify-center site p-2 `}>
                            Add Appointment Types
                          </Link>
                        </div>
                    </div>

          <AddScheduleModel
            form={form}
            open={openPopUp}
            close={() => setOpenPopUp(false)}
            schedule={schedule}
            setSchedule={setSchedule}
            handleScheduleSubmit={handleScheduleSubmit}
          />
          <AppointmentTypeModal
            open={apmntTypePopUp}
            close={() => setApmntTypePopUp(false)}
            addApmntType={addApmntType}
            deleteApmntType={deleteApmntType}
            list={dentistInfo.apmntTypes}
          />

          <div className='text-center mt-[50px] w-full flex justify-center mb-8'>
            <button
              disabled={loading}
              onClick={() => {
                navigate(-1)
              }}
              className={`mr-4 w-[200px] rounded-lg bg-gradient-to-r text-black bg-white hover:bg-gray-200 flex items-center justify-center site p-2`}
            >
              Cancel
            </button>
            <button
              disabled={loading}
              className={`w-[200px] rounded-lg bg-gradient-to-r text-white from-sea-green to-dashboard-green ${
                loading ? '' : 'hover:from-dashboard-green hover:to-[#10967f]'
              }  flex items-center justify-center site p-2 `}
              type='submit'
            >
              Add Provider
              <span>
                <ClipLoader
                  cssOverride={{
                    display: 'block',
                    marginLeft: '1rem',
                    borderColor: 'white',
                  }}
                  color={'black'}
                  loading={loading}
                  size={20}
                />
              </span>
            </button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default AddDentist
