
import React, { useState } from 'react'
import Modals from '../../Modals/Modals'
// import DependentInputComponent from './DependentComp'
import { DatePicker, Form, Input } from 'antd'
import DropDownComp from '../../DropDown/DropdownComp'
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { addNewDependent } from '../../../Slices/Patient.slice';
import { NotificationWithIcon } from '../../../Utils/Notification';
import { ClipLoader } from 'react-spinners';
dayjs.extend(customParseFormat);

let baseData = {
    name: '',
    dob: null,
    gender: null,
    insurance: null,
}

const DependentModal = ({ isShowDepModal, setIsShowDepModal }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const depInsuranceStatus = useSelector(state => state.Patient.depInsuranceStatus);
    const { patientData, partnerData } = useSelector(state => state.Patient);
    const [dependentData, setDependentData] = useState({ ...baseData });
    const [loading, setLoading] = useState(false);
    

    const handleFinish = () => {
        setLoading(true);
        const dataToBeSend = { ...dependentData };
        dataToBeSend.dob = dayjs(dependentData?.dob, "MM/DD/YY").format("DD/MM/YYYY");
        dataToBeSend["created_by"] = patientData?.id;
        dataToBeSend["insurance"] = dependentData?.insurance === "Self" ? patientData?.id : partnerData?.id;
        console.log(dataToBeSend, "dependentDataModal");
        dispatch(addNewDependent(dataToBeSend)).unwrap()
        .then(res => {
            setLoading(false);
            setDependentData({ ...baseData });
            form.resetFields();
            setIsShowDepModal(false)
        })
        .catch(err => {
            console.log(err, "dispatch:addNewDependent");
            setLoading(false);
        })
    }

    const disabledDate = current => {
        return current && current >= dayjs().endOf('day')
    }

  return (
    <Modals
        open={isShowDepModal}
        title='Add Another Dependent'
        footer={[]}
        width="560px"
        // onOk={checkPatientRelation}
        onOk={() => setIsShowDepModal(false)}
        onCancel={() => setIsShowDepModal(false)}
    >
        <div className='p-4'>
            <Form form={form} onFinish={handleFinish}>
                <div className='flex justify-center items-center w-full gap-x-7 gap-y-3 flex-wrap flex-1'>
                    <div className='patient-details w-[200px]'>
                        <p className='text-gray-400 mb-1'>Patient&apos;s Name</p>
                        <Form.Item
                            name={'name'}
                            rules={[
                                {
                                    required: true,
                                    message: "Please Enter Name",
                                },
                        ]}
                        >
                            <Input
                                size='large'
                                name={'name'}
                                placeholder='Enter Name here'
                                onChange={(e) => setDependentData({ ...dependentData, name: e.target.value })}
                                // prefix={<UserOutlined style={{ color: 'seagreen' }} />}
                            />
                        </Form.Item>
                    </div>
                    <div className='patient-details w-[200px]'>
                        <p className='text-gray-400 mb-1'>Gender</p>
                        <DropDownComp
                            size='large'
                            width='200px'
                            maxWidth='250px'
                            _for={'gender'}
                            value={dependentData['gender']}
                            arr={['male', 'female']}
                            req_msg={'Gender'}
                            callback={(_, value) => { setDependentData({ ...dependentData, gender: value }); form.setFieldsValue({ gender: value }); }}
                        />
                    </div>
                    <div className='patient-details w-[200px]'>
                        <p className='text-gray-400 mb-1'>Date Of Birth</p>
                        <Form.Item
                            name={'dob'}
                            rules={[
                                {
                                    required: true,
                                    message: "Please Select Date Of Birth",
                                },
                            ]}
                        >
                        <DatePicker
                            format={"MM/DD/YY"}
                            showToday={false}
                            name={'dob'}
                            className='my-datepicker h-[40px] w-full'
                            onChange={(date, dateString) =>
                                setDependentData({ ...dependentData, dob: dateString })
                            }
                            disabledDate={disabledDate}
                        />
                        </Form.Item>
                    </div>
                    <div className='patient-details w-[200px]'>
                        <p className='text-gray-400 mb-1'>Inherit Insurance From</p>
                        <DropDownComp
                            value={dependentData["insurance"]}
                            size='large'
                            width='200px'
                            maxWidth='250px'
                            _for={'insurance'}
                            req_msg='Insurance'
                            arr={depInsuranceStatus}
                            // callback={handleDropDown}
                            callback={(_, value) => { form.setFieldsValue({ insurance: value }); setDependentData({ ...dependentData, insurance: value })} }
                        />
                    </div>
                </div>
                <div className="flex justify-center items-center w-full gap-x-3 mt-6">
                    <button disabled={loading} type='button' className='rounded-lg py-2 px-5 border border-black hover:bg-gray-200' onClick={() => { setDependentData({ ...baseData }); form.resetFields(); setIsShowDepModal(false); }}>Cancel</button>
                    <button disabled={loading} 
                        className={`rounded-lg bg-gradient-to-r border border-sea-green text-white from-sea-green to-dashboard-green hover:from-dashboard-green hover:to-[#10967f] flex items-center justify-center site py-2 px-5`} type='submit'>
                        Submit
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
    </Modals>
  )
}

export default DependentModal