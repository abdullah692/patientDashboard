import authApi from "../Utils/axiosconfig";
import authHeader from "./authHeader";

class InsuranceService {
  getAllInsurance() {
    return authApi.get("/booking/insurence",  { headers: authHeader() });
  }
}

export default new InsuranceService();
