import { Button, Space } from 'antd'
import drImg from '../../assets/images/drImg1.png'
import drImg2 from '../../assets/images/drImg2.png'
import drImg3 from '../../assets/images/drImg3.png'
import drImg4 from '../../assets/images/drImg4.png'
import { FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'

export const AppointmentTypes = [
  {
    id: '1',
    appointment: 'Consultation',
  },
  {
    id: '2',
    appointment: 'Crown Delivery',
  },
  {
    id: '3',
    appointment: 'Crown Preparation',
  },
  {
    id: '4',
    appointment: 'Denture Insertion',
  },
  {
    id: '5',
    appointment: 'Denture Step',
  },
  {
    id: '6',
    appointment: 'Extraction',
  },

  {
    id: '7',
    appointment: 'Post & core/ Core buildup',
  },
  {
    id: '8',
    appointment: 'Root Canal Treatment',
  },
  {
    id: '9',
    appointment: 'Braces / Invisalign ',
  },
]

export const AvailableSlots = [
  {
    SlotTime: '1 Hour Slot',
    data: [
      {
        id: '1',
        startTime: '12:00 AM',
        endTime: '1:00 AM',
      },
      {
        id: '2',
        startTime: '1:00 AM',
        endTime: '2:00 AM',
      },
      {
        id: '3',
        startTime: '2:00 AM',
        endTime: '3:00 AM',
      },
      {
        id: '4',
        startTime: '3:00 AM',
        endTime: '4:00 AM',
      },
      {
        id: '5',
        startTime: '4:00 AM',
        endTime: '5:00 AM',
      },
      {
        id: '6',
        startTime: '5:00 AM',
        endTime: '6:00 AM',
      },
    ],
  },
  {
    SlotTime: '1/2 Hour Slot',
    data: [
      {
        id: '1',
        startTime: '11:00 AM',
        endTime: '11:30 AM',
      },
      {
        id: '2',
        startTime: '11:30 AM',
        endTime: '12:00 PM',
      },
      {
        id: '3',
        startTime: '12:00 PM',
        endTime: '12:30 AM',
      },
      {
        id: '4',
        startTime: '12:30 PM',
        endTime: '01:00 PM',
      },
      {
        id: '5',
        startTime: '01:00 PM',
        endTime: '01:30 PM',
      },
      {
        id: '6',
        startTime: '01:30 PM',
        endTime: '02:00 PM',
      },
    ],
  },
]

export const ProviderDetails = [
  {
    id: 1,
    pic: drImg4,
    name: 'Dr. Irfan Ali',
    email: 'asadkhan@email.com',
    phoneNo: '+123 123456789',
  },
  {
    id: 2,
    pic: drImg,
    name: 'Dr. Nikita S.',
    email: 'asadkhan@email.com',
    phoneNo: '+123 123456789',
  },
  {
    id: 3,
    pic: drImg2,
    name: 'Dr. John T.',
    email: 'asadkhan@email.com',
    phoneNo: '+123 123456789',
  },
  {
    id: 4,
    pic: drImg3,
    name: 'Dr. Siro J.',
    email: 'asadkhan@email.com',
    phoneNo: '+123 123456789',
  },
  {
    id: 5,
    pic: drImg3,
    name: 'Dr. Siro J.',
    email: 'asadkhan@email.com',
    phoneNo: '+123 123456789',
  },
]

export const OtherDrs = [
  {
    id: 1,
    pic: drImg4,
    name: 'Dr. Irfan Ali',
    email: 'asadkhan@email.com',
    phoneNo: '+123 123456789',
    date: '24/03/2023',
    slotTime: '09:00 PM - 10:00 PM',
  },
  {
    id: 2,
    pic: drImg,
    name: 'Dr. Nikita S.',
    email: 'asadkhan@email.com',
    phoneNo: '+123 123456789',
    date: '24/03/2023',
    slotTime: '09:00 PM - 10:00 PM',
  },
]

export const PatientsDetail = [
  {
    id: 1,
    name: 'Irfan Ali',
    email: 'asadkhan@email.com',
    phone: '+123 123456789',
    gender: 'Male',
    materialStatus: 'Single',
    dob: '24/03/2023',
    insurance: 'asd',
    relation: "son",
  },
  {
    id: 1,
    name: 'Aleem',
    email: 'aleem@email.com',
    phone: '+123 112323456789',
    gender: 'Male',
    materialStatus: 'Widowed',
    dob: '1/03/2023',
    insurance: 'asd',
    relation: "foster",
  },
]

export const columns = [
  {
    title: 'Patient Name',
    dataIndex: 'patientname',
    key: 'patientname',
  },
  {
    title: 'Doctor Name',
    dataIndex: 'drname',
    key: 'drname',
  },
  {
    title: 'Appointment Type',
    dataIndex: 'apptype',
    key: 'apptype',
  },
  {
    title: 'Appointment By',
    dataIndex: 'appby',
    key: 'appby',
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <Button className='border-none text-[#14226D] hover:text-[#14226D]' icon={<FaEdit size={18}/>} />
        <Button className='border-none text-red-600 hover:text-red-600'  icon={<MdDelete size={18}/>} />
      </Space>
    ),
  },
];

export const dataSource = [
  {
    key: '1',
    patientname: 'John Memoa',
    drname: 'Dr.Irfan Ali',
    apptype: 'Denture Setup',
    appby: 'Self',
    date: '20/04/2023',
    time: '09:00 AM - 10:00 AM',
  },
  
  
];