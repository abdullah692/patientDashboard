import axios from "axios";
import { NotificationWithIcon } from "./Notification";
// import persistor from "./../Store"

const BASEURL = `${process.env.REACT_APP_BACKEND_API_URL}/api/`;

const authApi = axios.create({
  baseURL: BASEURL,
  // withCredentials: true,
});

// authApi.defaults.headers.common["Content-Type"] = "application/json"

authApi.interceptors.response.use(
  (response) => {
    // handle success
    console.log(response, "response from axios");
    return response;
  },
  (error) => {
    // handle error
    if (error.response.status == 403) {
      // network error
      NotificationWithIcon("error", "No token provided");
      localStorage.removeItem("persist:root");
      localStorage.removeItem("user");
      window.location.href = "/";

      console.log(error, "network error"); 
    } else if (error.response.status == 406) {
      console.log(error.response.status, "statusserrror")
      NotificationWithIcon("error", "Session Expired! Please Login Again");
      localStorage.removeItem("persist:root");
      localStorage.removeItem("user");
      window.location.href = "/";
    } else {
      // localStorage.removeItem("user")
      console.log(error.response.data, "errorrupadered");
      console.log(error.response.status);
      console.log(error.response.headers);
    }

    return Promise.reject(error);
  }
);

export default authApi;
