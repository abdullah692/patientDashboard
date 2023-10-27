import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import authHeader from '../../../Services/authHeader'

const initialState = {
  verifyPatient: [],
  insuranceTypes: [],
}

export const getPatientVerification = createAsyncThunk(
  'Patient/getPatientVerification',
  async ({ patientPhoneNo }, { rejectWithValue }) => {
    try {
      console.log('Patient Phone No', patientPhoneNo)
      const apiRes = await axios.get(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/booking/patient/${patientPhoneNo}`,
        { headers: authHeader() }
      )
      return apiRes.data
    } catch (error) {
      rejectWithValue(error)
    }
  }
)

export const getInsuranceType = createAsyncThunk(
  'Patient/getInsuranceType',
  async (data, { rejectWithValue }) => {
    try {
      console.log(process.env.REACT_APP_BACKEND_API_URL)
      const apiRes = await axios.get(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/booking/insurence`,
        { headers: authHeader() }
      )
      console.log('Api Res', apiRes.data)
      return apiRes?.data?.data
    } catch (error) {
      rejectWithValue(error)
    }
  }
)

const PatientVerificationSlice = createSlice({
  name: 'Patient',
  initialState,
  reducers: {},
  extraReducers: builder =>
    builder
      .addCase(getPatientVerification.fulfilled, (state, { payload }) => {
        console.log('PatientVerification', payload)
        state.verifyPatient = payload
      })
      .addCase(getInsuranceType.fulfilled, (state, { payload }) => {
        console.log('Insurance type', payload)
        state.insuranceTypes = payload
      }),
})

export default PatientVerificationSlice.reducer
