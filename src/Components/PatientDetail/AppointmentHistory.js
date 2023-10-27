import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getApptHistory } from '../../Slices/Appointment.slice'
import ApptHistoryPatients from './ApptHistoryPatients'

const AppointmentHistory = ({ id }) => {
  const dispatch = useDispatch()
  const aptHistory = useSelector((state) => state.Appointment.aptHistory)

  useEffect(() => {
    dispatch(getApptHistory(id))
      .unwrap()
      .then((x) => {
        console.log(x, 'Appointment History Loaded')
      })
      .catch((err) => {
        console.log(err, 'errorororo')
      })
  }, [])

  let currentTimestamp = new Date()
  console.log({ currentTimestamp })

  const upcomingVisits = aptHistory?.upcoming || []
  const lastVisit = aptHistory?.lastVisit || []
  const history = aptHistory?.history || []

  console.log({ history },"historay")

  return (
    <div className="m-5 overflow-auto">
      <div className="font-semibold text-[#464D59] text-md">
        Appointment History
      </div>
      <div className="border-b-2 border-sea-green w-[80px] mb-4"></div>

      <div
        className={`flex flex-col min-h-[340px]  overflow-auto ${
          aptHistory?.length > 0 ? 'pb-4' : 'pb-2'
        }`}
      >
        {upcomingVisits?.length > 0 ? (
          <>
            <h3 className="mx-4 text-gray-700 font-semibold text-md">
              Upcoming Visits
            </h3>
            {upcomingVisits?.map((x) => (
              <ApptHistoryPatients key={x.id} PatientHistory={x} />
            ))}
          </>
        ) : (
          <div className="w-full h-full flex justify-center items-center font-semibold">
            No Upcoming Visits
          </div>
        )}

        {lastVisit?.length > 0 && (
          <div>
            <h3 className="mx-4 text-gray-700 font-semibold text-md">
              Last Visit
            </h3>
            <ApptHistoryPatients PatientHistory={lastVisit[0]} />
          </div>
        )}
        {history?.length > 0 && (
          <div className="">
            <h3 className="mx-4 text-gray-700 font-semibold text-md">
              History
            </h3>
            {history?.map((x) => {
              console.log(x, 'appointment history')
              return <ApptHistoryPatients PatientHistory={x} key={x.id} />
            })}
          </div>
        )}

        {upcomingVisits?.length === 0 && lastVisit?.length === 0 && (
          <div className="w-full h-full flex justify-center items-center font-semibold">
            No Visits Available
          </div>
        )}
      </div>
    </div>
  )
}

export default AppointmentHistory
