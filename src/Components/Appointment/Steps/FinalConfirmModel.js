import Modals from '../../Modals/Modals'
import { useState } from 'react'
import { ClipLoader } from 'react-spinners'

import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import relativeTime from 'dayjs/plugin/relativeTime'

// Load the plugins
dayjs.extend(customParseFormat)
dayjs.extend(relativeTime)

function formatDate(inputDate) {
  const formattedDate = dayjs(inputDate, 'MM-DD-YY').format('ddd, Do MMM, YYYY')
  return formattedDate;
}

const FinalConfirmModel = ({
  isOpen,
  closeModal,
  appointments,
  handleFinalSubmit,
}) => {
  const [isLoading, setIsLoading] = useState(false)
console.log(appointments, "apmnt:finalConfirm");
  const modalTitle = (
    <div>
      <p className='text-lg'>Appointment Confirmation</p>
      <div className='border-b-2 border-sea-green w-[50px] mb-4'></div>
    </div>
  )
  return (
    <Modals
      open={isOpen}
      title={modalTitle}
      footer={[
        <div className='flex gap-x-4 justify-end pt-4'>
          <button
            disabled={isLoading}
            onClick={closeModal}
            className='rounded-lg py-2 px-5 border-0 text-red-600 hover:bg-red-600 hover:text-white'
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setIsLoading(true)
              handleFinalSubmit(() => setIsLoading(false))
            }}
            type='submit'
            disabled={isLoading}
            className={`rounded-lg bg-gradient-to-r border border-sea-green text-white from-sea-green to-dashboard-green hover:from-dashboard-green hover:to-[#10967f] flex items-center justify-center site py-2 px-5`}
          >
            {isLoading ? 'Loading...' : 'Submit'}
            <span>
              <ClipLoader
                cssOverride={{
                  display: 'block',
                  marginLeft: '1rem',
                  borderColor: 'white',
                }}
                color={'seagreen'}
                loading={isLoading}
                size={20}
              />
            </span>
          </button>
        </div>,
      ]}
      onOk={() => {}}
      onCancel={isLoading ? () => {} : closeModal}
      width={580}
    >
      <div className=''>
        {appointments.map((apmnt, index) => {
          return (
            <div key={index} className='mt-6'>
              <h3 className='font-bold'>Appointment {index + 1}</h3>
              <div className='mt-2'>
                Dental appointment at Genesis Health has been confirmed for
                <span className='text-sea-green font-semibold'>
                  &nbsp;{apmnt.d_name}
                </span>{' '}
                at
                <span className='font-bold'>
                  &nbsp;{formatDate(apmnt.date)}
                </span>{' '}
                at
                <span className='font-bold'>
                  &nbsp;{apmnt.startTime} - {apmnt.endTime}
                </span>
                &nbsp;for
                <span className='font-bold'>&nbsp;{apmnt.patientName}.</span>
                We look forward to seeing you then.
              </div>
            </div>
          )
        })}
      </div>
    </Modals>
  )
}

export default FinalConfirmModel
