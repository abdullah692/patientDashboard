import React from 'react'
import profileImg from '../../assets/images/profile.png'
// import arrow from "../../assets/images/arrowdown.png";
import { Menu } from '@headlessui/react'
import { useDispatch } from 'react-redux'
import { logout } from '../../Slices/Auth.slice'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function Profile() {
  const dispatch = useDispatch()

  const handleClick = () => {
    dispatch(logout())
  }
  return (
    <div>
      {/* <div className="px-2 sm:px-6 lg:px-8">
            <div className="relative "> */}
      <div className=' '>
        <Menu as='div' className='relative'>
          <div>
            <Menu.Button>
              <div className='flex justify-evenly'>
                <img className='rounded-full' src={profileImg} alt='profile' />
              </div>
            </Menu.Button>
          </div>
          {/* <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  > */}
          <Menu.Items className='absolute left-10 z-10 mt-[-20px] w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={classNames(
                    active ? 'bg-gray-100' : '',
                    'block w-full text-left px-4 py-2 text-sm text-gray-700 no-underline'
                  )}
                >
                  Your Profile
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={classNames(
                    active ? 'bg-gray-100' : '',
                    'block w-full text-left px-4 py-2 text-sm text-gray-700 no-underline'
                  )}
                >
                  Settings
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={classNames(
                    active ? 'bg-gray-100' : '',
                    'block w-full text-left px-4 py-2 text-sm text-gray-700 no-underline'
                  )}
                  onClick={handleClick}
                >
                  Sign out
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
          {/* </Transition> */}
        </Menu>
      </div>
    </div>
    //        </div>
    //  </div>
  )
}

export default Profile
