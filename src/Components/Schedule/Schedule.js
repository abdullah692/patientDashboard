import React, { useState, useRef, useEffect } from 'react'
import CalendarSch from './CalendarSch'
import Scheduler from './Scheduler'
import axios from 'axios'
import SideCalendar from './SideCalendar'
import { useLocation } from 'react-router-dom'
import {
  fetchGroupById,
  fetchGroupMemberById,
  fetchGroupName,
} from '../../Slices/Group.slice'
import { useDispatch } from 'react-redux'

function Schedule() {
  const dispatch = useDispatch()
  const location = useLocation()
  const [groupIdScheduler, setGroupIdScheduler] = useState(null)
  const queryParams = new URLSearchParams(location.search)
  let groupId = queryParams.get('groupid')
  const memberId = queryParams.get('memberid')
  console.log({ memberId })

  useEffect(() => {
    dispatch(fetchGroupName())
  }, [])

  useEffect(() => {
    if (groupId) {
      dispatch(fetchGroupById({ id: groupId }))
    } else if (groupIdScheduler) {
      dispatch(fetchGroupById({ id: groupIdScheduler }))
    }
  }, [groupId, groupIdScheduler])

  useEffect(() => {
    if (memberId) {
      dispatch(fetchGroupMemberById({ id: memberId }))
    }
  }, [memberId])

  return (
    <div className=' text-white h-[calc(100vh-96px)] overflow-hidden '>
      <div className=''>
        {/* <div className="grid grid-cols-4 pt-2 pb-10 px-6 gap-6"> */}
        <div className='pt-2 pb-10 px-6'>
          {/* <div className="col-span-5 rounded-[10px]"> */}
          <div className='rounded-[10px] w-full'>
            <Scheduler groupId={groupId} memberId={memberId} />
            {/* <FullCalendar resources={resources} events={appointments}/> */}
          </div>
          {/* <div>
            <p className="text-[#464D59] text-[17px] font-semibold">
              Upcoming Visits
            </p>
            <div className="text-black">
              <CalendarSch />
            </div>
          </div> */}
          {/* <div className="col-span-1">
{!groupId && <SideCalendar/>}
        </div> */}
        </div>
      </div>
      {/* <h1 className='text-black text-center mt-10 text-[30px]'>Schedules</h1> */}
    </div>
  )
}

export default Schedule
