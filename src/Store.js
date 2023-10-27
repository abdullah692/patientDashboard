import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./Slices/Auth.slice";
import dashboardReducer from "./Slices/Dashboard.slice"

import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";
import AppointmentSlice from "./Slices/Appointment.slice";
import DentistSlice from "./Slices/Dentist.slice";
// import GroupSlice from "./Slices/Groups.slice";
import PatientSlice from "./Slices/Patient.slice";
import GroupSlice from "./Slices/Group.slice";
import InsuranceSlice from "./Slices/Insurance.slice";
import GroupsSlice from "./Slices/Groups.slice"


const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "Patient"],
};

const rootReducer = combineReducers({
  auth: AuthReducer,
  dashboard:dashboardReducer,
  Appointment: AppointmentSlice,
  Dentist: DentistSlice,
  Patient: PatientSlice,
  Group: GroupSlice,
  Insurance: InsuranceSlice,
  Groups:GroupsSlice
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export const persistor = persistStore(store);
