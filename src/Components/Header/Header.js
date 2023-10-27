import React, { useState } from "react";
import { AiOutlineBell } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import Profile from "./Profile";
import { useSelector } from "react-redux";
import { userdetail } from "../../Slices/Auth.slice";
import { useLocation, useNavigate } from "react-router-dom";
import { includes } from "lodash";

function Header({ active }) {
  const user  = useSelector(userdetail)
  const navigate = useNavigate();
  const { pathname } = useLocation();
  console.log(pathname,"DashboardPath");
  return (
    <div>
      <div className="flex  justify-between ">
        <div className="text-[25px] text-[#464D59] pt-5 pl-4  ">
          <p className="border-b-2 rounded-[2px] border-[#5ECCB9]">
            {active && pathname==='/addappointment' ? (
              <p style={{ whiteSpace: 'nowrap' }} >Add Appointment</p>
            ): active && pathname==='/addprovider' ? (
              <p style={{ whiteSpace: 'nowrap' }} >Add Provider</p>
            ) : active && pathname==='/provider' ? (
              <p style={{ whiteSpace: 'nowrap' }} >Providers List</p>
            ) : active && pathname==='/updateprovider' ? (
              <p style={{ whiteSpace: 'nowrap' }} >Update Provider</p>
            ) : active && pathname.includes('/providerpersonalinfo/') ? (
              <p style={{ whiteSpace: 'nowrap' }} >Provider Details</p>
            ) : active && pathname.includes('/editProviderInfo/') ? (
              <p style={{ whiteSpace: 'nowrap' }} >Provider Details</p>
            ) :
            active && (pathname ==='/createGroup' || pathname.includes('/editGroup') ) ? (
              <p style={{ whiteSpace: 'nowrap' }} >Group</p>
            ) :
            active && pathname==='/patients' ? (
              <p style={{ whiteSpace: 'nowrap' }} >Patients List</p>
            ) :
            active && pathname.includes('patient-detail') ? (
              <p style={{ whiteSpace: 'nowrap' }} >Patients Details</p>
            ) :
            active && pathname.includes('edit-patient') ? (
              <p style={{ whiteSpace: 'nowrap' }} >Edit Patient</p>
            ) :
            active && pathname==='/personalGroupInfo' ? (
              <p style={{ whiteSpace: 'nowrap' }} >Groups</p>
            ) :
            active && pathname.includes('/edit-schedule') ? (
              <p style={{ whiteSpace: 'nowrap' }} >Edit Schedule</p>
            ) :
            active && pathname.includes('/schedule') ? (
              <p style={{ whiteSpace: 'nowrap' }} >Schedule</p>
            ) :
            active && pathname === '/analytics' ? (
              <p style={{ whiteSpace: 'nowrap' }} >Analytics</p>
            ) :
            active && pathname === '/messages' ? (
              <p style={{ whiteSpace: 'nowrap' }} >Messages</p>
            ) :
            active && pathname === '/settings' ? (
              <p style={{ whiteSpace: 'nowrap' }} >Settings</p>
            ) : (
              ""
            )}
          </p>
          {/* <p>Settings</p> */}
        </div>
        <div className="flex ">
          <div className="pt-5">
            <label htmlFor="search-input">
              <FiSearch className="absolute ml-[10px] mt-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                //   value={searchTerm}
                //   onChange={handleChange}
                id="search-input"
                className="pl-[35px] pt-[10px] pb-[10px] pr-[10px] w-[409px] rounded-[5px]"
              />
            </label>
          </div>
          {(pathname === '/provider' || pathname === '/addappointment') && <div className="pt-5 ml-4">
            <button
              className={`w-[200px] h-[41px] rounded-lg bg-gradient-to-r text-white from-sea-green to-dashboard-green hover:from-dashboard-green hover:to-[#10967f] flex items-center justify-center site p-2 `}
              onClick={()=>{navigate("/addprovider")}}
            >
              Add Provider
              <span style={{ color: 'white', display: 'inline-block', marginLeft: '10px', fontSize: '16px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </span>
            </button>
          </div>}
          {pathname !== '/provider' && pathname !== '/addappointment' && <div className="pt-5 ml-4">
            <button
              className={`w-[200px] h-[41px] rounded-lg bg-gradient-to-r text-white from-sea-green to-dashboard-green hover:from-dashboard-green hover:to-[#10967f] flex items-center justify-center site p-2 `}
              onClick={()=>{navigate("/addappointment")}}
            >
              Create Appointment
              {/* <span style={{ color: 'white', display: 'inline-block', marginLeft: '10px', fontSize: '16px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </span> */}
            </button>
          </div>}
          <div className="flex">
            <div className="pl-6 pt-7 ">
              <AiOutlineBell size={25} color="#969A9F" />
            </div>
          </div>
          <div className="m-0 pt-3">
            <Profile />
          </div>
          <div className="pt-5 pr-4">
            <p className="text-[14px] font-medium text-[#969A9F]">Welcome</p>
            <p className="text-[16px] font-medium">{user.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
