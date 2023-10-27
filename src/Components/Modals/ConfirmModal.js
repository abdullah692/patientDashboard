import { useDispatch } from 'react-redux'
import Modals from './Modals'

const ConfirmModal = ({ isOpen, closeModal, heading, body, handleYes }) => {
//   const dispatch = useDispatch()

  return (
    <Modals
      centered
      open={isOpen}
      title={heading}
      footer={[
        <div className='flex gap-x-4 justify-end pt-4'>
          <button
            onClick={closeModal}
            className='rounded-lg py-2 px-5 border-0 text-red-600 hover:bg-red-600 hover:text-white'
          >
            No
          </button>
          <button
            className={`rounded-lg bg-gradient-to-r border border-sea-green text-white from-sea-green to-dashboard-green hover:from-dashboard-green hover:to-[#10967f] flex items-center justify-center site py-2 px-5`}
            onClick={() => {
              handleYes()
            }}
          >
            Yes
          </button>
        </div>,
      ]}
      //   onOk={() => {}}
      onCancel={closeModal}
      width={580}
    >
      <div>{body}</div>
    </Modals>
  )
}

export default ConfirmModal
