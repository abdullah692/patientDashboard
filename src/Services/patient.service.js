import authHeader from './authHeader'
import authApi from '../Utils/axiosconfig'

class PateintService {

  fetchOtpForPatient(name, dob, phone, id) {
    return authApi.get(
      `/patient/otp?name=${encodeURIComponent(
        name
      )}&dob=${dob}&phone=${encodeURIComponent(phone)}&id=${id}`,
      { headers: authHeader() }
    )
  }
  verifyOtpOnlyForPatient(phone, sid, otp) {
    return authApi.post(
      `/patient/verify/otp`,
      { phone, sid, otp },
      { headers: authHeader() }
    )
  }
  fetchPatient(name, dob, phone, id, sid, otp, isRemovePlusOne) {
    return authApi.get(
      `patient?name=${encodeURIComponent(
        name
      )}&dob=${dob}&phone=${encodeURIComponent(phone)}&id=${id}&sid=${sid}&otp=${otp}&isRemovePlusOne=${isRemovePlusOne}`,
      { headers: authHeader() }
    )
  }
  
  fetchPatientWithDependent(name, dob, phone, id) {
    return authApi.get(
      `patient?name=${encodeURIComponent(
        name
      )}&dob=${dob}&phone=${encodeURIComponent(phone)}&id=${id}`,
      { headers: authHeader() }
    )
  }

  fetchPatientForRelation(name, dob, phone, sid, otp, isRemovePlusOne) {
    return authApi.get(
      `patient?name=${encodeURIComponent(
        name
      )}&dob=${dob}&phone=${encodeURIComponent(phone)}&isRelationReq=${false}&sid=${sid}&otp=${otp}&isRemovePlusOne=${isRemovePlusOne}`,
      { headers: authHeader() }
    )
  }
  
  fetchPatientPartner(name, dob, phone, patientId) {
    return authApi.get(`patient/partner-with-dependent?name=${encodeURIComponent(name)}&dob=${dob}&phone=${encodeURIComponent(phone)}&patientId=${patientId}`, { headers: authHeader() })
  }

  getAllPatients() {
    return authApi.get('allpatientlist', { headers: authHeader() })
  }
  fetchAllRelation() {
    return authApi.get(`relation`, { headers: authHeader() })
  }

  fetchPatientByNameOrDob(name, dob) {
    return authApi.get(`patientsbynamedob?name=${name}&dob=${dob}`, {
      headers: authHeader(),
    })
  }
  deletePatientByID(id) {
    return authApi.delete(`patient?patientId=${id}`, {headers: authHeader()})
  }
  
  deletePartnerById(id) {
    return authApi.delete(`patient/partner/${id}`, { headers: authHeader() })
  }
  addPatient(data) {
    console.log(data, "dataaaservicess");
    return authApi.post("patient", data, {headers: authHeader()})
  }
  
  addNewDependent(data) {
    return authApi.post("patient/dependent", data, { headers: authHeader() });
  }
  
  deleteDependent(id) {
    return authApi.delete(`dependent/${id}`, { headers: authHeader() });
  }
 
}

export default new PateintService()
