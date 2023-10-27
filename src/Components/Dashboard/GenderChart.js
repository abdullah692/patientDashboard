import { React, useEffect, useState } from "react";
// import { Doughnut } from "react-chartjs-2";
import Chart from "react-apexcharts";
// import ChartAnnotation from "chartjs-plugin-annotation";
import { useDispatch, useSelector } from "react-redux";
import { genderDataSelector, getGenderChartData } from "../../Slices/Dashboard.slice";
// import 'chart.js/dist/Chart.min.css';

const GenderChart = () => {
  const dispatch = useDispatch();
  const data = useSelector(genderDataSelector)
  const [selectedValue, setSelectedValue] = useState("month");
  const [patientData, setPatientData] = useState([data?.maleMonth,data?.femaleMonth]);
  
  console.log(data,"FEMAL")
  function handleDropdownChange(event) {
    setSelectedValue(event.target.value);
    // console.log("selectedValue Data", selectedValue);
    if (event.target.value === "month") {
      setPatientData([data?.maleMonth,data?.femaleMonth]);
    } else if (event.target.value === "week") {
      setPatientData([data?.maleWeek,data?.femaleWeek]);
    }
  }
  useEffect(() => {
    dispatch(getGenderChartData()).unwrap().then(x => {
      setPatientData([x?.maleMonth,x?.femaleMonth]);
    })
  }, [])
  return (
    <>
      <div className="flex justify-between text-black mb-4 text-[14px]">
        <div>
          <p className="text-[16px] text-[#464D59] ml-4  font-medium">
            Patient by Gender
          </p>
        </div>

        <select
          value={selectedValue}
          className="bg-transparent text-[#464D59] text-[12px]"
          onChange={handleDropdownChange}
        >
          <option className="text-[#464D59] " value="month">
            This Month
          </option>
          <option className="text-[#464D59] " value="week">
            This Week
          </option>
          {/* <option className="text-[#464D59] " value="week">
            Today
          </option> */}
        </select>
      </div>

      <div className="h-[190px]  flex justify-center ">
        <Chart
          type="donut"
          width={320}
          // height={550}
          series={patientData}
          options={{
            labels: ["Male", "Female"],
            colors: ["rgba(40, 38, 109, 1)", "rgba(94, 204, 185, 1)"],
            plotOptions: {
              pie: {
                fontSize: 200,
                donut: {
                  labels: {
                    show: true,
                    total: {
                      show: true,
                      fontSize: 20,
                    },
                  },
                },
              },
            },
            dataLabels: {
              colors: "black",
            },
          }}
        />
      </div>
      {/* <div className="h-[190px]  flex justify-center ">
        <Doughnut data={data} options={options} plugins={{textCenter}} />
      </div> */}
    </>
  );
};

export default GenderChart;
