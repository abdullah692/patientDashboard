import { createSlice } from '@reduxjs/toolkit'
// import { combineReducers } from '@reduxjs/toolkit'

const intialState = {
  PatientPhoneNo: '',
}

export const patientPhoneNoSlice = createSlice({
  name: 'patientNo',
  initialState: intialState,
  reducers: {
    storePatientPhoneNo: (state, action) => {
      console.log('payload', action.payload)
      state.PatientPhoneNo = action.payload;
      // state.address=action.payload
    },
  }
});

export const { storePatientPhoneNo } = patientPhoneNoSlice.actions;
export default patientPhoneNoSlice.reducer;
