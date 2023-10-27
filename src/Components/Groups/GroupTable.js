import { Table, Spin } from 'antd'
import dayjs from 'dayjs'
import {
  FaCalendarPlus,
  FaEdit,
  FaRegCalendarPlus,
  FaRegEdit,
} from 'react-icons/fa'
import { MdDelete, MdOutlineDelete } from 'react-icons/md'
import { BiChevronDown, BiChevronUp } from 'react-icons/bi'
import { useEffect, useState } from 'react'
import { delGroup, delGroupMember, getGroups } from '../../Slices/Groups.slice'
import { useDispatch } from 'react-redux'
import { NotificationWithIcon } from '../../Utils/Notification'
import ConfirmModal from '../Modals/ConfirmModal'
import { useNavigate } from 'react-router-dom'

const GroupTable = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [openModalGroup, setOpenModalGroup] = useState(false)
  const [openModalMember, setOpenModalMember] = useState(false)
  const [groupId, setGroupId] = useState()
  const [groupName, setGroupName] = useState()
  const [memberId, setMemberId] = useState()
  const [memberName, setMemberName] = useState()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const getGroupsData = async () => {
    try {
      const resp = await dispatch(getGroups()).unwrap()
      setData(resp)
    } catch (error) {
      console.log(error)
      // Handle errors
    } finally {
      setLoading(false) // Set loading state to false after data is fetched
    }
  }

  console.log('Data is ', data)
  const deleteGroup = async (g_id) => {
    const resp = await dispatch(delGroup(g_id)).unwrap()
    console.log(resp)
    NotificationWithIcon('success', 'Group Deleted Successfully')
    setOpenModalGroup(false)
    await getGroupsData()
  }
  const deleteGroupMember = async (m_id) => {
    console.log('MEMBERID', m_id)
    
    const resp = await dispatch(delGroupMember(m_id))
      .unwrap()
      .then((x) => {
        console.log(x, 'xxxxxxxxx')
        if (x) {
          setOpenModalMember(false);
          NotificationWithIcon('success', 'Group Member Deleted Successfully')
          getGroupsData()
        }
      })
  }

  const handleGroupName = (id) => {
    const addGroupName = data.filter((val) => val.key === id)
    setGroupName(addGroupName[0]?.group_name)
  }
  useEffect(() => {
    ;(async () => await getGroupsData())()
  }, [])
  const columns = [
    {
      title: 'Group Name',
      dataIndex: 'group_name',
      key: 'group_name',
      className: 'text-base',
      render: (_) => <div className="text-sea-green font-bold">{_}</div>,
    },
    {
      title: 'Leader',
      dataIndex: ['Dentist', 'name'],
      key: 'lName',
      className: 'text-base',
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <div className="object-cover rounded-full overflow-hidden">
            <img
              src={`${process.env.REACT_APP_BACKEND_API_URL}/api/files/${record.Dentist.dp_url}`}
              width={34}
              height={34}
              alt=""
              className="object-scale-down"
            />
          </div>
          {_}
        </div>
      ),
    },
    {
      title: 'No. of members',
      dataIndex: 'GroupMembers',
      key: 'GroupMembers',
      className: 'text-base',
      render: (groupMembers) => groupMembers.length,
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      className: 'text-base',
      render: (createdAt) => dayjs(createdAt).format('MM/DD/YY'),
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      className: 'text-base',
      render: (_, record) => (
        <div className="flex gap-4">
          <FaCalendarPlus
            size={18}
            className="border-none text-[#14226D] hover:text-[#14226D] cursor-pointer"
            onClick={()=>navigate(`/schedule?groupid=${record.key}`)}
          />
          <FaEdit
            size={18}
            className="border-none text-[#14226D] hover:text-[#14226D] cursor-pointer"
            onClick={() =>
              navigate(`/editGroup/${record?.key}`, {
                // state: { groupData: record, buttonClicked: 'edit' },
              }) 
            }
          />
          <MdDelete
            size={18}
            className="border-none text-red-600 hover:text-red-600 cursor-pointer"
            onClick={() => {
              setGroupName(record.group_name)
              setGroupId(record.key)
              setOpenModalGroup(true)
            }}
          />
        </div>
      ),
    },
  ]
  const innerColumns = [
    {
      title: 'Provider Name',
      dataIndex: ['Dentist', 'name'],
      key: 'dname',
      width: '80%',
      className: 'text-base',
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <div className="object-cover rounded-full overflow-hidden">
            <img
              src={`${process.env.REACT_APP_BACKEND_API_URL}/api/files/${record.Dentist.dp_url}`}
              width={34}
              height={34}
              alt=""
              className="object-scale-down"
            />
          </div>
          {_}
        </div>
      ),
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      className: 'text-base',
      render: (_, record) => (
        // console.log('records',record);

        <div className="flex gap-4">
          <FaRegCalendarPlus
            size={18}
            className="border-none text-[#14226D] hover:text-[#14226D] cursor-pointer"
            onClick={()=>navigate(`/schedule?memberid=${record?.provider_id}`)}
            // onClick={()=>navigate(`/schedule?memberid=`)}
          />
          <FaRegEdit
            size={18}
            className="border-none text-[#14226D] hover:text-[#14226D] cursor-pointer"
            onClick={() => navigate(`/editProviderInfo/${record?.provider_id}`)}
          />
          {!record.is_leader && (
            <MdOutlineDelete
              size={18}
              className="border-none text-red-600 hover:text-red-600 cursor-pointer"
              onClick={() => {
                // setGroupName(record?.group_name)
                handleGroupName(record?.group_id)
                setMemberName(record?.Dentist?.name)
                setMemberId(record?.id)
                setOpenModalMember(true)
              }}
            />
          )}
        </div>
      ),
    },
  ]
  return (
    <div className="p-3 flex justify-center w-full">
      {loading ? (
        <Spin size="large" /> // Display loader while loading is true
      ) : (
        <Table
          className="w-full"
          rowClassName={'text-base'}
          columns={columns}
          dataSource={data}
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
            expandedRowRender: (record) => (
              <Table
                rowClassName={'text-base'}
                columns={innerColumns}
                dataSource={record.GroupMembers}
                pagination={false}
                // size="small"
                showSorterTooltip={false}
              />
            ),
          }}
        />
      )}
      <ConfirmModal
        isOpen={openModalGroup}
        closeModal={() => setOpenModalGroup(false)}
        heading={'Delete Group'}
        body={
          <div>
            Are You Sure You Want To Delete Group <b>{groupName}</b>
          </div>
        }
        handleYes={() => deleteGroup(groupId)}
      />
      <ConfirmModal
        isOpen={openModalMember}
        closeModal={() => setOpenModalMember(false)}
        heading={'Delete Group Member'}
        body={
          <div>
            Are You Sure You Want To Delete Group Member <b>{memberName}</b>{' '}
            From Group <b>{groupName}</b>
          </div>
        }
        handleYes={() => deleteGroupMember(memberId)}
      />
    </div>
  )
}
export default GroupTable
