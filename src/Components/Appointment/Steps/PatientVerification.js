import React, { useEffect, useState } from 'react'
import { UserOutlined, MobileOutlined, SearchOutlined } from '@ant-design/icons'
import { Radio, Input, DatePicker, Form, AutoComplete } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import {
  createNewPatientRelation,
  fetchAllRelation,
  fetchOtpForPatient,
  fetchPatient,
  fetchPatientByNameOrDob,
  fetchPatientForRelation,
  fetchPatientPartner,
  fetchPatientWithDependent,
  patientSearch,
  removeAllDataFromPatientSlice,
} from '../../../Slices/Patient.slice'
import { ClipLoader } from 'react-spinners'
import { NotificationWithIcon } from '../../../Utils/Notification'
import {
  deleteApmntFromList,
  deleteApmntFromTable,
  resetEveryThingFromAppointment,
} from '../../../Slices/Appointment.slice'
import dayjs from 'dayjs';
import { phone_prefix } from '../../../Utils/utils'



const PatientVerification = ({
  handleComponentChange,
  fromModal = false,
  // setIsVerificationNeed = () => {},
  closeModal = () => {},
}) => {
  const [form] = Form.useForm()
  const patientData = useSelector(state => state.Patient.patientData)
  const patientRelationsData = useSelector(
    state => state.Patient.patientRelations
  )
  const [value, setValue] = useState(1)
  const [loading, setLoading] = useState(false)
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  const [patientId, setPatientId] = useState('')
  const [options, setOptions] = useState([])

  const dispatch = useDispatch()
console.log(patientData, "patientDatapatientData");
  useEffect(() => {
    if (!fromModal) {
      dispatch(removeAllDataFromPatientSlice())
      dispatch(resetEveryThingFromAppointment())
    }
  }, [])

  // Debouncing
  useEffect(() => {
    let timeout
    if (name || dob) {
      timeout = setTimeout(() => {
        dispatch(fetchPatientByNameOrDob({ name, dob }))
          .unwrap()
          .then(x => {
            console.log(x, 'xxxdatassss')
            const data = x?.data?.patient
            const formattedOptions = data?.map(item =>
              renderItem(item.name, item.dob, item.id)
            )

            const options = [
              {
                label: renderTitle(['Name', 'Date Of Birth']),
                options: formattedOptions,
              },
            ]
            setOptions(options)
          })
      }, 500)
    }

    return () => clearTimeout(timeout)
  }, [name, dob])

  const onChangeRadioBtn = e => {
    console.log('radio checked', e.target.value)
    setValue(e.target.value)
  }

  const handleDateChange = (date, dateString) => {
    console.log(date, dateString, 'hahahahahaaaa')
    setDob(dateString)
  }

  const handleKeyPress = e => {
    const regex = /^[0-9]*$/
    const isValid = regex.test(e.key)
    if (!isValid || e.target.value.length >= 10) {
      e.preventDefault()
    }
  }

  const handleTextEnter = e => {
    const regex = /^[a-zA-Z ]*$/
    const isValid = regex.test(e.key)
    if (!isValid) {
      e.preventDefault()
    }
  }

  const validateDob = e => {
    const regex = /^(\d{0,4}(-\d{0,2}(-\d{0,2})?)?)?$/
    const isValid = regex.test(e.key)
    if (!isValid) {
      e.preventDefault()
    }
  }

  const onSelect = (value, option) => {
    console.log('Selected:', value)
    console.log('Selected:', option)
    form.setFieldsValue({ dob: dayjs(option.dob), name: option?.value })
    setPatientId(option?.id)
    setName(option?.value)
    setDob(option?.dob)
  }

  const handleSearch = async value => {
    // try {
    //     const response = await axios.get(`https://api.example.com/search?q=${value}`);
    //     const data = response.data;
    //     // Format the API data to match AutoComplete's dataSource format
    //     const formattedOptions = data.map(item => ({ value: item.name }));
    //     setOptions(formattedOptions);
    // } catch (error) {
    //     console.error(error);
    // }
  }

  const handleSubmit = _ => {
    setLoading(true)
    const dataToBeSend = { name, phone, dob, id: patientId, patientId: patientData?.id }
    console.log(dataToBeSend, "hndleSubmit:dataToBeSendId");
    // if(phone && phone.length < 11){
    //   return
    // }
    if (Object.keys(patientData).length > 0) {
      let isInvalid = patientData.phone === phone
      if (isInvalid) {
        setLoading(false)
        return NotificationWithIcon('error', "Can't Add same number")
      }
    }
    if (value === 1) {
      dataToBeSend.name = ''
      dataToBeSend.dob = ''
      dataToBeSend.phone = phone.includes("+1") ? phone : phone_prefix + phone;
    } else if (value === 2) {
      dataToBeSend.phone = ''
      dataToBeSend.dob = dayjs(dataToBeSend.dob).format('YYYY-MM-DD')
    }
    console.log(dataToBeSend, "dataToBeSend:PatVeri");
    dispatch(patientSearch(dataToBeSend))
    if (fromModal) {
      dispatch(fetchPatientPartner(dataToBeSend))
        .unwrap()
        .then(x => {
          console.log('res:fetchPatientForRelation', x)
          setLoading(false)
          closeModal();
        })
        .catch(e => {
          console.log(e, 'error: fetchPatRel')
          setLoading(false)
          closeModal()
        })
    } else {
      dispatch(fetchPatientWithDependent({ ...dataToBeSend, phone: phone_prefix + phone }))
        .unwrap()
        .then(x => {
          console.log('res:fetchPatientWithDependent', x)
          setLoading(false)
          setPhone('')
          // form.resetFields();
          form.setFieldsValue({ phone: null });
          if(x.success && x.message === 'No Patient Found'){
            console.log(dataToBeSend, "dataToBeSenddataToBeSend");
            handleComponentChange(1);
          }
          else{
            console.log(dataToBeSend, "dataToBeSenddataToBeSend");
            handleComponentChange(1)
          }
        })
        .catch(e => {
          setLoading(false)
          console.log(e, 'error:dispatch:fetchPatient')
        })
    }
    // dispatch(fetchAllRelation())
  }

  const renderTitle = titles => (
    <div className='flex justify-between items-center'>
      {titles.map(title => (
        <span>{title}</span>
      ))}
    </div>
  )
  const renderItem = (title, dob, id) => ({
    id: id,
    dob: dob,
    value: title,
    label: (
      <div
        className='font-semibold'
        style={{
          display: 'flex',
          fontSize: '18px',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {title}
        <span className="text-gray-500 text-sm ml-3 font-normal">{dayjs(dob).format("MM/DD/YY")}</span>
      </div>
    ),
  })

  const disabledDate = (current) => {
    return current && current.isAfter(dayjs(), 'day');
  };

  const handleInputKeyDown = (e) => {
    // Prevent deleting the "+1" prefix using the Backspace key
    if (e.key === "Backspace" && e.target.value === "+1") {
      e.preventDefault();
    }
    // Handle other keydown events if needed
  };

  const handleInputChange = (e) => {
    // Prevent removing the "+1" prefix
    if (e.target.value === "+1" || e.target.value === "1") {
      e.target.value = "+1";
    }
    setPhone(e.target.value)
  };

  return (
    <div className='flex flex-col items-center pt-8 bg-white'>
      <div className='border-b-2 border-sea-green px-5 font-semibold'>
        Enter Patient Details
      </div>
      <div className='mt-5 text-center w-[70%]'>
        In order to keep in touch with you, we kindly request that you provide
        us with your phone number or name or date of birth. This information
        will be kept confidential and will only be used for the purposes of
        communicating with you about your patients.
      </div>
      {!fromModal && (
        <div className='mt-6 flex flex-col items-center'>
          <div className='mb-1'>Search By</div>
          <div className='flex justify-center'>
            <Radio.Group onChange={onChangeRadioBtn} value={value}>
              <Radio value={1}>Number</Radio>
              <Radio value={2}>Name & Date of birth</Radio>
            </Radio.Group>
          </div>
        </div>
      )}
      <div className='mt-14'>
        <div className='w-[340px]'>
          <Form
            form={form}
            onFinish={handleSubmit}
            initialValues={{ dob: dob ? dayjs(dob) : null, name }}
          >
            {value === 1 ? (
              <Form.Item
                name='phone'
                rules={[
                  {
                    required: !fromModal,
                    message: "Please Enter Patient's Mobile Number",
                  },
                  // {
                  //   min: 10,
                  //   pattern: /^[\d]{10,10}$/,
                  //   message: "Please enter valid number"
                  // }
                ]}
              >
                <Input
                  addonBefore="+1"
                  size="large"
                  name="phone"
                  value={phone}
                  placeholder='Enter Phone Number Here'
                  onKeyPress={handleKeyPress}
                  // onKeyDown={handleInputKeyDown}
                  onChange={handleInputChange}
                  // prefix={<MobileOutlined style={{ color: 'seagreen' }} />}
                  prefix={<></>}
                />
              </Form.Item>
            ) : (
              <div>
                <div className='w-[340px] mb-3'>
                  <AutoComplete
                    options={options}
                    onSelect={onSelect}
                    onSearch={handleSearch}
                    className='w-[340px] h-[34px]'
                    // popupClassName="my-auto-complete-dropdown"
                    popupClassName='certain-category-search-dropdown'
                    onKeyPress={handleTextEnter}
                    dropdownMatchSelectWidth={340}
                    style={{
                      width: 340,
                    }}
                  >
                    <Input.Search
                      placeholder='Enter Name here'
                      size='large'
                      name='name'
                      value={name}
                      className='my-input-search h-[34px]'
                      onChange={e => setName(e.target.value)}
                      prefix={<SearchOutlined className='my-search-icon' />}
                    />
                  </AutoComplete>
                </div>
                {/* <div className="w-[340px] mb-3">
                        <AutoComplete
                            options={options}
                            onSelect={onSelect}
                            onSearch={handleSearch}
                            className='w-[340px] h-[34px]'
                            // popupClassName="my-auto-complete-dropdown"
                            popupClassName="certain-category-search-dropdown"
                            dropdownMatchSelectWidth={340}
                            style={{
                                width: 340,
                            }}
                        >
                            <Input.Search placeholder="Enter Date Of Birth here" size="large"
                                name="dob"
                                value={name}
                                onKeyPress={validateDob}
                                className='my-input-search h-[34px]' onChange={(e)=>setDob(e.target.value)}
                                prefix={<SearchOutlined className="my-search-icon" />}    
                            />
                        </AutoComplete>
                    </div> */}
                <Form.Item
                  name='dob'
                  rules={[
                    {
                      required: true,
                      message: "Please Enter Patient's Date of birth",
                    },
                  ]}
                >
                  <DatePicker
                  showToday={false}
                  format="MM/DD/YY"
                    className="my-datepicker h-[40px] w-full"
                    value={dob ? dayjs(dob) : null}
                    onChange={handleDateChange}
                    disabledDate={disabledDate}
                  />
                </Form.Item>
              </div>
            )}
            <button
              type='submit'
              disabled={loading}
              className='flex justify-center items-center w-full rounded-lg bg-gradient-to-r border border-sea-green text-white from-sea-green to-dashboard-green hover:from-dashboard-green hover:to-[#10967f] font-semibold py-[11px] mt-3'
            >
              Enter
              <span>
                <ClipLoader
                  cssOverride={{
                    display: 'block',
                    marginLeft: '1rem',
                    borderColor: 'white',
                  }}
                  color={'seagreen'}
                  loading={loading}
                  size={20}
                />
              </span>
            </button>
          </Form>
        </div>
      </div>
      <div className='w-[340px]'></div>
    </div>
  )
}

export default PatientVerification
