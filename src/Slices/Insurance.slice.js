import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import insuranceService from "../Services/insurance.service";



const initialState = {
  insuranceList: [],
};

export const getAllInsurance = createAsyncThunk(
  "insurance/getAllInsurance",
  async (_, { rejectWithValue }) => {
    try {
      let response = await insuranceService.getAllInsurance();
      console.log(response.data, "response: getAllInsurance" );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const InsuranceSlice = createSlice({
  name: "insurance",
  initialState,
  reducers: { },
  extraReducers: (builder) => {
    builder
      .addCase(getAllInsurance.fulfilled, (state, { payload }) => {
        console.log(payload, "getAllInsurance.fulfilled");
        state.insuranceList = payload;
      })
  },
});


// export const { logout } = AuthSlice.actions;

export default InsuranceSlice.reducer;
