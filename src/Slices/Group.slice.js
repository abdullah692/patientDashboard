import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import groupService from "../Services/group.service";

const initialState = {
    group: {},
    groupNameList: [],
    // groupMember: {},
}


export const fetchGroupById = createAsyncThunk(
    "Group/fetchGroupById",
    async ({ id }, { rejectWithValue }) => {
      try {
        console.log(id, "id:fetchGroupById");
        let response = await groupService.fetchGroupById(id);
        console.log(response, "response: fetchGroupById" );
        return response.data.data;
      } catch (error) {
        return rejectWithValue(error);
      }
    }
);

export const fetchGroupMemberById = createAsyncThunk(
    "Group/fetchGroupMemberById",
    async ({ id }, { rejectWithValue }) => {
      try {
        console.log(id, "id:fetchGroupMemberById");
        let response = await groupService.fetchGroupMemberById(id);
        console.log(response, "response: fetchGroupMemberById" );
        return response.data.data;
      } catch (error) {
        return rejectWithValue(error);
      }
    }
);

export const fetchGroupName = createAsyncThunk(
    "Group/fetchGroupName",
    async (_, { rejectWithValue }) => {
      try {
        let response = await groupService.fetchGroupName();
        console.log(response, "response: fetchGroupMemberById" );
        return response.data.data;
      } catch (error) {
        return rejectWithValue(error);
      }
    }
);


  export const GroupSlice = createSlice({
    name: "Group",
    initialState,
    // reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchGroupById.fulfilled, (state, { payload }) => {
          console.log(payload, "fetchGroupById.fulfilled");
          state.group = payload;
        })
        .addCase(fetchGroupMemberById.fulfilled, (state, { payload }) => {
          console.log(payload, "fetchGroupMemberById.fulfilled");
          state.group["GroupMembers"] = [payload];
          state.group["group_name"] = payload.Group.group_name;
        })
        .addCase(fetchGroupName.fulfilled, (state, { payload }) => {
          console.log(payload, "fetchGroupName.fulfilled");
          state.groupNameList = payload
        })
    },
  });


// export const { logout } = AuthSlice.actions;

export default GroupSlice.reducer;
