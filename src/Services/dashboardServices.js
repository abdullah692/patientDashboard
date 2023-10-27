import axios from "axios";
import authApi from "../Utils/axiosconfig";
import authHeader from "./authHeader";
const BASEURL = `${process.env.REACT_APP_BACKEND_API_URL}/api/`;

class DashboardServices {
  //   getAllAppointments() {
  //     return axios.get(BASEURL + "appointment/dp-detail", {
  //       withCredentials: true,
  //     });
  //   }
  //   UpdateAppointment(data) {
  //     console.log(data, "servicepayload");
  //     return axios.put(BASEURL + "appointment/priority/" + data.apt_id, {
  //       priority: data.resourceId[0]
  //     }, {
  //       withCredentials: true,
  //     });
  //   }

  getPatientsChartAdata() {
    return authApi.get("appointment/graphdata", { headers: authHeader() });
  }

  getGenderChartdata() {
    return authApi.get("appointment/graphdatagender", {
      headers: authHeader(),
    });
  }
}

export default new DashboardServices();
