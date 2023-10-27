import React, { useEffect, useState } from 'react'
import {
  Form,
  Input,
  Modal,
  Table,
  Button,
  Tooltip,
  Dropdown,
  Menu,
  Space,
} from 'antd'
import {
  PicLeftOutlined,
  EditOutlined,
  DeleteFilled,
  DownOutlined,
} from '@ant-design/icons'
import DurationPicker from '../../Utils/DurationPicker'
import { MdDelete } from 'react-icons/md'
import { FaEdit } from 'react-icons/fa'

const ProviderAppointmentType = ({
  open,
  close,
  addApmntType,
  deleteApmntType,
  list,
}) => {
  const [form] = Form.useForm()
  const [error, setError] = useState({
    type: null,
    color: null,
    timePicker: null,
    priority: null,
    isShow: false,
  })


  console.log('the list is',list
  );
  const [appointmentType, setAppointmentTypes] = useState({
    color: '',
    type: '',
    key: null,
    duration: '00:05:00',
    priority: null,
    id: null,
    isDeleted: false,
  })
  console.log(appointmentType, 'appointmentTypeeditaaaaaaaaaa')
  const [isAlreadyExist, setIsAlreadyExist] = useState(false)

  const submit = () => {
    
    console.log(appointmentType, 'appointmentTypeeditaaaaaaaaaa')
    if (!appointmentType.type) {
      setError({
        ...error,
        type: 'Please Enter Appointment Type',
        isShow: true,
        color: null,
      })
      return
    }
    if (!appointmentType.color) {
      setError({ ...error, color: 'Please Select Color', isShow: true })
      return
    }
    if (!appointmentType.priority) {
      setError({ ...error, priority: 'Select Priority', isShow: true })
      return
    }
    console.log(appointmentType, 'color and type')
    addApmntType(appointmentType)
    setAppointmentTypes({
      color: '',
      type: '',
      duration: '00:05:00',
      priority: null,
      key: null,
      isDeleted: false,
    })
    setIsAlreadyExist(false)
  }

  const handleClickUpdate = (record) => {
    console.log(record, 'recordssss')
    setAppointmentTypes({
      color: record.color,
      type: record.type,
      key: record.key,
      duration: record.duration,
      priority: record.priority,
      id: record.id,
      isDeleted: false,
    })
    form.setFieldsValue({ priority: record.priority })
    setIsAlreadyExist(true)
  }

  const columns = [
    {
      title: 'Appointment Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
      render: (color) => (
        <div
          key={color}
          style={{ background: color, marginLeft: '10px' }}
          className={`w-4 h-4 rounded-full`}
        ></div>
      ),
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
    },
    // {
    //   title: 'Update',
    //   dataIndex: '',
    //   key: 'y',
    //   render: (_, record) => (
    //     <div className="ml-4">
    //       <a
    //         onClick={() => {
    //           handleClickUpdate(record)
    //         }}
    //       >
    //         <EditOutlined />
    //       </a>
    //     </div>
    //   ),
    // },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button
            className="border-none text-[#14226D] hover:text-[#14226D]"
            icon={<FaEdit size={18} />}
            onClick={() => {
              handleClickUpdate(record)
            }}
            // onClick={() => {
            //   navigate('/updateprovider', { state: { id: record.id } })
            //   console.log(record, 'record')
            // }}
            // onClick={()=>handleEdit(record?.patientPhoneNum)}
          />
          <Button
            className="border-none text-red-600 hover:text-red-600"
            icon={<MdDelete size={18} />}
            onClick={()=>{deleteApmntType(record)}}
          />
        </Space>
      ),
    },
  ]

  //
  const colorsAlreadyTook = list?.map((apmntType) => apmntType?.color)
  const formatedLists = list?.map((x) => ({ ...x, key: x?.id || x?.key }))

  const handleDropDown = (key, value) => {
    form.setFieldsValue({ [key]: value })
    setAppointmentTypes({ ...appointmentType, [key]: value })
    if (error.priority) {
      setError({ ...error, priority: null })
    }
  }

  const menuForPririty = (
    <Menu
      onClick={(e) => {
        handleDropDown('priority', e.key)
      }}
    >
      {['1', '2', '3']?.map((st) => (
        <Menu.Item key={st}>{st}</Menu.Item>
      ))}
    </Menu>
  )

  return (
    // <Modal
    //     width={630}
    //     style={{ minHeight: 630 }}
    //     open={open}
    //     title="Add Appointment Types"
    //     onCancel={()=>{close(); setError({ type: null, color: null, isShow: false })}}
    //     footer={[]}
    //   >
    <>
      <div className="mx-5 mb-10">
        <Form
          className="flex flex-col gap-4"
          form={form}
          // onFinish={(_) => {
          //   // submit()

          //   console.log("HAHAHAHAHAHAHAHA");
          // }}
        >
          <div className="mt-6">
            <Table columns={columns} dataSource={formatedLists} size="small" />
          </div>

          <div className="w-full">
            <Form.Item
              style={{ marginBottom: 0, display: 'flex' }}
              // rules={[{ required: true, message: 'Please Enter Appointment Type' }]}
            >
              <div className="flex justify-center">
                <div className="w-full">
                  {/* <p className="text-gray-400 mb-1">Appointment Type</p> */}
                  <Input
                    size="large"
                    value={appointmentType.type}
                    placeholder="Enter Appointment Type"
                    className=""
                    onChange={(e) => {
                      setAppointmentTypes({
                        ...appointmentType,
                        type: e.target.value,
                      })
                      setError({ ...error, type: null })
                    }}
                    prefix={<PicLeftOutlined />}
                  />
                </div>
                <div className="ml-2">
                  {/* <p className="text-gray-400 mb-1">Duration</p> */}
                  <DurationPicker
                    width={130}
                    height={40}
                    value={appointmentType.duration}
                    onChange={(value) =>
                      setAppointmentTypes({
                        ...appointmentType,
                        duration: value,
                      })
                    }
                  />
                </div>
                <div className="ml-2">
                  {/* <p className="text-gray-400 mb-1">Priority</p> */}
                  <Form.Item
                    style={{ marginBottom: 0 }}
                    name={'priority'}
                    valuePropName={appointmentType?.priority}
                    rules={[
                      {
                        required: true,
                        message: 'Select Priority',
                      },
                    ]}
                  >
                    <Dropdown overlay={menuForPririty}>
                      <Button
                        style={{ width: 120, background: '#fff' }}
                        size={'large'}
                      >
                        {appointmentType?.priority || 'Priority'}{' '}
                        <DownOutlined />
                      </Button>
                    </Dropdown>
                  </Form.Item>
                  {<p className="text-red-600 mb-1">{error.priority}</p>}
                </div>
              </div>
              {error.isShow && error.type && (
                <p className="text-red-600 mb-1">{error.type}</p>
              )}
              <p className="text-gray-400 mb-1 mt-2">Appointment Color</p>
              <ColorPicker
                colorsAlreadyTook={colorsAlreadyTook}
                selectedColor={appointmentType.color}
                setSelectedColor={(color) => {
                  setAppointmentTypes({ ...appointmentType, color: color })
                  setError({ ...error, color: null })
                }}
              />
              {error.isShow && error.color && (
                <p className="text-red-600 mb-1">{error.color}</p>
              )}
            </Form.Item>
          </div>
          <div className="flex mt-4">
            <button
              // type="submit"
              type='button'
              onClick={submit}
              className={`w-full px-5 py-2 rounded-lg border-2 border-[#14226D] text-[#14226D] font-medium text-center`}
            >
              <nobr>
                {isAlreadyExist
                  ? 'Update Appointment Type'
                  : 'Add Appointment Type'}{' '}
              </nobr>
            </button>
          </div>
        </Form>
      </div>
    </>
  )

  {
    /* </Modal> */
  }
}

const ColorPicker = ({
  selectedColor,
  setSelectedColor,
  colorsAlreadyTook,
}) => {
  const colors = [
    '#D3D3D3',
    '#A9A9A9',
    '#696969',
    '#FFE4E1',
    '#363636',
    '#F08080',
    '#FF69B4',
    '#FFC0CB',
    '#FF1493',
    '#9400D3',
    '#8B4513',
    '#A52A2A',
    '#D2691E',
    '#BDB76B',
    '#556B2F',
    '#1E90FF',
    '#4682B4',
    '#4169E1',
    '#191970',
    '#000080',
  ]
  const text = <span>This Color is Already Selected</span>

  const pickedColor = (color) => {
    setSelectedColor(color)
  }
  return (
    <div className="flex mt-2">
      {colors.map((color) => {
        if (colorsAlreadyTook?.includes(color)) {
          return (
            <Tooltip placement="top" title={text} key={color}>
              <div
                key={color}
                style={{
                  background: color,
                  border: selectedColor === color ? '2px solid black' : '',
                }}
                className={`w-6 h-6 rounded-full mx-[3px] cursor-not-allowed`}
              ></div>
            </Tooltip>
          )
        } else {
          return (
            <div
              key={color}
              style={{
                background: color,
                border: selectedColor === color ? '2px solid black' : '',
              }}
              className={`w-6 h-6 rounded-full mx-[3px] cursor-pointer`}
              onClick={() => pickedColor(color)}
            ></div>
          )
        }
      })}
    </div>
  )
}

export default ProviderAppointmentType
