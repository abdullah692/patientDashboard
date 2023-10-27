import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form } from 'antd'
import { useState } from 'react'
import './steps.css'
import dayjs from 'dayjs'
import 'dayjs/locale/en' // Load the English language pack
import { useEffect } from 'react'
import { setAppointmentFor } from '../../../Slices/Appointment.slice'
import { addPatients, deleteDependent, updateDependentData, updatePartnerData, updatePatientData, } from '../../../Slices/Patient.slice'
import Modals from '../../Modals/Modals'
import PatientVerification from './PatientVerification'
import ModalForCancel from './ModalForCancel'
import DependentInputComponent from '../component/DependentComp'
import PatientInputComponent from '../component/PatientInputComponent'
import DependentModal from '../component/DependentModal'
import { phone_prefix } from '../../../Utils/utils'
import { NotificationWithIcon } from '../../../Utils/Notification'
import { LoadingOutlined } from '@ant-design/icons'

const debug = process.env.REACT_APP_DEBUG === 'true' ? true : false

const PatientDetails = ({
  handleComponentChange = () => {},
  callbackForNewData = () => {},
  handleCancel,
  isBtnShow = true,
  checkbox = true,
  heading = true,
  rounded = false,
  reUpdate = false,
  readOnly = false,
  refreshId,
  changeBtn = false,
}) => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()

  const { patientData, partnerData, dependents } = useSelector(state => state.Patient)
  const insuranceList = useSelector(state => state.Insurance.insuranceList)

  const appointmentsForList = useSelector((state) => state.Appointment.appointments).map((x) => ({ id: x.key, isDependent: x.isDependent }))
  const isPatientExist = useSelector((state) => state.Patient.isPatientExist)
  const updateAppointment = useSelector(state => state.Appointment.updateAppointment);

  const [currentApmntFor, setCurrentApmntFor] = useState('parent')
  const [isOpen, setIsOpen] = useState(false)
  const [isShowDepModal, setIsShowDepModal] = useState(false)
  const [modalForCancel, setModalForCancel] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [allBookedApmnt, setAllBookedApmnt] = useState([]);

  useEffect(()=>{
    if(appointmentsForList?.length > 0){
      let booked = [];
      for(let i=0; i < appointmentsForList?.length; i++){
        if(appointmentsForList[i]?.id === patientData?.id &&  appointmentsForList[i]?.isDependent === false){
          booked.push("parent");
        }
        else if(appointmentsForList[i]?.id === partnerData?.id &&  appointmentsForList[i]?.isDependent === false){
          booked.push("partner");
        }
        else {
          booked.push(appointmentsForList[i]?.id);
        }
      }
      setAllBookedApmnt(booked);
      if(!booked.includes("parent")){
        setCurrentApmntFor("parent");
      }
      else if(!booked.includes("partner")){
        setCurrentApmntFor("partner");
      }
      else{
        for (let j = 0; j < dependents?.length; j++) {
          const dep = dependents[j];
          if(!booked.includes(dep?.id)){
            setCurrentApmntFor(dep?.id);
            break
          }
        }
      }
    }
  },[]);
 
  const handleDropDown = (inputFor, value, _for) => {
    console.log(inputFor, value, _for, "inputFor, value, _for");
    if(_for === 'parent'){
      if(inputFor === "Insurance"){
        const insSel = insuranceList.find(x => x.id === Number(value))
        dispatch(updatePatientData({ ...patientData, [inputFor]: insSel, ins_id: value }));
      }
      else{
        dispatch(updatePatientData({ ...patientData, [inputFor]: value }))
      }
    }
    else if(_for === "partner"){
      if(inputFor === "Insurance"){
        const insSel = insuranceList.find(x => x.id === Number(value))
        dispatch(updatePartnerData({ ...partnerData, [inputFor]: insSel, ins_id: value }));
      }
      else{
        dispatch(updatePartnerData({ ...partnerData, [inputFor]: value }));
      }
    }
    form.setFieldsValue({ [_for+inputFor]: value });
  }

  const handleInputChange = (e, _for, inputFor) => {
    console.log(e.target.value, _for, inputFor, "e.target.value, _for, inputFor");
    if(_for === 'parent'){
      dispatch(updatePatientData({ ...patientData, [inputFor]: e.target.value }))
    }
    else if(_for === "partner"){
      dispatch(updatePartnerData({ ...partnerData, [inputFor]: e.target.value }));
    }
    form.setFieldsValue({ [_for+inputFor]: e.target.value });
  }

  const handleDependentInputChange = (value, _for, inputFor) => {
    console.log(value, _for, inputFor, "e.target.value, _for, inputFor");
    if(inputFor === "insurance"){
      let updatedObj = []
      if(value === "Partner") {
        updatedObj = dependents?.map(dep => {
          if(dep.key === _for) return { ...dep, insurance_inherit_from: { id: partnerData?.id, name: partnerData?.name }, insurance: partnerData?.id, };
          return dep;
        });
        form.setFieldsValue({ [_for + inputFor]: "Partner" });
      }
      else {
        updatedObj = dependents?.map(dep => {
          if(dep.key === _for) return { ...dep, insurance_inherit_from: { id: patientData?.id, name: patientData?.name }, insurance: patientData?.id, };
          return dep;
        });
        form.setFieldsValue({ [_for + inputFor]: "Self" });
      }
      dispatch(updateDependentData(updatedObj));
    }
    else {
      const updatedObj = dependents?.map(dependent => {
        if(dependent.key === _for) return { ...dependent, [inputFor]: value }
        else return dependent;
      });
      console.log(updatedObj, "e.target.value, _for, inputFor");
      dispatch(updateDependentData(updatedObj));
      
      form.setFieldsValue({ [_for + inputFor]: inputFor === 'dob' ? dayjs(value) : value });
    }

  }
  
  const handleDateChange = (date, dateString, _for, inputFor) => {
    if(_for === 'parent'){
      dispatch(updatePatientData({ ...patientData, [inputFor]: dateString }))
    }
    else if(_for === "partner"){
      dispatch(updatePartnerData({ ...partnerData, [inputFor]: dateString }));
    }
    form.setFieldsValue({ [_for+inputFor]: date });
    // debug && console.log(date, dateString, key, 'select date')
    // form.setFieldsValue({ [key]: date })
    // if (key.includes('parent')) {
    //   const newKey = key.replace('parent', '')
    //   setPatientInfo({ ...patientInfo, [newKey]: dateString })
    // } else {
    //   const newData = { ...patientInfo }
    //   const childNo = getChildNum(key)
    //   debug && console.log(childNo, typeof childNo, 'childNo', key, 'curr')
    //   const patRel = newData?.patientRelations?.map((eachRel, i) => {
    //     if (i === childNo) {
    //       const newKey = key.replace(`child${childNo}`, '')
    //       return { ...eachRel, [newKey]: dateString }
    //     }
    //     return eachRel
    //   })
    //   newData['patientRelations'] = patRel
    //   console.log(newData, 'newData')
    //   setPatientInfo(newData)
    // }
  }

  // set current appointment booked for...
  const handleRadioChange = e => {
    console.log(e.target.value, 'e.target.value:radio')
    setCurrentApmntFor(e.target.value)
  }

  const handleAddPartner = () => {
    setIsOpen(true)
  }

  const handleDeleteDependent = (key) => {
    const updatedDep = dependents?.filter(dep => dep.key !== key);
    dispatch(updateDependentData(updatedDep));
    dispatch(deleteDependent({ id: key }));
  }

  const initialValuesForForm = (patientData, partnerData, dependentData) => {
    // console.log(patientInfo, 'patientInfoInissssssssssssssss')
    let initialData = {}
    let isPartnerExist = Object.keys(partnerData || {})?.length > 0;
    for (let key in patientData) {
      if (key === 'dob') {
        initialData[`parent${key}`] = patientData[key] ? dayjs(patientData[key]) : null
      }
      // else if (key === 'phone') {
      //   initialData[`parent${key}`] = patientData[key];
      // }
      else {
        initialData[`parent${key}`] = patientData[key]
      }
    }
    
    if(isPartnerExist){
      for (let key in patientData) {
        if (key === 'dob') {
          initialData[`partner${key}`] = partnerData[key] ? dayjs(partnerData[key]) : null
        }
        // else if (key === 'phone') {
        //   initialData[`partner${key}`] = partnerData[key]?.slice(2);
        // }
        else {
          initialData[`partner${key}`] = partnerData[key];
        }
      }
    }

    for (let j = 0; j < dependentData?.length; j++) {
      const dependent = dependentData[j];
      for (let key in dependent) {
        if (key === 'dob') {
          initialData[dependent["key"]+key] = dependent[key] ? dayjs(dependent[key]) : null
        }
        else if(key === 'insurance_inherit_from'){
          initialData[dependent["key"]+`insurance`] = dependent[key]?.id === patientData?.id ? "Self" : dependent[key]?.id === partnerData?.id ? "Partner" : null;
        }
        else {
          initialData[dependent["key"]+key] = dependent[key]
        }
      }
    }

    form.setFieldsValue(initialData)
    return initialData
  }


  // final submit
  const handleFinish = (values) => {
    const dataToBeSend = {
      ...patientData,
      phone: phone_prefix + patientData.phone,
      patientPartner: Object.keys(partnerData || {}).length > 0 ? { ...partnerData, phone: phone_prefix + partnerData?.phone } : {},
      dependents: dependents,
    };
    console.log(dataToBeSend, "dataToBeSendPat");
    setIsLoading(true);
    dispatch(setAppointmentFor({ appointmentFor: currentApmntFor }));
    dispatch(addPatients(dataToBeSend)).unwrap().then(x => {
      setIsLoading(false);
      NotificationWithIcon("success", "patient's data added");
      handleComponentChange(2);
    }).catch(e => {
      setIsLoading(false);
      NotificationWithIcon("success", e.message);
    })
  }

  const handleDisabledPartner = () => {
    let isDisabled = false;
    // isDisabled = appointmentsForList?.some(x => x?.id === partnerData?.id && x?.isDependent === false);
    // if(isDisabled) return isDisabled;
    
    for(let i=0; i<dependents?.length; i++){
      let dependent = dependents[i];
      for (let j = 0; j < appointmentsForList?.length; j++) {
        const apmntFor = appointmentsForList[j];
        if(apmntFor?.id === dependent?.id && dependent?.created_by === partnerData?.id){
          isDisabled = true;
          break;
        }
      }

      if(isDisabled) return true;
    }
    return false;
  }

  return (
    <div className={`bg-white ${rounded && 'p-2 rounded-xl'} max-h-[540px] overflow-auto` }>
      <ModalForCancel
        isOpen={modalForCancel}
        closeModal={() => setModalForCancel(false)}
        handleCancel={handleCancel}
      />
      <DependentModal isShowDepModal={isShowDepModal} setIsShowDepModal={setIsShowDepModal} />
      <div className='px-5 pb-28 relative min-h-full'>
        <Modals
          open={isOpen}
          title='Search Partner'
          footer={[]}
          // onOk={checkPatientRelation}
          onOk={() => setIsOpen(false)}
          onCancel={() => setIsOpen(false)}
        >
          <PatientVerification
            fromModal={true}
            closeModal={() => setIsOpen(false)}
          />
        </Modals>
        {heading && (
          <>
            <div className='font-semibold text-lg'>Patient Details</div>
            <div className='border-b-2 border-sea-green w-[50px] mb-4'></div>
          </>
        )}
        {!isPatientExist && (
          <p className='mt-2 text-center px-4'>
            We apologize, but it appears that we do not have a record of your
            patient number in our system. In order to proceed with your medical
            care, we kindly ask that you provide us with your patient
            information so that we can update our records.
          </p>
        )}
        <Form
          className=''
          form={form}
          // initialValues={initialFormData}
          initialValues={initialValuesForForm(patientData, partnerData, dependents)}
          onFinish={handleFinish}
        >
          <PatientInputComponent
            patient={patientData}
            _for='parent'
            handleInputChange={handleInputChange}
            handleRadioChange={handleRadioChange}
            handleDropDown={handleDropDown}
            handleDateChange={handleDateChange}
            checkbox={checkbox}
            readOnly={readOnly}
            currApmnt={'parent' === currentApmntFor}
            isDisabled={appointmentsForList?.some(x => x?.id === patientData?.id && x?.isDependent === false)}
          />
          {Object.keys(partnerData || {})?.length > 0 && <div className='mt-3'>
              <>
                <div className='font-semibold text-lg'>Partner Details</div>
                <div className='border-b-2 border-sea-green w-[50px] mb-4'></div>
              </>
              <PatientInputComponent
                patient={partnerData}
                _for='partner'
                handleInputChange={handleInputChange}
                handleRadioChange={handleRadioChange}
                handleDropDown={handleDropDown}
                handleDateChange={handleDateChange}
                checkbox={checkbox}
                readOnly={readOnly}
                currApmnt={'partner' === currentApmntFor}
                isDisabled={appointmentsForList?.some(x => x?.id === partnerData?.id && x?.isDependent === false)}
                isDisabledDelete={handleDisabledPartner()}
              />
            </div>
          }
          {dependents?.length > 0 && <div className='mt-2'>
            <>
              <div className='font-semibold text-lg'>Dependents Details</div>
              <div className='border-b-2 border-sea-green w-[50px] mb-4'></div>
            </>
            {dependents?.map((rel, i) => {
              return (
                <DependentInputComponent
                  key={rel?.key}
                  patient={rel}
                  _for={rel?.key}
                  currApmnt={rel?.key == currentApmntFor}
                  handleRadioChange={handleRadioChange}
                  handleDelete={handleDeleteDependent}
                  handleInputChange={handleDependentInputChange}
                  insuranceInherit={rel?.insurance_inherit_from?.id === patientData.id ? "Self" : rel?.insurance_inherit_from?.id === partnerData?.id ? "Partner" : null}
                  isDisabled={appointmentsForList?.some(x => x?.id === rel?.id && x?.isDependent === true)}
                />
              );
          })}
          </div>
          }
          {isBtnShow && (
            <div className='absolute -bottom-12 right-5 flex gap-3 mt-2'>
              <button
                disabled={isLoading}
                type="button"
                className="rounded-lg py-2 px-5 border border-black hover:bg-gray-200"
                onClick={() => setModalForCancel(true)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`rounded-lg bg-gradient-to-r border border-sea-green text-white from-sea-green to-dashboard-green hover:from-dashboard-green hover:to-[#10967f] flex items-center justify-center site py-2 px-5`}
              >
                {changeBtn == true ? 'Save' : 'Proceed'} {isLoading ? <LoadingOutlined style={{ marginLeft: '12px' }} /> : <></>}
              </button>
            </div>
          )}
        </Form>
        <div className='absolute bottom-7 left-5'>
          <button
            type='button'
            disabled={Object.keys(partnerData || {})?.length > 0}
            className={`rounded-lg px-3 py-2 border border-blue-900 font-bold ${Object.keys(partnerData || {})?.length > 0 ? 'text-blue-500': 'text-blue-900 hover:bg-gray-100'}`}
            onClick={handleAddPartner}
          >
            Add Partner
          </button>
          <button
            type='button'
            className='rounded-lg px-3 py-2 border hover:bg-gray-100 border-blue-900 font-bold text-blue-900 ml-2'
            onClick={() => { setIsShowDepModal(true) }}
          >
            Add Dependent
          </button>
        </div>
      </div>
    </div>
  )
}


export default PatientDetails
