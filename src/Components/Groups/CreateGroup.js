import { Input, Select, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import dr1 from '../../assets/images/dr1.jpg'
import { AiOutlineClose } from 'react-icons/ai'
import { CloseOutlined } from '@ant-design/icons'
import { groupMembers } from './data'
import { NotificationWithIcon } from '../../Utils/Notification'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getDentistList } from '../../Slices/Dentist.slice'
import {
  createProvidersGroup,
  delGroup,
  getGroupById,
  updateGroup,
} from '../../Slices/Groups.slice'
import { ClipLoader } from 'react-spinners'
import { useLocation } from 'react-router-dom'
import ConfirmModal from '../Modals/ConfirmModal'
import { useParams } from 'react-router-dom'

function CreateGroup(props) {
  const { Option } = Select
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id } = useParams()
  const location = useLocation()
  const dentistList = useSelector((state) => state?.Dentist?.dentistList)
  const GroupData = useSelector((state) => state?.Groups?.GroupInfoId)
  console.log('GroupDataaaaaaaaaa', GroupData)
  // const GroupData = location?.state?.GroupData
  const deleteButton = location?.state?.buttonClicked

  const pathname = window.location.pathname
  console.log(pathname, 'aaaaaaaaaaa')

  console.log('delelteButton', deleteButton)
  console.log('dentistList', dentistList)
  const [groupInfo, setGroupInfo] = useState({
    groupName: '',
    id: '',
    leaderId: '',
    membersData: [],
  })
  const [leader, setLeader] = useState([])
  const [members, setMembers] = useState()
  const [addMember, setAddMember] = useState([])
  const [active, setActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const [openModalGroup, setOpenModalGroup] = useState(false)

  console.log('GroupData', GroupData)
  console.log('leaders', leader)
  console.log('GriupDataInfo', groupInfo)

  const handleDelete = (g_id) => {
    
    setOpenModalGroup(true)
    dispatch(delGroup(g_id))
      .unwrap()
      .then((x) => {
        console.log('xxxxxxxxxxxxxxx', x)
        if (x == 'group successfully deleted') {
          NotificationWithIcon('success', 'Group Deleted Successfully')
          navigate('/personalGroupInfo')
        }
      })
      .catch((error) => {
        NotificationWithIcon('error', 'Group is not Deleted')
      })
  }

  function handleDeleteMember(id) {
    console.log('id is', id)
    // const deleteMember = addMember.filter((mem) => mem?.provider_id !== id)
    const deleteMember = addMember.map((mem) => {
      if(mem?.provider_id !== id){
        return mem
      }
      else{
        return { ...mem, isDeleted: true }
      }
    })
    // const matchedIds = filterGroupMembers.map((obj) => obj.provider_id)
    // const filteredArray = filterMembers.filter(
    //   (obj) => !matchedIds.includes(obj.id)
    // )
    const x = addMember.filter((mem) => mem?.provider_id == id)
    const addDeletedMember = leader.filter((mem) => mem.id == x[0].provider_id)
    console.log('addDeletedMember', addDeletedMember)
    console.log(deleteMember, 'deleteMember')
    console.log(x, 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    setAddMember(deleteMember)
    setMembers((prevState) => [...prevState, ...addDeletedMember])
  }

  console.log('membessssssssssssssssssssssss', members)
  const handleDropDown = async (value, name) => {
    console.log('value is', value)
    console.log('addMembers', addMember)
    const selectedMember = JSON.parse(value)
    console.log('selectedMember', selectedMember)
    const updateAddMembers=members.filter((val)=>val.id == selectedMember?.provider_id)
    // const isMemberAlreadyAdded = addMember.some(
    //   (member) => member.provider_id == selectedMember.provider_id
    // )

    console.log('updateAddMembers',updateAddMembers);
    const filterMember = members.filter(
      (mem) => mem.id !== selectedMember.provider_id
    )
    console.log('filterMemberrrrrrrrrrr', filterMember)
    setMembers(filterMember)
    // console.log('isMemberAlreadyAdded', isMemberAlreadyAdded)
    // if (isMemberAlreadyAdded) {
    //   NotificationWithIcon('error', 'Provider already added as member')
    // } else {
    setAddMember((prevState) => [...prevState, selectedMember])
    // }
  }

  const handleChange = (event) => {
    console.log('group name is', event.target.value)
    setGroupInfo((prevState) => ({
      ...prevState,
      groupName: event.target.value,
    }))
  }

  // const updateMembers = (leaderId) => {
  //   console.log('LeaderId', leaderId)
  //   const filterMembers = leader.filter((val) => val?.id !== leaderId)
  //   console.log('filterMembersaaaaaaaa', filterMembers)
  //   setActive(false)
  //   // setMembers(filterMembers)
  //   if (GroupData && GroupData.GroupMembers) {
  //     const filterGroupMembers = GroupData?.GroupMembers?.filter(
  //       (mem) => mem.provider_id !== leaderId
  //     )
  //     setAddMember(filterGroupMembers);
  //     const matchedIds = filterGroupMembers.map((obj) => obj.provider_id)
  //     const filteredArray = filterMembers.filter(
  //       (obj) => !matchedIds.includes(obj.id)
  //     )
  //     setMembers(filteredArray)
  //     console.log('filterGroupMembers', filterGroupMembers)
  //     console.log('matchedIds', matchedIds)
  //     console.log('Finalfilter', filteredArray)
  //   }
  // }

  const handleLeader = (value, name) => {
    console.log('value is', value)
// setLeader(dentistList);
    const selectedLeader = JSON.parse(value)
    if (selectedLeader) {
      setActive(false)
      setGroupInfo((prevState) => ({
        ...prevState,
        leaderId: selectedLeader?.id,
      }))

      const checkLeaderInAddMem=addMember.find((val)=>val.provider_id == selectedLeader.id)
      if(checkLeaderInAddMem)
      {
        const removeAddMember=addMember.filter((val)=>val?.provider_id !== checkLeaderInAddMem?.provider_id)
        console.log('removeAddMember',removeAddMember);
        setAddMember(removeAddMember);  
      }
      console.log(checkLeaderInAddMem,'checkLeaderInAddMem');
      console.log('selectedLeader', selectedLeader)
      const filterMembers = leader?.filter(
        (val) => val?.id !== selectedLeader?.id
      )
      const matchedIds = addMember.map((obj) => obj.provider_id)
      const filteredArray = filterMembers?.filter(
        (obj) => !matchedIds.includes(obj.id)
      )
      console.log('addmembetsssssssssss', addMember)
      console.log(filteredArray, 'filteredArray')
      setMembers(filteredArray)
      console.log('filterMembers', filterMembers)
    }
  }

  const handleCreateGroup = () => {
    // setLoading(true)
    console.log('GriupData', groupInfo)
    console.log('addMmebers',addMember);
    const removeIsDeleted=addMember.filter((val)=>!val.isDeleted)
    const createGroupName = { ...groupInfo }
    const createMemberData = removeIsDeleted.map((member) => ({
      provider_id: member?.provider_id,
    }))
    createGroupName.membersData = createMemberData
    // const removeIsDeleted=addMember.filter((val)=>!val.isDeleted)
    // console.log('removeIsDeleted',removeIsDeleted); 
    // console.log('updatedGroupNameaaaaa',createGroupName); 

    setLoading(false)
    dispatch(createProvidersGroup({ groupInfo:createGroupName }))
      .unwrap()
      .then((x) => {
        console.log(x, 'xxxxxxxxxxxxxxxxxxxxxxxxxxx')
        if (x === 'created') {
          setLoading(false)
          NotificationWithIcon('success', 'Group is successfully created')
          navigate('/personalGroupInfo')
        }
      })
      .catch((error) => {
        console.log(error, 'errrorrorororo')
        NotificationWithIcon('error', error?.response?.data?.message)
        setLoading(false)
      })
  }

  //Update Groups
  const handleUpdateGroup = (id) => {
    console.log('groupInfoaaaaaaaaaaaaaaa', groupInfo)
    console.log('addMmebersaaaaaaaaa',addMember)
    const updatedGroupName = { ...groupInfo }
    const updateMemberData = addMember.map((member) => ({
      id: member?.id ?member?.id : "" ,
      provider_id: member?.provider_id,
      isDeleted:member?.isDeleted ? member?.isDeleted : "" 
    }))
    updatedGroupName.membersData = updateMemberData
    console.log('updateMemberData', updatedGroupName)
    console.log('updateMemberDataaaaaaaaaaaaaa',updateMemberData)

    dispatch(updateGroup({ id,groupInfo:updatedGroupName }))
        .unwrap()
        .then((x) => {
          console.log(x, 'xxxxxxxxxxxxxxxxxxxxxxxxxxx')
          if (x === 'group updated') {
            setLoading(false)
            NotificationWithIcon('success', 'Group is successfully Updated')
            navigate('/personalGroupInfo')
          }
        })
        .catch((error) => {
          console.log(error, 'errrorrorororo')
          NotificationWithIcon('error', error?.response?.data?.message)
          setLoading(false)
        })
  }

  console.log('addmembersaaaa', addMember)

  useEffect(() => {
    dispatch(getDentistList())
      .unwrap()
      .then((x) => {
        console.log('leadersaaaxxx', x)
        if (x) {
          setLeader(x)
        }
      })
  }, [])

  // useEffect(() => {
  //   if (dentistList) {
  //     setLeader(dentistList)
  //   }
  // }, [dentistList])

  useEffect(() => {
    console.log('HelloG')
    setLoading(true)
    dispatch(getGroupById(id))
      .unwrap()
      .then((x) => {
        console.log('xxxxxxxxxxxxxxx', x)
        if (x) {
          if (leader.length !== 0) {
            const filterMembers = leader.filter(
              (val) => val?.id !== x?.leader_id
            )
            console.log('filterMembersaaaaaaaa', filterMembers)
            setActive(false)
            // setMembers(filterMembers)
            // if (GroupData && GroupData.GroupMembers) {
            const filterGroupMembers = x?.GroupMembers?.filter(
              (mem) => mem.provider_id !== x?.leader_id
            )
            setAddMember(filterGroupMembers)
            const matchedIds = filterGroupMembers.map((obj) => obj.provider_id)
            const filteredArray = filterMembers.filter(
              (obj) => !matchedIds.includes(obj.id)
            )
            setMembers(filteredArray)
            console.log('filterGroupMembers', filterGroupMembers)
            console.log('matchedIds', matchedIds)
            console.log('Finalfilter', filteredArray)
          }
        }
        const groupInfo = {
          groupName: x?.group_name ? x?.group_name : '',
          id: id ? parseInt(id) : '',
          leaderId: x?.leader_id ? x?.leader_id : '',
          membersData: x?.GroupMembers ? x?.GroupMembers : [],
        }

        setGroupInfo(groupInfo)
        setLoading(false)
      })
  }, [leader])

  // useEffect(() => {
  //   if (groupInfo.leaderId) {
  //     updateMembers(groupInfo.leaderId)
  //   }
  // }, [GroupData])

  useEffect(() => {
    const updateMemberData = addMember.map((member) => ({
      provider_id: member?.provider_id,
    }))
    console.log('updateMemberData', updateMemberData)
    setGroupInfo((prevState) => ({
      ...prevState,
      membersData: updateMemberData,
    }))
  }, [addMember])

  console.log('Add Members', addMember)
  console.log('Group Info', groupInfo)
  console.log('membersssssssss', members)

  return (
    <>
      <div className="mx-8  bg-white rounded-xl">
        <div className="mb-10">
          {loading ? (
            <>
              <div className="m-20 p-[100px] flex justify-center">
                <ClipLoader size={40} color="#14226D" />
              </div>
            </>
          ) : (
            <>
              <div className="ml-5 pt-6 flex justify-between">
                <span className="text-[18px] ">
                  {
                     pathname.includes('editGroup') ? (

                      <span className="border-b-2 border-[#5ECCB9] mb-2">
                      Edit {' '}
                    </span>
                     ): (
                  <span className="border-b-2 border-[#5ECCB9] mb-2">
                    Create
                  </span>
                     )
                  }
                  Group
                </span>
                {pathname.includes('editGroup') ? (
                  <div className="mt-2">
                    <button
                      onClick={() => setOpenModalGroup(true)}
                      className="rounded-lg mr-6 mb-5 px-8 py-2 text-[#D06060] border-2 border-[#D06060]"
                    >
                      Delete Group
                    </button>
                  </div>
                ) : (
                  ''
                )}
              </div>
              <div className="mx-5 grid grid-cols-5 gap-6 mt-10">
                <Input
                  required
                  name="groupName"
                  value={groupInfo.groupName}
                  onChange={handleChange}
                  placeholder="Enter Group Name"
                  // disabled={isDisabled}
                  // defaultValue={GroupData ?  GroupData.group_name : ""}
                  defaultValue={
                    groupInfo?.groupName ? groupInfo?.groupName : ''
                  }
                />
                <Select
                  name="leader"
                  required
                  placeholder="Select Leader"
                  
                  onSelect={(value) => handleLeader(value, 'leader')}
                  defaultValue={GroupData?.Dentist?.name || undefined}
                >
                  {leader?.map((leader, index) => {
                    console.log('leaderssss', leader)
                    return (
                      <Option
                        value={JSON.stringify({
                          id: leader?.id,
                          name: leader?.name,
                        })}
                        key={leader?.id}
                      >
                        {leader?.name}
                      </Option>
                    )
                  })}
                </Select>
              </div>

              <div className="m-5">
                <p className="text-[18px] ">
                  Group Members ({addMember.filter(member => !member.isDeleted).length})
                </p>
              </div>

              <div className="m-5 mb-10">
                <Select
                  className="w-[260px]"
                  name="leader"
                  required
                  placeholder="Add Members"
                  disabled={active}
                  onSelect={(value) => handleDropDown(value, 'member')}
                >
                  {members?.map((memb, index) => (
                    <Option
                      value={JSON.stringify({
                        provider_id: memb.id,
                        Dentist: {
                          name: memb.name,
                          dp_url: memb.dp_url,
                        },
                      })}
                      key={memb.id}
                    >
                      {memb.name}
                    </Option>
                  ))}
                </Select>
              </div>

              <div className="mx-5 grid grid-cols-4 gap-6">
                {addMember.map((val) => {
                  if(!val.isDeleted){
                    return (
                      <Tag
                        closable
                        onClose={() => handleDeleteMember(val?.provider_id)}
                        key={val?.provider_id}
                        className="flex items-center justify-between rounded-lg bg-[#ffffff]"
                      >
                        <div className="flex items-center py-3">
                          <img
                            src={
                              val?.Dentist?.dp_url
                                ? `${process.env.REACT_APP_BACKEND_API_URL}/api/files/${val.Dentist.dp_url}`
                                : ''
                            }
                            className="h-14 w-14 rounded-full mr-2"
                            alt="Doctor"
                          />
                          <div>
                            <p className="text-xl font-medium text-black m-0">
                              {val?.Dentist?.name}
                            </p>
                            {/* <p className="text-lg text-slate-500 m-0">{val.type}</p> */}
                          </div>
                        </div>
                        <style jsx>{`
                          .ant-tag-close-icon svg {
                            font-size: 20px;
                          }
                        `}</style>
                      </Tag>
                    )
                  }
                  else return <></>
                })}
              </div>

              <div className="mx-8 mt-[150px] mb-4 ">
                <div className="flex justify-end  mb-6">
                  {pathname.includes('editGroup') ? (
                    <>
                      <button
                        onClick={() => handleUpdateGroup(id)}
                        className="px-10 py-2 text-white bg-[#5ECCB9] rounded-md mx-3 flex mb-7"
                        //   onClick={() => navigate('/provider')}
                      >
                        <span className="ml-2">Update</span>{' '}
                      </button>
                    </>
                  ) : (
                    <>
                      {!loading ? (
                        <button
                          onClick={handleCreateGroup}
                          className="px-10 py-2 text-white bg-[#5ECCB9] rounded-md mx-3 flex mb-7"
                          //   onClick={() => navigate('/provider')}
                        >
                          <span className="ml-2">Save</span>{' '}
                        </button>
                      ) : (
                        <button
                          // htmlType="submit"
                          className="px-10 py-2 text-white bg-[#5ECCB9] rounded-md mx-3 flex mb-7"
                          //   onClick={() => navigate('/provider')}
                        >
                          <span className="flex mx-2">
                            Save{' '}
                            <ClipLoader
                              className="mx-2"
                              size={20}
                              color="white"
                            />
                          </span>{' '}
                        </button>
                      )}
                    </>
                  )}

                  <button
                    className="px-8 py-2 mb-7 rounded-lg text-[#5E6674] border-[1px] border-[#5E6674] font-medium"
                    onClick={() => navigate('/personalGroupInfo')}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <ConfirmModal
          isOpen={openModalGroup}
          closeModal={() => setOpenModalGroup(false)}
          heading={'Delete Group'}
          body={
            <div>
              Are You Sure You Want To Delete Group{' '}
              <b> {GroupData?.group_name} </b>
            </div>
          }
          handleYes={() => handleDelete(GroupData?.key)}
        />
      </div>
    </>
  )
}

export default CreateGroup
