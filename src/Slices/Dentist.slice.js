import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import authApi from '../Utils/axiosconfig'
import authHeader from '../Services/authHeader'

const initialState = {
  dentistList: [],
  providerListSearch: [],
  insurenceList: [],
  providerUpdId: null,
  providerInfoById:[]
}

export const getDentistList = createAsyncThunk(
  'Dentist/getDentistList',
  async (_, { rejectWithValue }) => {
    console.log('getDentistList', 'DocidDocid')
    try {
      const res = await authApi.get(`dentist`, { headers: authHeader() })
      console.log(res.data, 'getDentistList:res')
      return res.data.data
    } catch (error) {
      console.log(error, 'errrorrrrrrDenstist')
      rejectWithValue(error)
    }
  }
)

export const getAllProviderList = createAsyncThunk(
  'Dentist/getAllProviderList',
  async ({searchBy}, { rejectWithValue }) => {
    try {
      const {name='',gender='',appointmentType=''}=searchBy;
      console.log('nameaaaaaaaaaaaaaaaaaaa',searchBy);
      console.log('gender',gender);
      console.log('appointmentType',appointmentType);
      const res = await authApi.get(`dentists/search?name=${name}&gender=${gender}&type=${appointmentType}`, {
        headers: authHeader(),
      })
      console.log(res.data, 'getAllProviderList:res')
      return res.data.dentists
    } catch (error) {
      rejectWithValue(error)
    }
  }
)

export const getProviderById = createAsyncThunk(
  'Dentist/getProviderById',
  async ({ id }, { rejectWithValue }) => {
    try {
      const res = await authApi.get(`dentist/${id}`, { headers: authHeader() })
      console.log(res, 'getProviderById:res')
      return res.data.data
    } catch (error) {
      console.log(error, 'error:getProviderById')
      rejectWithValue(error)
    }
  }
)

export const getInsurance = createAsyncThunk(
  'Dentist/getInsurance',
  async (data, { rejectWithValue }) => {
    console.log('getInsurance', 'DocidDocid')
    try {
      const res = await authApi.get(`booking/insurence`, {
        headers: authHeader(),
      })
      console.log(res, 'getInsurance:res')
      return res.data.data
    } catch (error) {
      rejectWithValue(error)
    }
  }
)

export const addDentist = createAsyncThunk(
  'Dentist/addDentist',
  async (data, { rejectWithValue }) => {
    console.log(data, 'addDentist:reqBefore')
    try {
      const res = await authApi.post(`adddentist`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...authHeader(),
        },
      })
      console.log(res.data, 'addDentist:res')
      return res.data
    } catch (error) {
      console.log(error, 'addDentist:slice')
      return rejectWithValue(error.response)
    }
  }
)

export const updateProviderInfo = createAsyncThunk(
  'Dentist/updateProviderInfo',
  async ({dentistInfo,providerId}, { rejectWithValue }) => {
    console.log(dentistInfo, 'dentistInfoPatch Req')
    console.log(providerId, 'providerIdPatchReq')
    try {
      const res = await authApi.patch(`dentist/${providerId}`, dentistInfo, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...authHeader(),
        },
      })
      console.log(res.data, 'respatchaaaa')
      return res.data
    } catch (error) {
      console.log(error, 'addDentist:slice')
      return rejectWithValue(error.response)
    }
  }
)

export const updateDentist = createAsyncThunk(
  'Dentist/updateDentist',
  async (data, { rejectWithValue }) => {
    console.log(data, 'updateDentist:reqBefore')
    try {
      const res = await authApi.patch(`dentist/${data.d_id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data', ...authHeader() },
      })
      console.log(res.data, 'updateDentist:res')
      return res.data
    } catch (error) {
      console.log(error, 'updateDentist:error')
      return rejectWithValue(error.response)
    }
  }
)

export const deleteProvider = createAsyncThunk(
  'Dentist/deleteProvider',
  async ({DocId}, { rejectWithValue }) => {
    console.log({ DocId}, 'deleteProvider')
    try {
      const res = await authApi.delete(
        `dentist/${DocId}`,
        { headers: authHeader() }
      )
      console.log(res.data, 'getDentAndAvailByAT:res')
      return res?.data?.message
    } catch (error) {
      rejectWithValue(error)
    }
  }
)


export const getDentistAndAvailibilityByApmntType = createAsyncThunk(
  'Dentist/getDentistAndAvailibilityByApmntType',
  async ({ type, day }, { rejectWithValue }) => {
    console.log({ type, day }, 'getDentAndAvailByAT')
    try {
      const res = await authApi.get(
        `booking/dentistbyapmnttypes/1?type=${encodeURIComponent(
          type
        )}&day=${day}`,
        { headers: authHeader() }
      )
      console.log(res, 'getDentAndAvailByAT:res')
      return res.data
    } catch (error) {
      rejectWithValue(error)
    }
  }
)


export const getProviderInfoByProviderId = createAsyncThunk(
  'Dentist/getProviderInfoByProviderId',
  async ({ providerInfoId }, { rejectWithValue }) => {
    console.log({ providerInfoId}, 'getProviderInfoByProviderId')
    try {
      const res = await authApi.get(
        `dentist/${providerInfoId}`,
        { headers: authHeader() }
      )
      console.log(res.data, 'getDentAndAvailByAT:res')
      return res.data.data
    } catch (error) {
      rejectWithValue(error)
    }
  }
)
const DentistSlice = createSlice({
  initialState,
  name: 'Dentist',
  reducers: {
    setUpdProviderId: (state, action) => {
      console.log('setUpdProviderId', action.payload)
      state.providerUpdId = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getDentistList.fulfilled, (state, { payload }) => {
      console.log('payload:getDentistList', payload)
      state.dentistList = payload
    })
    .addCase(getAllProviderList.fulfilled, (state, { payload }) => {
      console.log('payload:getAllProviderList', payload)
      state.providerListSearch = payload
    })
    .addCase(getProviderInfoByProviderId.fulfilled, (state, { payload }) => {
      console.log('payload:getProviderInfoByProviderId', payload)
      state.providerInfoById = [{...payload, AppointmentTypes: payload.AppointmentTypes.map(x => ({ ...x, key: x.id })) }]
    })
    builder.addCase(getInsurance.fulfilled, (state, { payload }) => {
      console.log('payload:getInsurance', payload)
      state.insurenceList = payload
    })
  },
})

export const { setUpdProviderId } = DentistSlice.actions
export default DentistSlice.reducer
