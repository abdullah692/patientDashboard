import axios from 'axios'
import authHeader from './authHeader'
import authApi from '../Utils/axiosconfig'

const URL = process.env.REACT_APP_BACKEND_API_URL

class AppointmentService {
  getAllAppointment() {
    console.log('serviceeeee')
    return authApi.get('appointment', {
      headers: authHeader(),
    })
  }
  getAppointmentById(id) {
    console.log('serviceeeee')
    return authApi.get(`appointment/${id}`, {
      headers: authHeader(),
    })
  }
  deleteAppointment(apt_id) {
    return authApi.delete(`appointment/${apt_id}`, {
      headers: authHeader(),
    })
  }

  getAppointmentTypes(Docid) {
    return authApi.get(`booking/appointmenttypes/${Docid}`, {
      headers: authHeader(),
    })
  }

  appointmentBooked(data) {
    return authApi.post(`appointment`, data, { headers: authHeader() })
  }

  getAvailibility(Docid) {
    return authApi.get(`booking/availability/${Docid}`, {
      headers: authHeader(),
    })
  }

  updatedAptPriority(data) {
    return authApi.put(
      `appointment/priority/${data?.apt_id}`,
      {
        priority: data.resourceId[0],
      },
      { headers: authHeader() }
    )
  }
  updateApmntById(data) {
    return authApi.put(
      process.env.REACT_APP_BACKEND_API_URL +
        `/api/appointment/update/${data?.apmnt_id}`,
      data,
      { headers: authHeader() }
    )
  }
  getAppointmentHistory(id){
    return authApi.get(`appointment/history?patientId=${id}`, {"headers": authHeader()})
  }
}

export default new AppointmentService()
