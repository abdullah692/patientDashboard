import { Button, DatePicker, Form, Input, TimePicker, Upload } from "antd";
import { UserOutlined, MailOutlined, MobileOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import dayjs from 'dayjs'
import DropDown from "../DropDown/Dropdown";
import Inputs from "../Inputs/Input";
import { ClipLoader } from "react-spinners";
import DatePickers from "../DateTimePicker/DatePickers";
import AddScheduleModel from "./AddScheduleModel";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addDentist, getProviderById, setUpdProviderId, updateDentist } from "../../Slices/Dentist.slice";
import { NotificationWithIcon } from "../../Utils/Notification";
import AppointmentTypeModal from "./AppointmentTypeModal";
import DropDownComp from "../DropDown/DropdownComp";
import FullPageLoader from "../../Utils/FullPageLoader";

const UpdateDentist = () => {
    const location = useLocation();
    const providerId = useSelector(state => state.Dentist.providerUpdId);
    // const dentistId = location?.state?.id;
    const dentistId = 3;
    console.log(providerId, "dentistid");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [mainLoader, setMainLoader] = useState(true);
    const [loading, setLoading] = useState(false);
    const [openPopUp, setOpenPopUp] = useState(false);
    const [apmntTypePopUp, setApmntTypePopUp] = useState(false);
    const [schedule, setSchedule] = useState({
        sunday: { startTime: '', endTime: '' },
        monday: { startTime: '', endTime: '' },
        tuesday: { startTime: '', endTime: '' },
        wednesday: { startTime: '', endTime: '' },
        thursday: { startTime: '', endTime: '' },
        friday: { startTime: '', endTime: '' },
        saturday: { startTime: '', endTime: '' },
    })
    const [imageData, setImageData] = useState({ preview: false, fileList: [] });
    const [dentistInfo, setDentistInfo] = useState({
        name: '',
        gender: '',
        dob: null,
        phone: '',
        email: '',
        d_id: dentistId,
        dp_url: null,
        maritalStatus: '',
        breakEndTime: '',
        breakStartTime: '',
        chairSize: null,
        schedule: {},
        apmntTypes: [],
    })

    useEffect(()=>{
      dispatch(setUpdProviderId(dentistId))
      dispatch(getProviderById({ id: dentistId })).unwrap().then(x => {
        console.log(x, "dentistFound", dentistId);
        
        const updatedSchedule = { ...schedule };
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
        
        setSchedule(updatedSchedule);
        console.log('updatedSchedule',updatedSchedule);
        
        const appointmentTypes = x?.AppointmentTypes?.map(y => ({ ...y, key: y.id }));
        // console.log(appointmentTypes, "x.AppointmentTypes");
        
        const dentist = {
          name: x.name,
          gender: x.gender,
          chairSize: x.max_chair_size,
          maritalStatus: x.marital_status,
          phone: x.phone,
          email: x.email,
          dp_url: x.dp_url,
          dob: x.dob.toString(),
          schedule: updatedSchedule,
          apmntTypes: appointmentTypes,
        }

        form.setFieldsValue(dentist)
        setDentistInfo(dentist);
        setMainLoader(false);
      }).catch(e => {
        console.log(e, 'errorInFetchingProvider');
        NotificationWithIcon("error", "Can't Update Provider at this time");
        setMainLoader(false);
        navigate("/provider");
      })
    }, []);

    const handleInputChange = (e) => {
      setDentistInfo({ ...dentistInfo, [e.target.name]: e.target.value });
      form.setFieldsValue({ [e.target.name]: e.target.value })
    }

    const handleDropDown = (key, value) => {
      form.setFieldsValue({ [key]: value });
      setDentistInfo({ ...dentistInfo, [key]: value });
    }
    
    const handleScheduleSubmit = (schedule) => {
      setOpenPopUp(false);
      setDentistInfo({ ...dentistInfo, schedule });
    }

  // Update Dentist, Availibility and Appointment Types
  const handleUpdateDentist = (values) => {
      // console.log(dentistInfo, "dentistInfo:addDen");
      const dataToBeSend = { ...dentistInfo, d_id: providerId };

      if(!dentistInfo.dp_url){ 
        if(imageData?.fileList?.length === 0){
          NotificationWithIcon("error", "Please Upload Provider's Image");
          return;
        }else{
          dataToBeSend.avatar = imageData?.fileList[0]?.originFileObj;
        }
      }
      
      if(Object.keys(dataToBeSend?.schedule).length === 0){
        NotificationWithIcon("error", "Please Add Provider's Schedule")
        return;
      }
      if(dataToBeSend?.apmntTypes?.length === 0){
        NotificationWithIcon("error", "Please Add Provider's Appointment Types");
        return;
      }
      
      const filterScheduleDays = Object.keys(dataToBeSend?.schedule).filter(eachDay => dataToBeSend["schedule"][eachDay].startTime !== '');
      
      const filterSchedule = {};

      for(let i=0; i<filterScheduleDays.length; i++){
        filterSchedule[filterScheduleDays[i]] = dataToBeSend["schedule"][filterScheduleDays[i]];
      }
      
      dataToBeSend.schedule = filterSchedule;
      
      setLoading(true);

      dispatch(updateDentist(dataToBeSend)).unwrap().then(x => {
        console.log(x, "updateMessage")
        setLoading(false);
        if(x.message === "Successfully Updated"){
          NotificationWithIcon("success", "Provider Successfully Updated");
          navigate('/provider')
        }
      }).catch(err => {
        console.log(err.data, "error in updateDen");
        NotificationWithIcon("error", err?.data?.errorMessage);
        setLoading(false);
      })
    }


    const props = {
      name: 'avatar',
      headers: {
        authorization: 'authorization-text',
      },
      accept: "image/png, image/jpeg, image/jpg",
      maxCount: 1,
      // listType: "picture",
      beforeUpload: () => false,
      onChange: ({ fileList }) => { 
        setDentistInfo({ ...dentistInfo, dp_url: null });
        setImageData(prev => ({ ...prev, fileList, preview: URL.createObjectURL(fileList[0].originFileObj) })); 
      },
    }

    const addApmntType = (data) => {
      const isAlreadyExist = dentistInfo?.apmntTypes?.findIndex(apmntT => apmntT.key === data.key);
      let updatedApmnt = [...dentistInfo.apmntTypes];
      console.table(dentistInfo?.apmntTypes)
      console.log(data, "isAlreadyE", isAlreadyExist);
      if(data.key === null){
        data.key = Math.floor(1000 + Math.random() * 9000);
      }
      if(isAlreadyExist !== -1){
        updatedApmnt[isAlreadyExist] = data;
      }
      else{
        updatedApmnt.push(data);
      }
      setDentistInfo({ ...dentistInfo, apmntTypes: updatedApmnt });
    }

    const deleteApmntType = (data) => {
      // const updatedApmnt = dentistInfo?.apmntTypes?.filter(apmntT => apmntT.key !== data.key);
      console.log(data, "dleteApmt");
      let updatedApmnt;
      if(data.id){
        updatedApmnt = dentistInfo?.apmntTypes?.map(apmntT => {
          if(apmntT.key == data.key){
            return { ...apmntT, isDeleted: true }
          }
          return apmntT;
        })
      }else {
        updatedApmnt = dentistInfo?.apmntTypes?.filter(apmntT => apmntT.key != data.key);
      }
      console.log(updatedApmnt, "dleteApmtA");
      setDentistInfo({ ...dentistInfo, apmntTypes: updatedApmnt });
    }
    
    console.log(dentistInfo, "dentistInfor");
    return(
        <div className="min-h-screen w-full">
            <FullPageLoader isShow={mainLoader} />
            <div className="flex flex-col px-5 py-3">
                <h2 className="text-gray-500 text-3xl font-semibold">Update Provider</h2>
                <Form form={form} onFinish={handleUpdateDentist} className="" initialValues={dentistInfo}>
                    <div className="w-full flex flex-wrap mt-6 gap-x-10 gap-y-4">
                      <div className="w-full flex items-center h-20">
                        <span className="h-[70px] w-16 overflow-hidden rounded-lg bg-gray-100 flex items-center border border-gray-300">
                          {imageData.preview ? (<img src={imageData.preview} alt="" />): dentistInfo.dp_url ? (<img src={`${process.env.REACT_APP_BACKEND_API_URL}/api/files/${dentistInfo.dp_url}`} alt="" />) : (
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
                          onClick={()=>{setImageData({ fileList: [], preview: false }); setDentistInfo({ ...dentistInfo, dp_url: null })}}
                        >
                          Delete
                        </button>
                      </div>
                      <div className="">
                        <p className="text-gray-400 mb-1">First Name</p>
                        <Form.Item
                          style={{ marginBottom: 0 }}
                          name={"name"}
                          rules={[
                            {
                              required: true,
                              message: "Please Enter Provider's Name",
                            },
                          ]}
                        >
                          <Input
                            size="large"
                            name="name"
                            value={dentistInfo.name}
                            onChange={handleInputChange}
                            placeholder={`Enter Provider's Name Here`}
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
                            value={dentistInfo.phone}
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
                            type={"number"}
                            size="large"
                            name="chairSize"
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
                          <p className="text-[#BABABA] ">Date Of Birth</p>
                          <DatePickers 
                            callback={(date) => setDentistInfo({ ...dentistInfo, dob: date})} 
                            _for={"dob"} req_msg={"Date Of Birth"} 
                            defaultValue={dentistInfo.dob ? dayjs(dentistInfo.dob.toString()) : null}
                            value={dentistInfo.dob}
                            width="430px" maxWidth="430px" size="large" height="40px"
                          />
                      </div>
                        <div className="mt-1">
                          <p className="text-[#BABABA] ">Marital Status</p>
                          <DropDownComp value={dentistInfo.maritalStatus}  size='large' width="430px" maxWidth="430px" _for={"maritalStatus"} req_msg="Marital Status"
                            arr={["single", "married", "divorced", "widowed"]}
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

                    <AddScheduleModel open={openPopUp} close={()=>setOpenPopUp(false)} schedule={schedule} setSchedule={setSchedule} handleScheduleSubmit={handleScheduleSubmit} />
                    <AppointmentTypeModal open={apmntTypePopUp} close={()=>setApmntTypePopUp(false)} addApmntType={addApmntType} deleteApmntType={deleteApmntType} list={dentistInfo.apmntTypes.filter(x=> x.isDeleted === false)} />

                    <div className="text-center mt-[50px] w-full flex justify-center mb-8">
                    <button
                      disabled={loading}
                      onClick={()=>{navigate(-1)}}
                      className={`mr-4 w-[200px] rounded-lg bg-gradient-to-r text-black bg-white hover:bg-gray-200 flex items-center justify-center site p-2`}
                    >
                      Cancel
                    </button>
                    <button
                      disabled={loading}
                      className={`w-[200px] rounded-lg bg-gradient-to-r text-white from-sea-green to-dashboard-green ${loading ? "": "hover:from-dashboard-green hover:to-[#10967f]"}  flex items-center justify-center site p-2 `}
                      type="submit"
                    >
                      Update Provider
                      <span>
                        <ClipLoader
                          cssOverride={{ display: "block", marginLeft: "1rem", borderColor: "white",}}
                          color={"black"}
                          loading={loading}
                          size={20}
                        />
                      </span>
                    </button>
                  </div>
                </Form>
            </div>
        </div>
    );
}

export default UpdateDentist;