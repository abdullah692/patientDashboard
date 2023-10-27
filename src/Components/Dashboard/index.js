import React, { useState, useRef, useEffect } from "react";
import PatientChart from "./PatientChart";
import { RxCalendar } from "react-icons/rx";
import { TodaySchedule } from "./data";
import shield from "../../assets/images/shield.png";
import AnalyticChart from "./AnalyticChart";
import GenderChart from "./GenderChart";
import VistsTab from "./VisitsTabs";
import { useDispatch, useSelector } from "react-redux";
import { userdetail } from "../../Slices/Auth.slice";
import { getAllAppointments, getAllApt } from "../../Slices/Dashboard.slice";
import { convertData } from "../../Utils/utils";

const Dashboard = () => {
  var date = new Date(); // Oct 16, 2022
  var options = { month: "short", day: "numeric", year: "numeric" };
  var dateString = date.toLocaleDateString("en-US", options);
  const dispatch = useDispatch()
  const [render, setRender] = useState(false);
  const appointments = useSelector(getAllApt);
  
  

  useEffect(() => {
    (async() => {
       dispatch(getAllAppointments());
      // const interval = setInterval(() => {
        // dispatch(getAllAppointments());
      // }, 300000);
      
      
      // return () => clearInterval(interval);
    })().then(x => {
      setRender(true);
      console.log(x, "Xxxxxxxxxxxxxxxxxxx");
    }).catch(X => {
      console.log("errorrrrrr");
    });
  }, [render]);

  function greet() {
    const now = new Date();
    const currentHour = now.getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return "Good morning!";
    } else if (currentHour >= 12 && currentHour < 18) {
      return "Good afternoon!";
    } else {
      return "Good evening!";
    }
  }

  const data = greet()
  const user = useSelector(userdetail);
  console.log(data, "userrrrrrrrrrr");
  return (
    <div className=" text-white h-[calc(100vh-96px)] overflow-auto ">
      <div className="max-w-[130vw] ">
        <div className="grid grid-cols-4 pt-2 pb-10 px-6 gap-6">
          <div className="col-span-2 rounded-[10px]">
            <div
              className="grid grid-cols-2 rounded-[10px]
            bg-gradient-to-r   from-sea-green to-dashboard-green "
            >
              <div className="p-10 mt-20">
                <p className="text-[16px]">Hey, {data}</p>
                <p className="text-[30px] font-bold">{user.name}</p>
              </div>

              <div className="border-gray-400  pr-12">
                <div className="flex p-4 mt-4">
                  <RxCalendar size={23} />
                  <p className="text-[18px] font-bold ml-3 font-sans">
                    Today Schedule
                  </p>
                </div>
                {TodaySchedule.map((item) => {
                  return (
                    <>
                      {item.id === 3 ? (
                        <>
                          <div className="flex m-4 ">
                            <p>{item.title}</p>
                            <p className="ml-[100px] text-[24px] font-bold mt-[-5px]">
                              {/* {item.patientNo} */}0
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex m-4 border-b-2 border-[#ffffff66] ">
                            <p>{item.title}</p>
                            <p className="ml-[100px] text-[24px] font-bold mt-[-5px]">
                              {/* {item.patientNo} */}0
                            </p>
                          </div>
                        </>
                      )}
                    </>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <div
              className="p-3 rounded-[10px]  
          bg-gradient-to-r  from-light-blue to-regal-blue h-[235px]"
            >
              <PatientChart />
            </div>
          </div>

         
          <div className="relative col-span-4  rounded-[10px] bg-white h-[460px] ">
            <div className="grid grid-cols-1">
              <div className="">
                <VistsTab />
              </div>
            </div>
            {/* </div> */}
          </div>
          {/* </div> */}
        </div>
      </div>

      <div className="max-w-[130vw] ">
        <div className="grid grid-cols-4 pt-2 pb-10 px-6 gap-6">
          <div className="text-black rounded-[10px] bg-white p-4">
            <GenderChart />
          </div>

          <div className="col-span-2 rounded-[10px]">
            <div className="bg-white p-6 rounded-[10px]">
              <AnalyticChart className="ml-10" />
            </div>
          </div>

          <div className="col-span-1">
            <div
              className="grid grid-cols-2  px-4 py-3  rounded-[10px] 
             bg-gradient-to-r   from-sea-green to-dashboard-green "
            >
              <div className="py-6  text-white">
                <p className="text-[12px] font-medium">Learn more about </p>
                <p className="m-0 text-[30px]  font-semibold">Genesis</p>
                <p className="!mt-[-10px] text-[30px] font-semibold">Health</p>
                <p className="text-[12px]">
                  Take a quick tour and learn more about our features
                </p>
                <div className="text-center mt-6">
                  <button className="border-2 border-white px-5 py-1 rounded-[20px]">
                    Take a Tour
                  </button>
                </div>
              </div>
              <div className="mt-[45px]">
                <div>
                  <img src={shield} alt="shield" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-[130vw] ">
        <div className="grid grid-cols-4 py-6 px-12 gap-6"></div>
      </div>
    </div>
  );
};

export default Dashboard;
