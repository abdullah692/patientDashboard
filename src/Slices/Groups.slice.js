import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authApi from '../Utils/axiosconfig'
import authHeader from '../Services/authHeader'

const initialState = {
  GroupsInfo: '',
  GroupInfoId:{}
}

export const createProvidersGroup = createAsyncThunk(
    'Groups/createProvidersGroup',
    async ({groupInfo}, { rejectWithValue }) => {
      console.log('createProvidersGroup', groupInfo)
      try {
        const res = await authApi.post(`group`,groupInfo, { headers: authHeader() })
        console.log(res.data, 'createProvidersGroup:res')
        return res.data.message
      } catch (error) {
        console.log(error, 'errrorrrrrcreateProvidersGroup')
        return rejectWithValue(error)
      }
    }
  )

  export const updateGroup = createAsyncThunk(
    'Groups/updateGroup',
    async ({id,groupInfo}, { rejectWithValue }) => {
      debugger
      console.log('updateGroup', groupInfo)
      try {
        const res = await authApi.patch(`group/${id}`,groupInfo, { headers: authHeader() })
        console.log(res.data, 'createProvidersGroup:res')
        return res.data.message
      } catch (error) {
        console.log(error, 'errrorrrrrcreateProvidersGroup')
        return rejectWithValue(error)
      }
    }
  )

export const getGroups = createAsyncThunk(
  'Groups/getGroups',
  async (_, { rejectWithValue }) => {
    console.log('getGroup', _)
    try {
      const res = await authApi.get(`group`, {
        headers: authHeader(),
      })
      console.log(res.data.data, 'getGroup:res')
      return res.data.data
    } catch (error) {
      console.log(error, 'getGroup')
      return rejectWithValue(error)
    }
  }
)

export const getGroupById = createAsyncThunk(
  'Groups/getGroupById',
  async (id, { rejectWithValue }) => {
    // debugger
    console.log('getGroupById',id)
    try {
      const res = await authApi.get(`group/${id}`, {
        headers: authHeader(),
      })
      console.log(res.data.data, 'getGroupById:res')
      return res.data.data
    } catch (error) {
      console.log(error, 'getGroupByIdError')
      return rejectWithValue(error)
    }
  }
)

export const delGroup = createAsyncThunk(
  'Groups/delGroup',
  async (g_id, { rejectWithValue }) => {
    
    console.log('delGroup', g_id)

    try {
      const res = await authApi.delete(`group/${g_id}`, {
        headers: authHeader(),
      })
      console.log(res.data, 'delGroup:res')
      return res.data?.message
    } catch (error) {
      console.log(error, 'delGroup')
      return rejectWithValue(error)
    }
  }
)


export const delGroupMember = createAsyncThunk(
  'Groups/delGroupMember',
  async (m_id, { rejectWithValue }) => {
    
    console.log('delGroupMember', m_id)
    try {
      const res = await authApi.delete(`groupmember/${m_id}`, {
        headers: authHeader(),
      })
      console.log(res.data.message, 'delGroupMember:res')
      return res.data.message
    } catch (error) {
      console.log(error, 'delGroup')
      return rejectWithValue(error)
    }
  }
)

const GroupSlice = createSlice({
  initialState,
  name: 'Groups',
  reducers: {},
  extraReducers: builder => {
    builder.
    addCase(createProvidersGroup.fulfilled, (state, { payload }) => {
      console.log('payload,createProvidersGroup', payload)
      state.GroupsInfo = payload
    })
    .addCase(getGroupById.fulfilled, (state, { payload }) => {
      // debugger
      console.log('payload,getGroupById', payload)
      state.GroupInfoId = payload
    })
  },
})

// export const { setUpdProviderId } = DentistSlice.actions
export default GroupSlice.reducer
