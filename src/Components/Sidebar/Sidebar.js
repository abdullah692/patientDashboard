import { HomeOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons'
import { TbDeviceAnalytics } from 'react-icons/tb'
// import {GrHomeRounded} from "react-icons/gr"
import { FiSettings } from 'react-icons/fi'
import { FiMessageSquare } from 'react-icons/fi'
import { Layout, Menu, theme } from 'antd'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import ClapLogo from '../../assets/images/claplogo.png'
import { HiOutlineUserGroup } from 'react-icons/hi'
import { FaUserMd} from 'react-icons/fa'

const { Content, Sider } = Layout
const Sidebar = ({ children, active, setActive, userData }) => {
  const loacation = useLocation()
  console.log(loacation?.pathname, 'pathname')
  const navigate = useNavigate()
  const SidebarItem = [
    {
      label: (
        <div className="flex">
          <img src={logo} alt="logo" />
          <p className="text-[16px] ml-2">Genesis Health</p>
        </div>
      ),
      className:
        'font-semibold text-[25px]  !mt-[10%] !mb-8 text-center text-black	pointer-events-none',
    },
    {
      key: '1',
      icon: <HomeOutlined />,
      className: `!bg-transparent !text-[#5E6674] !mb-2  ${
        loacation?.pathname === '/dashboard' ? ' !text-[#5ECCB9] ' : ''
      }`,
      label: (
        <div className="flex">
          <p>Dashboard</p>
          {loacation?.pathname === '/dashboard' ? (
            <span className="text-[90px] ml-4 mt-[-32px]">.</span>
          ) : (
            ''
          )}
        </div>
      ),
      onClick: () => {
        setActive(1)
        navigate('/dashboard')
      },
    },
    {
      key: '2',
      icon: <CalendarOutlined />,
      label: (
        <div className="flex">
          <p>Schedule</p>

          {loacation?.pathname === '/schedule' ? (
            <span className="text-[90px] ml-4 mt-[-32px]">.</span>
          ) : (
            ''
          )}
        </div>
      ),
      className: `!bg-transparent !text-[#5E6674] !mb-2 ${
        loacation?.pathname === '/schedule' ? ' !text-[#5ECCB9] ' : ''
      }`,
      onClick: () => {
        setActive(2)
        navigate('/schedule')
      },
    },
    {
      key: '3',
      icon: <UserOutlined />,
      label: (
        <div className="flex">
          <p>Patients</p>

          {loacation?.pathname === '/patients' ||
          loacation?.pathname.includes('/patient-detail') || loacation?.pathname.includes('/edit-patient') ? (
            <span className="text-[90px] ml-4 mt-[-32px]">.</span>
          ) : (
            ''
          )}
        </div>
      ),
      className: `!bg-transparent !text-[#5E6674] !mb-2  ${
        loacation?.pathname === '/patients' || loacation?.pathname.includes('/patient-detail')
        || loacation?.pathname.includes('/edit-patient')
         ? '!text-[#5ECCB9] ' : ''
      }`,
      onClick: () => {
        setActive(3)
        navigate('/patients')
      },
    },
    {
      key: '4',
      icon: <FaUserMd />,
      label: (
        <div className="flex">
          <p>Provider</p>

          {loacation?.pathname === '/provider' ||
          loacation?.pathname.includes('/providerpersonalinfo') ||
          loacation?.pathname.includes('/editProviderInfo') ? (
            <span className="text-[90px] ml-4 mt-[-32px]">.</span>
          ) : (
            ''
          )}
        </div>
      ),
      className: `!bg-transparent !text-[#5E6674] !mb-2  ${
        loacation?.pathname === '/provider' ||
        loacation?.pathname.includes('/providerpersonalinfo') ||
        loacation?.pathname.includes('/editProviderInfo')
          ? '!text-[#5ECCB9] '
          : ''
      }`,
      onClick: () => {
        setActive(4)
        navigate('/provider')
      },
    },
    {
      key: '5',
      icon: <HiOutlineUserGroup size={18} />,
      label: (
        <div className="flex">
          <p>Groups</p>

          {loacation?.pathname === '/personalGroupInfo' ||
          loacation?.pathname === '/createGroup'  || loacation?.pathname?.includes('/editGroup')  ? (
            <span className="text-[90px] ml-4 mt-[-32px]">.</span>
          ) : (
            ''
          )}
        </div>
      ),
      className: `!bg-transparent !text-[#5E6674] !mb-2  ${
        loacation?.pathname === '/personalGroupInfo' ||
        loacation?.pathname === '/createGroup'|| loacation?.pathname?.includes('/editGroup') 
          ? '!text-[#5ECCB9] '
          : ''
      }`,
      onClick: () => {
        setActive(5)
        navigate('/personalGroupInfo')
      },
    },

    {
      key: '6',
      icon: <TbDeviceAnalytics size={18} />,
      label: (
        <div className="flex">
          <p>Analytics</p>

          {loacation?.pathname === '/analytics' ? (
            <span className="text-[90px] ml-4 mt-[-32px]">.</span>
          ) : (
            ''
          )}
        </div>
      ),
      className: `!bg-transparent !text-[#5E6674] ${
        loacation?.pathname === '/analytics' ? '!text-[#5ECCB9]' : ''
      }`,
      onClick: () => {
        setActive(6)
        navigate('/analytics')
      },
    },
    {
      key: '7',
      icon: <FiMessageSquare />,
      label: (
        <div className="flex ">
          <p className="">Messages</p>
          {loacation?.pathname === '/messages' ? (
            <span className="text-[90px] ml-4 mt-[-32px]">.</span>
          ) : (
            ''
          )}
        </div>
      ),
      className: `!bg-transparent !text-[#5E6674] !mb-2 ${
        loacation?.pathname === '/messages' ? '!text-[#5ECCB9] ' : ''
      }`,
      onClick: () => {
        setActive(7)
        navigate('/messages')
      },
    },
    {
      key: '8',
      icon: <FiSettings />,
      label: (
        <div className="flex">
          <p>Settings</p>

          {loacation?.pathname === '/settings' ? (
            <span className="text-[90px] ml-4 mt-[-32px]">.</span>
          ) : (
            ''
          )}
        </div>
      ),
      className: `!bg-transparent !text-[#5E6674] !mb-2 ${
        loacation?.pathname === '/settings' ? '!text-[#5ECCB9] ' : ''
      }`,
      onClick: () => {
        setActive(8)
        navigate('/settings')
      },
    },
    {
      label: (
        <div>
          <div className="absolute !mt-[-65px] ">
            <img
              src={ClapLogo}
              alt="clap"
              className="top-10 h-[130px] w-[150px]"
            />
          </div>
          {/* <div> */}
          <div className="mt-[110px]  pt-20 pb-2 px-5 rounded-[15px] flex flex-col justify-end bg-[rgba(94,204,185,.5)] ">
            <button className="  text-[12px]  rounded-[20px] px-6  !bg-[#5ECCB9] text-white">
              Get Help
            </button>
          </div>
          {/* </div> */}
        </div>
      ),
      className:
        '  font-semibold text-[25px]  !absolute !bottom-0 text-center text-black !h-[250px] w-[200px]	pointer-events-none',
    },
  ]

  return (
    <Layout>
      {userData && (
        <Sider
          // breakpoint="lg"
          // collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken)
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type)
          }}
        >
          <div className="logo" />
          <Menu
            theme="dark"
            mode="inline"
            className="h-full bg-white text-black"
            defaultSelectedKeys={['1']}
            items={SidebarItem}
          />
        </Sider>
      )}
      <Layout>
        <Content>
          {/* <div> */}
          <main className="min-h-screen">{children}</main>
          {/* </div> */}
        </Content>
      </Layout>
    </Layout>
  )
}
export default Sidebar
