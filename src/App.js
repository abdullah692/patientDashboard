import './App.css'
import Dashboard from './Components/Dashboard'
import Header from './Components/Header/Header'
import Sidebar from './Components/Sidebar/Sidebar'
import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Schedule from './Components/Schedule/Schedule'
// import Pateints from './Components/Patients/Patients'
import Analytics from './Components/Analytics/Analytics'
import Messages from './Components/Messages/Messages'
import Settings from './Components/Settings/Setings'
import Signin from './Components/Auth/Signin'
import { ProtectedRoute } from './Utils/ProctedRoutes'
import { useDispatch, useSelector } from 'react-redux'
import { user } from './Slices/Auth.slice'
import EditSchedule from './Components/Schedule/EditSchedule'
// import io from 'socket.io-client'
import AddDentist from './Components/Dentist/AddDentist'
import ProviderList from './Components/Dentist/ProviderList.js'
import UpdateProvider from './Components/Dentist/UpdateProvider'
import AppointmentConfirmed from './Components/CreateAppointment/AppointmentConfirmed/AppointmentConfirmed'
import ProviderPersonalInfo from './Components/Dentist/ProviderPersonalInfo'
import EditProviderInfo from './Components/Dentist/EditProviderInfo'
import AllPatientsDetail from './Pages/AllPatientsDetail'
import PatientList from './Components/PatientDetail/PatientList'
import CreateGroup from './Components/Groups/CreateGroup'
import PersonalGroupsInfo from './Components/Groups/PersonalGroupsInfo'
import EditPatientInfo from './Pages/EditPatientInfo'
import AddAppointmentNew from './Pages/AddAppointmentNew2'
import AppoinmentDetails from './Components/Appointment/Steps/AppoinmentDetails'

// const socket = io.connect(process.env.REACT_APP_BACKEND_API_URL)

function App() {
  const [active, setActive] = useState(1)
  const { isLoggedin, user: userdata } = useSelector(user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // useEffect(() => {
  //   socket.emit('join_room', { room: '1' })
  //   socket.on('appointment_booked', (data) => {
  //     console.log('appointment_booked', data)
  //     NotificationWithIcon('info', "An appointment has been booked")
  //     // dispatch(fetchNewAppointment(data?.ap_id));
  //   })
  // }, [])

  // useEffect(() => {
  //   if (userdata) {
  //     return navigate('/dashboard')
  //   }
  // }, [userdata])

  return (
    <div>
      {/* <div> */}
      <Sidebar active={active} userData={userdata} setActive={setActive}>
        {userdata && (
          <div className='className="pl-[70px] pr-[70px]'>
            <Header active={active} />
          </div>
        )}
        {/* </div> */}
        <Routes>
          <Route
            path='/appConfirmed'
            element={
              <ProtectedRoute user={userdata}>
                <AppointmentConfirmed />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path='/dashboard'
            element={
              <ProtectedRoute user={userdata}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path='/schedule'
            element={
              <ProtectedRoute user={userdata}>
                <Schedule />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path='/edit-schedule/:apmnt_id'
            element={
              <ProtectedRoute user={userdata}>
                {/* <EditSchedule /> */}
                {/* <AddAppointmentNew  /> */}
                <div className='pt-8 bg-white' style={{ height: 'calc(100vh - 80px)' }}>
                  <AppoinmentDetails />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path='/addprovider'
            element={
              <ProtectedRoute user={userdata}>
                <AddDentist />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path='/provider'
            element={
              <ProtectedRoute user={userdata}>
                <ProviderList />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path='/patients'
            element={
              <ProtectedRoute user={userdata}>
                <PatientList />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path='/updateprovider'
            element={
              <ProtectedRoute user={userdata}>
                <UpdateProvider />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path='/providerpersonalinfo/:id'
            element={
              <ProtectedRoute user={userdata}>
                <ProviderPersonalInfo />
              </ProtectedRoute>
            }
          />

          <Route
            exact
            path='/editProviderInfo/:id'
            element={
              <ProtectedRoute user={userdata}>
                <EditProviderInfo />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path='/patient-detail/:id'
            element={
              <ProtectedRoute user={userdata}>
                <AllPatientsDetail />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path='/edit-patient-info/:id'
            element={
              <ProtectedRoute user={userdata}>
                <EditPatientInfo />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path='/addappointment'
            element={
              <ProtectedRoute user={userdata}>
                <AddAppointmentNew />
              </ProtectedRoute>
            }
          />

          <Route
            exact
            path='/personalGroupInfo'
            element={
              <ProtectedRoute user={userdata}>
                <PersonalGroupsInfo />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path='/createGroup'
            element={
              <ProtectedRoute user={userdata}>
                <CreateGroup />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/createGroup"
            element={
              <ProtectedRoute user={userdata}>
                <CreateGroup/>
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/editGroup/:id"
            element={
              <ProtectedRoute user={userdata}>
                <CreateGroup/>
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/analytics"
            element={
              <ProtectedRoute user={userdata}>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path='/messages'
            element={
              <ProtectedRoute user={userdata}>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path='/settings'
            element={
              <ProtectedRoute user={userdata}>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route exact path='/' element={<Signin />} />
        </Routes>
      </Sidebar>
    </div>
  )
}

export default App
