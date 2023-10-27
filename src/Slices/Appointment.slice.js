import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import auth from './../Services/auth'
import { NotificationWithIcon } from '../Utils/Notification'
import apmntService from '../Services/appointmet.service'
import authApi from '../Utils/axiosconfig'
import authHeader from '../Services/authHeader'

const initialState = {
  appointmentTypes: [],
  allAppointmentTypes: [],
  appointmentFor: '',
  appointments: [],
  appointmentsForTable: [],
  updateAppointment: {},
  aptHistory: [],
  appoinmentList: [],
}

export const deleteAppointment = createAsyncThunk(
  'Appointment/deleteAppointment',
  async ({ apt_id }, { rejectWithValue }) => {
    try {
      console.log(apt_id, 'deleteAppointment:apt_id')
      const res = await authApi.delete(`appointment/${apt_id}`, {
        headers: authHeader(),
      })
      console.log(res, 'deleteAppointment:res')
      return res.data
    } catch (error) {
      rejectWithValue(error)
    }
  }
)

export const getAppointmentTypes = createAsyncThunk(
  'Appointment/getAppointmentTypes',
  async ({ Docid }, { rejectWithValue }) => {
    try {
      const res = await authApi.get(`booking/appointmenttypes/${Docid}`, {
        headers: authHeader(),
      })
      console.log(res, 'getAppointmentTypes:res')
      return res.data.data
    } catch (error) {
      rejectWithValue(error)
    }
  }
)




export const getAllAppointmentTypes = createAsyncThunk(
  'Appointment/getAllAppointmentTypes',
  async (data, { rejectWithValue }) => {
    try {
      const res = await authApi.get(
        `appointmenttypes`,
        { headers: authHeader() }
      )
      console.log(res?.data, 'getAllAppointmentTypes:res')
      return res.data.data
    } catch (error) {
      rejectWithValue(error)
    }
  }
)

export const getAllAppointmentDispatch = createAsyncThunk(
  'Appointment/getAllAppointment',
  async (_, { rejectWithValue }) => {
    try {
      console.log('dispatchhhruningin')
      const res = await apmntService.getAllAppointment()
      console.log(res, 'getAppointmentTypes:res')
      return res.data.data
    } catch (error) {
      console.log(error, 'errooorrrrwe')
      rejectWithValue(error)
    }
  }
)

export const getAppointmentById = createAsyncThunk(
  'Appointment/getAppointmentById',
  async ({ id }, { rejectWithValue }) => {
    try {
      console.log('getAppointmentById id = ', id)
      const res = await apmntService.getAppointmentById(id)
      console.log(res, 'getAppointmentById:res')
      return res.data.data
    } catch (error) {
      console.log(error, 'getAppointmentById:err')
      rejectWithValue(error)
    }
  }
)

export const appointmentBooked = createAsyncThunk(
  'Appointment/appointmentBooked',
  async (data, { rejectWithValue }) => {
    try {
      const res = await authApi.post(`appointment`, data, {
        headers: authHeader(),
      })
      console.log(res, 'appointmentBooked:res')
      return res.data
    } catch (error) {
      console.log(error, "appointmentBooked:error");
      return rejectWithValue(error);
    }
  }
)

// fetch new booked appointment
// export const fetchNewAppointment = createAsyncThunk(
//     "Appointment/fetchNewAppointment",
//     async (data, { rejectWithValue }) => {
//         try {
//             const res = await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/api/booking/appointment`, data, { withCredentials: true });
//             console.log(res, "appointmentBooked:res");
//             return res.data;
//         } catch (error) {
//             rejectWithValue(error);
//         }
//     }
// )

// Availibility Slice
export const getAvailibility = createAsyncThunk(
  'Appointment/getAvailibility',
  async ({ Docid }, { rejectWithValue }) => {
    try {
      const res = await authApi.get(`booking/availability/${Docid}`, {
        headers: authHeader(),
      })
      console.log(res, 'getAvailibility:res')
      return res.data
    } catch (error) {
      rejectWithValue(error)
    }
  }
)

export const updatedAptPriority = createAsyncThunk(
  'Appointment/getAvailibility',
  async (data, { rejectWithValue }) => {
    console.log(data, 'aptupdateddd')
    try {
      const res = await apmntService.updatedAptPriority(data)
      if (res.status == 200) {
        NotificationWithIcon('success', res.data.message)
        return res.data
      }
    } catch (error) {
      rejectWithValue(error)
    }
  }
)

export const updateApmntById = createAsyncThunk(
  'Appointment/updateApmntById',
  async (data, { rejectWithValue }) => {
    console.log(data, 'aptupdateddd')
    try {
      const res = await apmntService.updateApmntById(data);
      return res.data;
    } catch (error) {
      rejectWithValue(error)
    }
  }
)

export const getApptHistory = createAsyncThunk(
  'Appointment/getAptHistory',
  async (id, { rejectWithValue }) => {
    try {
      const res = await apmntService.getAppointmentHistory(id)
      console.log(res.data, 'relation:res')
      return res.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

const AppointmentSlice = createSlice({
  initialState,
  name: 'Appointment',
  reducers: {
    setAppointmentFor: (state, { payload }) => {
      console.log(payload, 'payload:setAppointmentFor')
      state.appointmentFor = payload.appointmentFor
    },
    addApmntDataInPatientData: (state, { payload }) => {
      console.log(payload, 'payload:addApmntDataInPatientData')
      console.log(state.newAppointment, 'state:addApmntDataInPatientData')
      // state.newAppointment = { ...state.newAppointment, payload }
    },
    addApmntInList: (state, { payload }) => {
      console.log(payload, 'payload: addApmntInList')
      state.appointments.push(payload)
    },
    deleteApmntFromList: (state, { payload }) => {
      console.log(payload, 'payload: deleteApmntFromList')
      state.appointments = payload
    },
    addApmntForTable: (state, { payload }) => {
      console.log(payload, 'payload: addApmntForTable')
      state.appointmentsForTable.push(payload)
    },
    deleteApmntFromTable: (state, { payload }) => {
      console.log(payload, 'payload: deleteApmntFromTable')
      state.appointmentsForTable = payload
    },
    // set Number for the appointment that is going on update phase;
    setUpdateAppointment: (state, { payload }) => {
      state.updateAppointment = payload
    },
    // update Appointment Data
    updateApmntInList: (state, { payload }) => {
      console.log(payload, 'payload: addApmntInList')
      state.appointments = payload
    },
    updateApmntFromTable: (state, { payload }) => {
      console.log(payload, 'payload: deleteApmntFromTable')
      state.appointmentsForTable = payload
    },
    resetEveryThingFromAppointment: (state, { payload }) => {
      state.appointmentTypes = []
      state.appointmentFor = ''
      state.appointments = []
      state.appointmentsForTable = []
      state.updateAppointment = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAppointmentTypes.fulfilled, (state, { payload }) => {
        console.log(payload, 'getAppointmentTypes:payload')
        state.appointmentTypes = payload
      })
      .addCase(getAllAppointmentTypes.fulfilled, (state, { payload }) => {
        console.log(payload, 'getAllAppointmentTypes:payload')
        state.allAppointmentTypes = payload
      })
      .addCase(updatedAptPriority.fulfilled, (state, { payload }) => {
        console.log(payload, 'payloadddddddddaptupdatd')
      })
      .addCase(getApptHistory.fulfilled, (state, {payload}) => {
        console.log(payload, "payloadddapttHistory");
        state.aptHistory = payload.data
      })
      .addCase(getAllAppointmentDispatch.fulfilled, (state, { payload }) => {
        console.log(payload, "payload:AllAppoinments");
        const formattedEvents = payload.map((appointment) => {
          return {
            apt_id: appointment.id,
            title: appointment.AppointmentType.type,
            start: new Date(appointment.start_time),
            end: new Date(appointment.end_time),
            ...appointment,
          }
        })
        state.appoinmentList = formattedEvents;
      })
      .addCase(getAppointmentById.fulfilled, (state, { payload }) => {
        console.log(payload, "getAppointmentById.fulfilled");
        const data = {
          avId: payload?.av_id,
          atId: payload?.at_id,
          // startTime: payload?.start_time,
          startTime: new Date(payload?.start_time).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          }),
          endTime: new Date(payload?.end_time).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          }),
          // endTime: payload?.end_time,
          d_id: payload?.AppointmentType?.d_id,
          apmntType: payload?.AppointmentType?.type,
          d_name: payload?.AppointmentType?.Dentist?.name,
          patientName: payload?.Patient?.name,
          insId: payload?.ins_id,
          priority: payload?.priority,
          p_id: payload?.p_id,
          date: payload?.start_time.split("T")[0],
          status: payload?.status,
        }
        state.appointments = [data];
      })
  },
})

export const {
  addApmntDataInPatientData,
  setAppointmentFor,
  addApmntInList,
  deleteApmntFromList,
  addApmntForTable,
  deleteApmntFromTable,
  setUpdateAppointment,
  updateApmntInList,
  updateApmntFromTable,
  resetEveryThingFromAppointment,
} = AppointmentSlice.actions
export default AppointmentSlice.reducer
