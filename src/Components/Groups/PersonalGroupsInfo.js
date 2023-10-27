import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'
import GroupTable from './GroupTable'

function PersonalGroupsInfo(props) {
  const navigate = useNavigate()
  const [deleteGroup,setDeleteGroup]=useState(false);
  return (
    <div className='mx-8 bg-white rounded-xl'>
      <div className='ml-5 pt-6'>
        <span className='text-[18px] mt-5'>
          <span className='border-b-2 border-[#5ECCB9] mb-2'>Group</span>{' '}
          Information
        </span>
      </div>

      <div className='flex justify-end '>
        <button
          onClick={() => navigate('/createGroup')}
          className='rounded-lg mr-6 mb-5 px-6 py-2 text-[#14226D] border-2 border-[#14226D]'
        >
          Create Group
        </button>
      </div>
      <GroupTable />
    </div>
  )
}

export default PersonalGroupsInfo
