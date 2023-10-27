import { React, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
// import {ResponsiveContainer} from 'react-chartjs-2-responsive-wrapper'
// import { Chart as chartjs } from "chart.js/auto";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useDispatch, useSelector } from "react-redux";
import {
  getPatientsChartData, patientsChatDataSelector
} from "../../Slices/Dashboard.slice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const consturctData=(state)=>{
  return {
    labels:state?.map(x=>{
      return x.date.split("-")[2]
    }),
    color: "#000",
    // height: 500,
    datasets: [
      {
        label: "Patient Data",
        data: state.map(x=>x.patientCount),
        borderColor: "#5eccb973",
        tension: 0.7,
        pointStyle: "circle",
        pointBackgroundColor: "#5ECCB9",
        pointHoverRadius: 8,
      },
    ],
  }
  }
const PatientChart = () => {
  const [selectedValue, setSelectedValue] = useState("option1");
  const dispatch = useDispatch();
  const data = useSelector(patientsChatDataSelector)
  console.log(data,"ADDADADADALSDMA")
  //   const [updateData, setUpdateData] = useState([45, 55, 52, 65, 62, 75, 67]);
  const [patientData, setPatientData] = useState(consturctData(data));

  const options = {
    // maintainAspectRatio: false,
    // aspectRatio:2.5,
    scales: {
      y: {
        display: false,
      },
      x: {
        ticks: {
          color: "#fff",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  console.log({patientData});

  function getCurrentWeekData(fullMonthData) {
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1);
    const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (7 - today.getDay()));
  
    const currentWeekData = fullMonthData.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startOfWeek && itemDate <= endOfWeek;
    });
  
    return currentWeekData;
  }

  function handleDropdownChange(event) {
    setSelectedValue(event.target.value);
    console.log("selectedValue Data", selectedValue);
    // }
    //   // Update the data in the chart
    // if (chartRef.current) {
    if (event.target.value === "option1") {
      setPatientData(consturctData(data));
    } else if (event.target.value === "option2") {
      let weekData=getCurrentWeekData(data)
      console.log(weekData,"WEEEKEEKEKEK")
      setPatientData(consturctData(weekData));
    }
    // }
  }


  useEffect(() => {
    dispatch(getPatientsChartData())
  }, [])
  
useEffect(() => {
  if(data.length){
    setPatientData(consturctData(data))
  }
}, [data.length])

  return (
    <>
      <div className="flex justify-between text-white mb-4 text-[14px] mt-[-10px]">
        <div>
        <p className="text-[20px] font-semibold">{data.length}
        </p>
        <p>Patients</p>
        </div>

        <select
          value={selectedValue}
          className="bg-transparent  text-[12px]"
          onChange={handleDropdownChange}
        >
          <option className="text-black" value="option1">
            This Month
          </option>
          <option className="text-black" value="option2">
          This Week
          </option>
          {/* <option className="text-black" value="option2">
          Today
          </option> */}
        </select>
      </div>
      <Line data={patientData} options={options} className="mt-[-50px] ml-[120px]"/>
      {/* <Doughnut data={patientData}/> */}
    </>
  );
};

export default PatientChart;
