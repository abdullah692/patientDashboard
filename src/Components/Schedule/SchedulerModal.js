// import { Popup } from "reactjs-popup";
// import { IoClose } from "react-icons/io5";
// import dr from "../../assets/images/profile.png";
// import { FaEdit } from "react-icons/fa";
// import { Tooltip } from "antd";
// import { MdDelete } from "react-icons/md";

// const SchedulerModal = ({ openPopup, setOpenPopup, showPopupData }) => {
//   function formatDate(date) {
//     var d = new Date(date),
//       month = '' + (d.getMonth() + 1),
//       day = '' + d.getDate(),
//       year = d.getFullYear()

//     if (month.length < 2) month = '0' + month
//     if (day.length < 2) day = '0' + day

//     return [year, month, day].join('-')
//   }

//   const handleEdit = (data) => {
//     console.log(data, "handleEdit");
//   }

//   const handleDelete = (data) => {
//     console.log(data, "handleDelete");
//   }

//   console.log(showPopupData.extendedProps?.Patient?.dob, "showPopupData.extendedProps?.Patient?.dob");
//     return(
//         <Popup
//             open={openPopup}
//             // closeOnDocumentClick
//             closeOnDocumentClick={false}
//             onClose={() => setOpenPopup(false)}
//           >
//             <div className='bg-white border-2 text-[black] p-4   w-[400px] rounded-[10px]'>
//               <div className='flex justify-end mb-5 '>
//                 <IoClose
//                   className=' cursor-pointer'
//                   onClick={() => setOpenPopup(false)}
//                 />
//               </div>
//               <div className='mt-[-30px]'>
//                 <p className='text-[20px] font-semibold font-sans capitalize'>
//                   {showPopupData.extendedProps.AppointmentType.type}
//                 </p>
//                 <div className='flex'>
//                   <img src={dr} alt='dr1' className='ml-[-20px]' />
//                   <p className='mt-4 ml-[-10px] font-medium text-[#BABABA] capitalize'>
//                     <nobr>
//                       with{" "}
//                       {showPopupData.extendedProps.AppointmentType.Dentist.name}
//                     </nobr>
//                   </p>
//                   <div
//                     className='ml-[170px] mt-5 cursor-pointer'
//                     onClick={() => handleEdit(showPopupData)}
//                   >
//                     <FaEdit />
//                   </div>
//                   <div className="ml-[20px] mt-5 cursor-pointer">
//                     <Tooltip
//                       placement="top"
//                       title={
//                         selectedOption === "Cancelled"
//                           ? "Delete Appointment"
//                           : "Please Cancel Appointment First"
//                       }
//                     >
//                       <MdDelete
//                         style={
//                           selectedOption === "Cancelled" ? { color: "red" } : {}
//                         }
//                         onClick={
//                           selectedOption !== "Cancelled"
//                             ? () => {}
//                             : () => handleDelete(showPopupData.extendedProps)
//                         }
//                       />
//                     </Tooltip>
//                   </div>
//                 </div>
//                 <hr className='border-t-2 mt-[-10px] border-[#F3F3F3]'></hr>
//                 <div className='grid grid-cols-2 pt-2 px-4 gap-6'>
//                   <div className='col-span-1 rounded-[10px]'>
//                     <div>
//                       <p className='text-[#BABABA]'>Date</p>
//                       <p>
//                         {formatDate(showPopupData.extendedProps.start_time)}
//                       </p>
//                     </div>

//                     <div>
//                       <p className='text-[#BABABA]'>Pateint Name</p>
//                       <p className='capitalize'>
//                         {showPopupData.extendedProps.Patient.name}
//                       </p>
//                     </div>

//                     <div className=''>
//                       <p className='text-[#BABABA] '>Appointment Type</p>
//                       <p className='capitalize'>
//                         {showPopupData.extendedProps.AppointmentType.type}{" "}
//                       </p>
//                     </div>
//                     <div className=''>
//                       <p className='text-[#BABABA] '>Status</p>
//                       <p className='capitalize'>
//                         <DropDown arr={showStatus}
//                           callback={(key, value) => { handleMenuClick(key, value) }}
//                           _for={"status"}
//                           size="middle"
//                           req_msg={"Status"}
//                           maxWidth="150px"
//                           width="150px"
//                           defaultValue={showPopupData?.extendedProps?.status}
//                           icon = {updStatusLoading ? (<LoadingOutlined />) : (<DownOutlined />)}
//                         />
//                       </p>
//                     </div>

//                     <div className=''>
//                       <p className='text-[#BABABA] '>Phone No</p>
//                       <p className='capitalize'>
//                         {showPopupData.extendedProps.Patient.phone}{" "}
//                       </p>
//                     </div>

//                     <div className=''>
//                       <p className='text-[#BABABA] '>Email</p>
//                       <p>{showPopupData.extendedProps.Patient.email} </p>
//                     </div>
//                   </div>

//                   <div className='ml-4'>
//                     <div className='px-4'>
//                       <p className='text-[#BABABA] '>Start Time</p>
//                       <p className='capitalize'>
//                         {`${new Date(
//                           showPopupData.extendedProps.start_time
//                         ).toLocaleTimeString([], {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                           hour12: true,
//                         })}`}
//                       </p>
//                     </div>

//                     <div className='px-4'>
//                       <p className='text-[#BABABA] '>End Time</p>
//                       <p className='capitalize'>
//                         {`${new Date(
//                           showPopupData.extendedProps.end_time
//                         ).toLocaleTimeString([], {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                           hour12: true,
//                         })}`}
//                       </p>
//                     </div>

//                     <div className='px-4'>
//                       <p className='text-[#BABABA] '>Duration</p>
//                       <p className='capitalize'>
//                         {showPopupData.extendedProps.AppointmentType.duration}
//                       </p>
//                     </div>

//                     <div className='px-4'>
//                       <p className='text-[#BABABA] '>Gender</p>
//                       <p className='capitalize'>
//                         {showPopupData.extendedProps.Patient.gender}
//                       </p>
//                     </div>

//                     <div className='px-4'>
//                       <p className='text-[#BABABA] '>Dob</p>
//                       <p className='capitalize'>
//                         {showPopupData.extendedProps?.Patient?.dob}
//                       </p>
//                     </div>

//                   </div>
//                 </div>
//               </div>
//             </div>
//           </Popup>
//     )
// }

// export default SchedulerModal;