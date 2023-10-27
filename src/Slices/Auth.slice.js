import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import auth from "../Services/auth";



const initialState = {
  value: 0,
  user: localStorage.getItem("user") || null,
  isLoggedin: false,
};

// export const registerUser = createAsyncThunk(
//   "users/registerUser",
//   async (data, { rejectWithValue }) => {
//     try {
//       console.log(data, "dataaaaaaaaa");
//       let response = await auth.register(data);
//       return response;
//     } catch (err) {
//       return rejectWithValue(err);
//     }
//   }
// );

export const loginUser = createAsyncThunk(
  "users/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      console.log(data);
      let response = await auth.login(data);
      console.log(response, "response: " );
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "users/logoutUser",
  async (data, thunkAPI) => {
    const response = await auth.logout(data);
    return response.data;
  }
);

// export const userThunk = createAsyncThunk(
//   "users/userThunk",
//   async (data, thunkAPI) => {
//     const response = await userService.getModeratorBoard();
//     console.log(response, "USERRRRasdasasd");
//     return response.data;
//   }
// );

// export const updatedUserInfo = createAsyncThunk(
//   "users/userInfo",
//   async ({data,id}, thunkAPI) => {
//     console.log(data,id,"FROM THUNK")
//     try {
//       const response = await userService.updatedUserInfo(data,id);
//       console.log("resssssssssssss", response);
//       if(response.status == 200){
//         openCustomNotificationWithIcon(
//                     "success",
//                     response.data.message
//                     );
//         return response.data;
//       }
//     } catch (error) {
//       console.log(error.message)
//       openCustomNotificationWithIcon(
//         "error",
//         error.message
//         );
//     }
//   }
// );

// export const getAllUsers = createAsyncThunk(
//   "users/getAllUsers",
//   async (data, { rejectWithValue }) => {
//     try {
//       const users = await userService.getAllUsersData();
//       return users.data;
//     } catch (error) {
//       console.log(error);
//       return rejectWithValue(error);
//     }
//   }
// )

export const AuthSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isLoggedin = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        console.log(payload, "REDUCE PAY");
        state.isLoggedin = true;
        state.user = payload;
      })
      // .addCase(registerUser.fulfilled, (state, { payload }) => {
      //   console.log(payload, "REGISTER PAY");
      // })
      // .addCase(updatedUserInfo.fulfilled, (state, { payload }) => {
      //   state.user = payload
      //   console.log(payload, "REGISTER PAY");
      // })
      // .addCase(getAllUsers.fulfilled, (state, action) => {
      //   state.usersList = action.payload;
      // });
  },
  // {
  //   [registerUser.fulfilled]: (state, action) => {

  //       state.isLoggedin=false
  //   },
  //   [registerUser.rejected]: (state, action) => {

  //       state.isLoggedin=false
  //   },
  //   [loginUser.fulfilled]: (state, {payload}) => {
  //       console.log(payload,"PAYLOAD")
  //       state.isLoggedin=true
  //       state.user=payload.user
  //   },
  //   [loginUser.rejected]: (state, {payload}) => {
  //     console.log(payload,"PAYLOAD")

  //       state.isLoggedin=false
  //       state.user=null
  //   },
  //   [logoutUser.fulfilled]: (state, {payload}) => {

  //       state.isLoggedin=false
  //       state.user=null
  //   },

  // },
});

export const user = (state) => state.auth;
export const userdetail = (state) => state.auth.user;
// export const usersList = (state) => state.auth.usersList;
// Action creators are generated for each case reducer function
export const { logout } = AuthSlice.actions;

export default AuthSlice.reducer;
