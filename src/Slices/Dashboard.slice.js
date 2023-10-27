import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import dashboardServices from '../Services/dashboardServices'
import apmntService from '../Services/appointmet.service'

const initialState = {
  value: 0,
  user: localStorage.getItem('user') || null,
  isLoggedin: false,
  usersList: [],
  appointments: [],
  getAptall: [],
  patientsChart: [],
  genderData: [],
}

export const getPatientsChartData = createAsyncThunk(
  'users/getPatientsChartData',
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const data = await dashboardServices.getPatientsChartAdata()
      console.log(data, 'GRAPH')
      return data.data.appointments
    } catch (error) {
      console.log(error)
      return rejectWithValue(error)
    }
  }
)

export const getGenderChartData = createAsyncThunk(
  'users/getGenderChartData',
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const data = await dashboardServices.getGenderChartdata()
      console.log(data, 'gender')
      return data.data.data
    } catch (error) {
      console.log(error)
      return rejectWithValue(error)
    }
  }
)
export const getAllAppointments = createAsyncThunk(
  'users/getAllAppointments',
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const users = await apmntService.getAllAppointment()
      console.log(users.data.data, 'fggfffgjncjsncsnjcn')
      return users.data.data
    } catch (error) {
      console.log(error, 'error:dashboardSlice')
      return rejectWithValue(error)
    }
  }
)

function generateMonthData(data) {
  const monthData = []

  if (data.length === 0 || !data[0]?.date) {
    // Handle the case where data is empty or the first item doesn't have a date
    return monthData
  }

  const [year, month] = data[0].date.split('-').slice(0, 2)

  // Get the number of days in the specified month
  const daysInMonth = new Date(year, month, 0).getDate()

  // Convert input data to a map for easier lookup
  const dataMap = new Map(data.map(item => [item.date, item.patientCount]))

  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${month}-${day.toString().padStart(2, '0')}`
    const patientCount = dataMap.get(date) || 0

    monthData.push({ date, patientCount })
  }

  return monthData
}

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    logout: state => {
      state.user = null
      state.isLoggedin = false
    },
    setGetallApt: (state, { payload }) => {
      console.log(payload, 'getAllpayloaddddddddddddddd')
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getAllAppointments.fulfilled, (state, { payload }) => {
        console.log(payload, 'REDUCE PAY')

        const today = new Date()
        today.setUTCHours(0, 0, 0, 0)
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
        nextWeek.setHours(23, 59, 59, 999)

        const data = payload.filter(
          obj =>
            new Date(obj.start_time) >= today &&
            new Date(obj.start_time) <= nextWeek
        )
        console.log(data, 'Dataaaaaaaaaaaaaaaaaa')
        state.getAptall = data
      })
      .addCase(getPatientsChartData.fulfilled, (state, { payload }) => {
        state.patientsChart = generateMonthData(payload)
      })
      .addCase(getGenderChartData.fulfilled, (state, { payload }) => {
        state.genderData = payload
      })
  },
})

export const appointmentSelector = state => state.dashboard.appointments
export const patientsChatDataSelector = state => state.dashboard.patientsChart
export const genderDataSelector = state => state.dashboard.genderData
export const getAllApt = state => state.dashboard.getAptall
// export const usersList = (state) => state.auth.usersList;
// Action creators are generated for each case reducer function

export default dashboardSlice.reducer
