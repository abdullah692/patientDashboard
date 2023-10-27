import React, { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  UserOutlined,
  MobileOutlined,
  FormOutlined,
  DeleteFilled,
} from '@ant-design/icons'
import { Radio, Input, DatePicker, Form, Table } from 'antd'
import { useNavigate } from 'react-router-dom'
import {
  deletePatientByID,
  fetchPatient,
  getAllPatients,
  removeAllDataFromPatientSlice,
} from '../../Slices/Patient.slice'
import { NotificationWithIcon } from '../../Utils/Notification'
import dayjs from 'dayjs'
import { BiChevronDown, BiChevronUp } from 'react-icons/bi'
import { FaCalendarPlus, FaEdit, FaRegCalendarPlus, FaRegEdit } from 'react-icons/fa'
import { MdDelete, MdOutlineDelete } from 'react-icons/md'

const PatientList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { allpatients } = useSelector(state => state.Patient);
  const [loading, setLoading] = useState(true);
  const [searchBy, setSearchBy] = useState("phone");
  const [searchData, setSearchData] = useState({ phone: '', name: '', dob: null });
  const [patientData, setPatientData] = useState([]);
  const [patientFilteredData, setPatientFilteredData] = useState([]);

  const onChange = (value) => {
    console.log('params', value)
    dispatch(fetchPatient({ id: value?.id }))
      .unwrap()
      .then((x) => {
        console.log(x, 'xxxxxxfetchhhidiidi')
        navigate(`/patient-detail/${value?.id}`, { state: value })
      })
      .catch((err) => {
        console.log(err, 'errorrr')
      });
  }

  const onEdit = (value) => {
    console.log('params', value)
    dispatch(fetchPatient({ id: value?.id }))
      .unwrap()
      .then((x) => {
        console.log(x, 'xxxxxxfetchhhidiidi')
        navigate(`/edit-patient-info/${value?.id}`)
      })
      .catch((err) => {
        console.log(err, 'errorrr')
      });
  }

  const handleDelete = (id) => {
    setLoading(true)
    dispatch(deletePatientByID(id))
      .unwrap()
      .then((x) => {
        console.log(x, 'xxxdeleetetete')
        if (x) {
          dispatch(getAllPatients())
          setLoading(false)
          NotificationWithIcon('success', x.message)
        }
      })
      .catch((err) => {
        console.log(err, 'erorrrrrr')
        setLoading(false)
      })
  }

  useEffect(() => {
    dispatch(getAllPatients()).unwrap()
    .then(patients => {
      console.log(patients, "res:getAllPatients:component");
      const patientDatas = []
      for (let i = 0; i < patients.length; i++) {
        const patient = patients[i];
        let partner = (patient.partner && Object.keys(patient.partner || {}).length > 0) ? [{ key: patient.partner?.id, ...patient.partner }] : [];
        const dependents = [];
        if(patient.partner){
          dependents.push(...partner, ...patient.partner?.Dependents, ...patient.Dependents);
        }
        else{
          dependents.push(...patient.Dependents);
        }
        const data = {
          key: patient.id,
          name: patient.name,
          email: patient.email,
          gender: patient.gender,
          dob: patient.dob,
          phone: patient.phone,
          maritalStatus: patient.maritalStatus,
          partner: dependents
        }
        patientDatas.push(data);
      }
      setPatientData(patientDatas);
      setPatientFilteredData(patientDatas);
      setLoading(false);
    })
    .catch(e => {
      console.log(e, "error:getAllPatients:component");
      setLoading(false)
    })
  }, []);

  const handleKeyPress = e => {
    const regex = /^\+?[0-9]*$/;
    const isValid = regex.test(e.key)
    if (!isValid || e.target.value.length >= 12) {
      e.preventDefault()
    }
  }

  const handleSearch = (values) => {
    if(searchBy === 'phone'){
      const { phone } = searchData;
      const filterData = patientData.filter(x => x.phone === phone || x.phone.includes(phone));
      setPatientFilteredData(filterData);
    }else{
      let { dob, name } = searchData;
      let filterData = patientData;
      if(name && dob){
        dob = dayjs(dob, "'MM/DD/YY'").format('DD/MM/YY')
        filterData = patientData.filter(x => (x.name === name || x.name.includes(name)) && x.dob === dob);
      }
      else if(name){
        filterData = patientData.filter(x => x.name.includes(name));
      }
      else if(dob){
        dob = dayjs(dob, "'MM/DD/YY'").format('DD/MM/YY')
        filterData = patientData.filter(x => x.dob === dob);
      }
      setPatientFilteredData(filterData);
    }
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      className: 'text-base',
      // render: (_) => <div className="text-sea-green font-bold">{_}</div>,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      className: 'text-base',
      render: (phone) => <div className="">{phone ? phone : "N/A"}</div>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      className: 'text-base',
      render: (email) => <div className="">{email ? email : "N/A"}</div>,
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      className: 'text-base',
    },
    {
      title: 'Marital Status',
      dataIndex: 'maritalStatus',
      key: 'maritalStatus',
      className: 'text-base',
      render: (ms) => <div className="">{ms ? ms : "N/A"}</div>,
    },
    {
      title: 'Birth Date',
      dataIndex: 'dob',
      key: 'dob',
      className: 'text-base',
      render: (dob) => dayjs(dob).format('MM/DD/YY'),
    },
    // {
    //   title: 'Action',
    //   dataIndex: '',
    //   key: 'x',
    //   className: 'text-base',
    //   render: (_, record) => (
    //     <div className="flex gap-4">
    //       <FaCalendarPlus
    //         size={18}
    //         className="border-none text-[#14226D] hover:text-[#14226D] cursor-pointer"
    //         onClick={()=>navigate(`/schedule?groupid=${record.key}`)}
    //       />
    //       <FaEdit
    //         size={18}
    //         className="border-none text-[#14226D] hover:text-[#14226D] cursor-pointer"
    //         onClick={() =>
    //           navigate(`/editGroup/${record?.key}`, {
    //             // state: { groupData: record, buttonClicked: 'edit' },
    //           }) 
    //         }
    //       />
    //       <MdDelete
    //         size={18}
    //         className="border-none text-red-600 hover:text-red-600 cursor-pointer"
    //         onClick={() => {
    //           console.log(record, "record:delete");
    //         }}
    //       />
    //     </div>
    //   ),
    // },
  ]
  const innerColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      className: 'text-base',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      className: 'text-base',
    },
    {
      title: 'Birth Date',
      dataIndex: 'dob',
      key: 'dob',
      className: 'text-base',
      render: (dob) => <div>{dayjs(dob).format("MM/DD/YY")}</div>,
    },
    {
      title: 'Insurance',
      dataIndex: 'insurance',
      key: 'insurance',
      className: 'text-base',
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      className: 'text-base',
      // render: (_, record) => (
      //   // console.log('records',record);

      //   <div className="flex gap-4">
      //     <FaRegCalendarPlus
      //       size={18}
      //       className="border-none text-[#14226D] hover:text-[#14226D] cursor-pointer"
      //       onClick={()=>navigate(`/schedule?memberid=${record?.provider_id}`)}
      //       // onClick={()=>navigate(`/schedule?memberid=`)}
      //     />
      //     <FaRegEdit
      //       size={18}
      //       className="border-none text-[#14226D] hover:text-[#14226D] cursor-pointer"
      //       onClick={() => navigate(`/editProviderInfo/${record?.provider_id}`)}
      //     />
      //     {!record.is_leader && (
      //       <MdOutlineDelete
      //         size={18}
      //         className="border-none text-red-600 hover:text-red-600 cursor-pointer"
      //         onClick={() => {
      //           // setGroupName(record?.group_name)
      //           handleGroupName(record?.group_id)
      //           setMemberName(record?.Dentist?.name)
      //           setMemberId(record?.id)
      //           setOpenModalMember(true)
      //         }}
      //       />
      //     )}
      //   </div>
      // ),
    },
  ]

  const handleWhenFieldEmpty = () => {
    if(searchBy === 'phone'){
      setPatientFilteredData(patientData);
    }
    else {
      if(searchData.name === "" && searchData.dob === ""){
        setPatientFilteredData(patientData);
      }
    }
  }

  const handleDateChange = (date, dateString) => {
    console.log(date, "handleDateChange", dateString)
    setSearchData({ ...searchData, dob: dateString })
    if(date === null && searchData.name === ""){
      setPatientFilteredData(patientData);
    }
  }

  const handleInputChange = (e) => {
    setSearchData({ ...searchData, [e.target.name]: e.target.value })
    if(e.target.name === "phone" && e.target.value === ""){
      setPatientFilteredData(patientData);
    }
    if(e.target.name === "name" && e.target.value === "" && searchData.dob === ""){
      setPatientFilteredData(patientData);
    }
  }

  return (
    <div className="mx-4 mt-2 bg-white py-5 rounded-xl">
      <div className="text-[20px] text-[#464D59] pl-4">
        <p className="border-b-2 rounded-[2px] border-[#5ECCB9] max-w-[50px]">
          <p style={{ whiteSpace: 'nowrap' }} className="font-semibold">
            New Dentistry
          </p>
        </p>
      </div>
      <div className="ml-4">
        <div className="mt-6 flex flex-col">
          <span className='text-[18px] mt-5 mb-5'>Search By</span>
          <div className="flex ">
            <Radio.Group onChange={(e)=>{ setSearchBy(e.target.value); form.resetFields() }} value={searchBy}>
              <Radio value={"phone"}>Number</Radio>
              <Radio value={"name_dob"}>Name & Date of birth</Radio>
            </Radio.Group>
          </div>
        </div>
        <Form onFinish={handleSearch} form={form} ini>
          <div className="mt-4 flex justify-start max-w[400px] mb-2 ">
            {searchBy === "phone" ? (
              <Form.Item
                name="phone"
                rules={[
                //   {
                //     required: true,
                //     message: "Please Enter Mobile Number",
                //   },
                ]}
              >
                <Input
                  size="large"
                  name="phone"
                  placeholder="Enter Phone Number"
                  onKeyPress={handleKeyPress}
                  onChange={handleInputChange}
                  prefix={<MobileOutlined style={{ color: 'seagreen' }} />}
                  onBlur={handleWhenFieldEmpty}
                />
              </Form.Item>
            ) : (
              <>
                <Form.Item
                  name="name"
                  className="mr-4"
                  rules={[
                    // {
                    //   required: true,
                    //   message: "Please Enter Patient's Name",
                    // },
                  ]}
                >
                  <Input
                    size="large"
                    name="name"
                    placeholder="Enter Name here"
                    onChange={handleInputChange}
                    prefix={<UserOutlined style={{ color: 'seagreen' }} />}
                    onBlur={handleWhenFieldEmpty}
                  />
                </Form.Item>
                <Form.Item
                  name="dob"
                  className="w-60"
                  rules={[
                    // {
                    //   required: true,
                    //   message: "Please Enter Patient's Date of birth",
                    // },
                  ]}
                >
                  <DatePicker
                    size='large'
                    showToday={false}
                    className="my-datepicker h-[40px] w-full"
                    format={'MM/DD/YY'}
                    onChange={handleDateChange}
                    onBlur={handleWhenFieldEmpty}
                    onCl
                  />
                </Form.Item>
              </>
            )}
            <div className="ml-12 -mt-3">
              <button
                disabled={(searchBy === "phone" && searchData.phone === "") || (searchBy === "name_dob" && searchData.name === "" && (searchData.dob === "" || searchData.dob === null))}
                type="submit"
                className={`bg-gradient-to-r border border-sea-green text-white from-sea-green to-dashboard-green hover:from-dashboard-green hover:to-[#10967f] flex justify-center items-center w-full rounded-md font-semibold py-[8px] mt-3 px-[70px]`}
              >
                Search
              </button>
            </div>
          </div>
        </Form>
      </div>
      <div className="p-4">
      <Table
          className="w-full"
          rowClassName={'text-base'}
          columns={columns}
          dataSource={patientFilteredData}
          pagination={{ hideOnSinglePage: true, pageSize: 10 }}
          // size="small"
          expandable={{
            expandIcon: ({ expanded, onExpand, record }) =>
              expanded ? (
                <BiChevronUp
                  className="hover:bg-[#14226D] hover:text-white rounded cursor-pointer transition-transform"
                  onClick={(e) => onExpand(record, e)}
                />
              ) : (
                <BiChevronDown
                  className="hover:bg-[#14226D] hover:text-white rounded cursor-pointer transition-transform"
                  onClick={(e) => onExpand(record, e)}
                />
              ),
            expandedRowRender: (record) => 
              // console.log(record, "rec:expandedRowRender")
            (
              <Table
                rowClassName={'text-base'}
                columns={columns}
                dataSource={record.partner}
                pagination={false}
                showSorterTooltip={false}
              />
            )
          }}
        />
      </div>
    </div>
  )
}

export default PatientList
