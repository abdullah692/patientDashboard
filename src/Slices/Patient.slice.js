import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import patService from '../Services/patient.service'
import { generateUniqueKey } from '../Utils/utils';

const initialState = {
  patientData: {},
  patientSearchData: {},
  isPatientExist: false,
  patientRelations: [],
  relations: [],
  patientInfo:[],
  sid: null,
  allpatients: [],
  otpVerified: {},
  dependents: [],
  partnerData: {},
  depInsuranceStatus: ["Self"]
}

export const fetchPatient = createAsyncThunk(
  'Patient/fetchPatient',
  async ({ name, dob, phone, id, sid, otp, isRemovePlusOne }, { rejectWithValue }) => {
    console.log({ name, dob, phone,id, isRemovePlusOne }, 'fetchPatient:dataToBeSend')
    try {
      const res = await patService.fetchPatient(name, dob, phone, id, sid, otp, isRemovePlusOne)
      console.log(res.data, 'updateDentist:res')
      return res.data
    } catch (error) {
      console.log(error, "errororor");
      return rejectWithValue(error)
    }
  }
)

export const fetchPatientWithDependent = createAsyncThunk(
  'Patient/fetchPatientWithDependent',
  async ({ name, dob, phone, id}, { rejectWithValue }) => {
    console.log({ name, dob, phone, id }, 'fetchPatientWithDependent:dataToBeSend')
    try {
      const res = await patService.fetchPatientWithDependent(name, dob, phone, id)
      console.log(res.data.data, 'fetchPatientWithDependent:res')
      return res.data.data
    } catch (error) {
      console.log(error, "errororor");
      return rejectWithValue(error.response.data);
    }
  }
)

export const fetchOtpForPatient = createAsyncThunk(
  'Patient/fetchOtpForPatient',
  async ({ name, dob, phone, id }, { rejectWithValue }) => {
    console.log({ name, dob, phone,id }, 'fetchOtpForPatient:dataToBeSend')
    try {
      const res = await patService.fetchOtpForPatient(name, dob, phone, id)
      console.log(res.data, 'fetchOtpForPatient:res')
      return res.data
    } catch (error) {
      console.log(error, "fetchOtpForPatient:errororor");
      return rejectWithValue(error)
    }
  }
)

export const verifyOtpOnlyForPatient = createAsyncThunk(
  'Patient/verifyOtpOnlyForPatient',
  async ({ phone, sid, otp }, { rejectWithValue }) => {
    console.log({ phone }, 'verifyOtpOnlyForPatient:dataToBeSend')
    try {
      const res = await patService.verifyOtpOnlyForPatient(phone, sid, otp)
      console.log(res.data, 'verifyOtpOnlyForPatient:res')
      return res.data
    } catch (error) {
      console.log(error, "verifyOtpOnlyForPatient:errororor");
      return rejectWithValue(error)
    }
  }
)

export const addPatients = createAsyncThunk(
  'Patient/addPatients',
  async (data, { rejectWithValue }) => {
    console.log(data, 'addPatient:dataToBeSend')
    try {
      const res = await patService.addPatient(data)
      console.log(res, 'addPatient:res')
      return res.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const getAllPatients = createAsyncThunk(
  'Patient/getAllPatient',
  async (_, { rejectWithValue }) => {
    // console.log({ name, dob, phone }, 'fetchPatient:dataToBeSend')
    try {
      const res = await patService.getAllPatients()
      console.log(res.data, 'GetAllPatients:res')
      return res.data.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const fetchPatientForRelation = createAsyncThunk(
  'Patient/fetchPatientForRelation',
  async ({ name, dob, phone, sid, otp, isRemovePlusOne }, { rejectWithValue }) => {
    console.log({ name, dob, phone, sid, otp, isRemovePlusOne }, 'fetchPatientForRelation:dataToBeSend')
    try {
      const res = await patService.fetchPatientForRelation(name, dob, phone, sid, otp, isRemovePlusOne)
      console.log(res.data, 'fetchPatientForRelation:res')
      return res.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const fetchAllRelation = createAsyncThunk(
  'Patient/fetchAllRelation',
  async (_, { rejectWithValue }) => {
    try {
      const res = await patService.fetchAllRelation()
      console.log(res.data, 'relation:res')
      return res.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
);

export const fetchPatientByNameOrDob = createAsyncThunk(
  'Patient/fetchPatientByNameOrDob',
  async ({ name, dob }, { rejectWithValue }) => {
    try {
      console.log(name, dob, "namefetchPatientByNameOrDob");
      const res = await patService.fetchPatientByNameOrDob(name, dob);
      console.log(res.data, 'relation:res')
      return res
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const deletePatientByID = createAsyncThunk(
  'Patient/deletePatient',
  async (id, { rejectWithValue }) => {
    try {
      console.log(id,"deletePatientBYID");
      const res = await patService.deletePatientByID(id);
      console.log(res, 'deleterelation:res')
      return res.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const deletePartnerById = createAsyncThunk(
  'Patient/deletePartnerById',
  async ({ id }, { rejectWithValue }) => {
    try {
      console.log(id,"deletePartnerById");
      const res = await patService.deletePartnerById(id);
      console.log(res, 'deletePartnerById:res')
      return res.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const fetchPatientPartner = createAsyncThunk(
  'Patient/fetchPatientPartner',
  async ({ name, dob, phone, patientId }, { rejectWithValue }) => {
    console.log({ name, dob, phone, patientId }, 'fetchPatientPartner:dataToBeSend')
    try {
      const res = await patService.fetchPatientPartner(name, dob, phone, patientId);
      console.log(res.data, 'fetchPatientPartner:res')
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
)

export const addNewDependent = createAsyncThunk(
  'Patient/addNewDependent',
  async (data, { rejectWithValue }) => {
    console.log(data, 'addNewDependent:dataToBeSend')
    try {
      const res = await patService.addNewDependent(data);
      console.log(res.data, 'fetchPatientPartner:res')
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
)

export const deleteDependent = createAsyncThunk(
  'Patient/deleteDependent',
  async ({ id }, { rejectWithValue }) => {
    console.log(id, 'deleteDependent:id')
    try {
      const res = await patService.deleteDependent(id);
      console.log(res.data, 'deleteDependent:res')
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
)

const PatientSlice = createSlice({
  initialState,
  name: 'Patient',
  reducers: {
    patientSearch: (state, { payload }) => {
      console.log(payload, 'payload:patientSearch')
      state.patientSearchData = payload
    },
    addPatientData: (state, { payload }) => {
      console.log(payload, 'payload:addPatientData')
      state.patientRelations = payload?.patientRelations?.length > 0 ? [...payload.patientRelations] : [];
      delete payload.patientRelations
      state.patientData = { ...payload }
    },
    createNewPatientRelation: (state, { payload }) => {
      console.log(payload, 'payload:createNewPatientRelation')
      state.patientRelations = payload
    },
    removeAllDataFromPatientSlice: (state, action) => {
      console.log("removeAllDataFromPatientSlice");
      state.patientData = {}
      state.patientSearchData = {}
      state.isPatientExist = false
      state.patientRelations = []
      state.relations = []
      state.patientInfo = []
      state.sid = null
    },
    patientInfoDispatch: (state, {payload}) => {
      console.log(payload, "payloadddPatientInfo");
      state.patientInfo = payload
    },
    setOtpVerified: (state, { payload }) => {
      console.log(payload, "otpVerified");
      state.otpVerified = {...state.otpVerified, ...payload};
    },
    setDeletePartner: (state, _) => {
      const dependents = state.dependents?.map(dep => {
        if(dep.created_by === state.partnerData?.id) return { ...dep, isDeleted: true };
        return { ...dep, insurance_inherit_from: { ...dep.insurance_inherit_from, id: state.patientData.id }};
      }) 
      state.dependents = dependents;
      state.partnerData = {};
      state.depInsuranceStatus = ["Self"];
    },
    updatePatientData: (state, { payload }) => {
      state.patientData = payload;
    },
    updatePartnerData: (state, { payload }) => {
      state.partnerData = payload;
    },
    updateDependentData: (state, { payload }) => {
      state.dependents = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatient.fulfilled, (state, { payload }) => {
        console.log('payload:fetchPatient', payload)
        if (payload.message === 'Patient Found') {
          // let verify = { [payload?.patient?.phone]: true };
          state.patientRelations = [...payload?.patient?.patientRelations.map(x => ({ ...x, insurance: x?.Insurance?.type }))]
          // payload?.patient?.patientRelations?.forEach(x => { verify[x.phone] = true });
          delete payload?.patient?.patientRelations
          state.patientData = { ...payload?.patient, insurance: payload?.patient?.Insurance?.type }
          // state.otpVerified = verify;
          state.isPatientExist = true
        } else if (payload.message === 'No Patient Found') {
          console.log("No Patient Found", "else");
          state.patientData = {
            dob: null, dp_url: null, email: '', gender: null, marital_status: null, name: '', insurance: null,
            phone: '', key: Math.floor(Math.random() * 10000), ...state.patientSearchData,
          }
          state.isPatientExist = false
          console.log(state.patientData, "else");
        }
      })
      .addCase(fetchPatient.rejected, (state, { payload }) => {
        console.log('payload:fetchPatient.rejected', payload)
        state.patientData = {}
        state.isPatientExist = false
      })
      builder.addCase(fetchAllRelation.fulfilled, (state, { payload }) => {
        state.relations = payload.data
      })
      builder.addCase(getAllPatients.fulfilled, (state, { payload }) => {
        console.log(payload, "payloadddGetAllPatient");
        state.allpatients = payload
      })
      .addCase(addPatients.fulfilled, (state, {payload}) => {
        console.log(payload, "payloadddAddPatient");
      })
      builder.addCase(fetchOtpForPatient.fulfilled, (state, { payload }) => {
        console.log(payload, "fetchOtpForPatient.fulfilled");
        if (payload.message === 'No Patient Found') {
          state.patientData = {
            dob: null, dp_url: null, email: '', gender: null, marital_status: null, name: '', insurance: null,
            phone: '', key: Math.floor(Math.random() * 10000), ...state.patientSearchData,
          }
          state.isPatientExist = false
          console.log(state.patientData, "else");
        }
        else{
          console.log(payload, "fetchOtpp:payload");
          state.sid = payload.sid;
        }
      })
      builder.addCase(fetchPatientWithDependent.fulfilled, (state, { payload }) => {
        console.log(payload, "fetchPatientWithDependent:payload");
        const partnerData = payload?.partner
        state.isPatientExist = payload?.name ? true : false;
        const partnerDep = partnerData ? partnerData?.Dependents : [];
        const patientDep = payload?.Dependents ? payload?.Dependents : [];
        state.dependents = [
          ...patientDep?.map(x => ({ ...x, key: x?.id, insurance: x?.insurance_inherit_from?.id })), 
          ...partnerDep?.map(x => ({ ...x, key: x?.id, insurance: x?.insurance_inherit_from?.id }))
        ];
        delete payload.partner;
        delete payload.Dependents;
        delete partnerData?.Dependents;
        state.patientData = { ...payload, phone: payload?.phone?.slice(2), key: payload?.id };
        state.partnerData = Object.keys(partnerData || {}).length > 0 ? { ...partnerData, phone: partnerData?.phone?.slice(2), key: partnerData?.id }: null;
        state.depInsuranceStatus = Object.keys(partnerData || {}).length > 0 ? ["Self", "Partner"]: ["Self"]
      });
      builder.addCase(fetchPatientPartner.fulfilled, (state, { payload }) => {
        const partnerDep = payload?.Dependents ? [...payload?.Dependents] : [];
        state.dependents = [...state.dependents, ...partnerDep?.map(x => ({ ...x, key: x?.id, insurance: x?.insurance_inherit_from?.id }))];
        delete payload?.Dependents;
        state.partnerData = { ...payload, phone: payload?.phone?.slice(2) };
        state.depInsuranceStatus = ["Self", "Partner"];
      });
      builder.addCase(addNewDependent.fulfilled, (state, { payload })=> {
        const newData = [...state.dependents, { ...payload, key: payload?.id, insurance: payload?.insurance_inherit_from?.id }];
        state.dependents = newData;
      })
  },
})

export const {
  patientSearch,
  addPatientData,
  createNewPatientRelation,
  removeAllDataFromPatientSlice,
  patientInfoDispatch,
  setOtpVerified,
  setDeletePartner,
  updatePatientData,
  updatePartnerData,
  updateDependentData,
} = PatientSlice.actions
export default PatientSlice.reducer
