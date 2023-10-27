import React, { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  deleteProvider,
  getAllProviderList,
  getDentistList,
  getProviderInfoByProviderId,
} from '../../Slices/Dentist.slice'
import { Table, Space, Button, Input, Select, Tooltip } from 'antd'
import { useNavigate } from 'react-router-dom'
import { FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import { getAllAppointmentTypes } from '../../Slices/Appointment.slice'

const ProviderList = () => {
  const [isLoading, setIsLoading] = useState(false)
  const dentistList = useSelector((state) => state.Dentist.dentistList)

  const providerList = useSelector(
    (state) => state?.Dentist?.providerListSearch
  )
  console.log('providerListSearch', providerList)
  const appointmentTypes = useSelector(
    state => state?.Appointment?.allAppointmentTypes
  )

  const [searchBy, setSearchBy] = useState({
    name: '',
    gender: '',
    appointmentType: '',
  })
  console.log('appointmentTypesxcxx', appointmentTypes)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { Option } = Select

  // const handleFilterData=(providerInfo)=>{
  //   console.log('providerInfo',providerInfo);
  //   navigate('/providerpersonalinfo', { state: { providerInfo: providerInfo } })
  //   // const filterData=providerInfo.filter((info)=>{

  //   // })
  // }

  const handleDelete = (id) => {
    console.log('the id to delete', id)
    dispatch(deleteProvider({ DocId: id }))
      .unwrap()
      .then((x) => {
        console.log('Deletexxxxxxxxxxxxx', x)
        if(x==="provider deleted")
        {

          setIsLoading(true)
          dispatch(getAllProviderList({ searchBy }))
            .unwrap()
            .then((x) => {
              console.log(x, 'vvvvvvvvvvvvvvvvvvvv')
              setIsLoading(false)
            })
            .catch((e) => {
              setIsLoading(false)
            })
        }
      })
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className='flex'>
          <img
            src={
              record?.dp_url
                ? `${process.env.REACT_APP_BACKEND_API_URL}/api/files/${record.dp_url}`
                : ''
            }
            alt='Profile'
            className='h-6 w-6'
          />
          <p
            className="ml-4 text-[#5ECCB9] font-semibold cursor-pointer"
            onClick={
              () => navigate(`/providerpersonalinfo/${record.id}`)
              // handleFilterData(record)
            }
          >
            {text}
          </p>
        </div>
      ),
      //   render: (text) => <a>{text}</a>,
      //   width: 150,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      //   width: 80,
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
      key: 'phone',
      ellipsis: true,
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender 1',
      ellipsis: true,
    },
    {
      title: 'Appointment Type',
      dataIndex: 'AppointmentTypes',
      key: 'AppointmentTypes',
      ellipsis: true,
      render: (text, record) => (
        <div className="flex">
          {record?.AppointmentTypes?.map((app) => {
            console.log('record', record)
            console.log('the color is', app.color)
            return (
              <Tooltip title={app?.type}>
                <div
                  key={app.id}
                  style={{ backgroundColor: app?.color, margin: '2px' }}
                  className={`h-4 w-4 rounded-full m-1']`}
                />
              </Tooltip>
            )
          })}
          {/* <div className="h-4 w-4 bg-purple-700 rounded-full m-1" />
          <div className="h-4 w-4 bg-blue-600 rounded-full m-1" />
          <div className="h-4 w-4 bg-green-400 rounded-full m-1" /> */}
        </div>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      ellipsis: true,
      // render: (_, record) => <div className='ml-4'><a onClick={()=>{navigate("/updateprovider", { state: {id: record.id} });console.log(record, "record")}}><EditOutlined /></a></div>,
      render: (text, record) => (
        <Space size='middle'>
          <Button
            className="border-none text-[#14226D]"
            icon={<FaEdit size={18} />}
            onClick={() => {
              navigate(`/editProviderInfo/${record?.id}`)
              // handleEdit(record?.id)
              console.log(record, 'record')
            }}
            // onClick={()=>handleEdit(record?.patientPhoneNum)}
          />
          <Button
            className="border-none text-red-600 "
            icon={<MdDelete size={18} />}
            onClick={() => handleDelete(record?.id)}
          />
        </Space>
      ),
    },
  ]

  const handleEdit = (id) => {
    console.log('idsssssssssss', id)
    dispatch(getProviderInfoByProviderId({ providerInfoId: id }))
      .unwrap()
      .then((x) => {
        console.log(x, 'xxxxxxxxxxxxxxxxxxxx')
        if (x) {
          navigate('/editProviderInfo', { state: { providerInfoEdit: x } })
        }
      })
  }

  const handleSearch = () => {
    setIsLoading(true)
    dispatch(getAllProviderList({ searchBy }))
      .unwrap()
      .then((x) => {
        console.log(x, 'vvvvvvvvvvvvvvvvvvvv')
        setIsLoading(false)
      })
      .catch((e) => {
        setIsLoading(false)
      })
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setSearchBy((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleDropDown = (value, name) => {
    setSearchBy(prevState => ({
      ...prevState,
      [name]: value,
    }))
  }

  console.log('searchBy', searchBy)

  const onChange = (time, timeString) => {
    console.log(time, timeString)
  }

  console.log(dentistList, 'dentistList1111')
  const transformedData = providerList?.map(item => {
    console.log('Itemss are', item)
    return { ...item, key: item.id }
  })

  useEffect(() => {
    setIsLoading(true)
    dispatch(getAllAppointmentTypes())
    dispatch(getAllProviderList({ searchBy }))
      .unwrap()
      .then(x => {
        console.log(x, 'xxxxxxxxxxxxxxxxxxxx')
        setIsLoading(false)
      })
      .catch(e => {
        setIsLoading(false)
      })
  }, [])

  return (
    // <div className=" text-white h-[calc(100vh-96px)] overflow-auto ">
    // <div className="max-w-[130vw] ">


    <div className='mx-8 bg-white rounded-xl'>
      <div className='ml-5 pt-6'>
        <span className='text-[18px] mt-5'>Search By</span>
      </div>

      <div className='grid grid-cols-6 gap-6 ml-5 mt-5'>
        <Input
          name='name'
          value={searchBy.name}
          onChange={handleChange}
          placeholder='Name'
          // disabled={isDisabled}
        />
        <Select
          name="gender"
          placeholder="Gender"
          onSelect={(value) => handleDropDown(value, 'gender')}
        >
          <Option value='male'>Male</Option>
          <Option value='female'>Female</Option>
          <Option value='other'>Other</Option>
        </Select>

        <Select
          name="appointmentType"
          placeholder="Appointment Types"
          onSelect={(value) => handleDropDown(value, 'appointmentType')}
        >
          {appointmentTypes?.map((app, index) => {
            return (
              <Option value={app.type} key={index}>
                {app.type}
              </Option>
            )
          })}
        </Select>

        {/* <TimePicker
          placeholder="Available Slot"
          onChange={onChange}
          defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')}
        />

        <DatePicker
          name="date"
          placeholder="Available Date"
          className="w-full"
        /> */}

        <button
          className="mr-5 col-start-6 col-span-1 rounded-md text-white bg-[#5ECCB9]"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      <div className="flex justify-center min-h-screen mt-6 px-4">
        {providerList && (
          <Table
            columns={columns}
            dataSource={transformedData}
            loading={isLoading}
          />
        )}
      </div>
    </div>
      // </div>
      // </div>
    // </>
  )
}

export default ProviderList
