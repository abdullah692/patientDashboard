import React, { useEffect, useState } from 'react'
import { Line } from "react-chartjs-2";
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
// import { Chart as chartjs } from "chart.js/auto";
import {
  getPatientsChartData,
  patientsChatDataSelector,
} from '../../Slices/Dashboard.slice'
import { useDispatch, useSelector } from 'react-redux'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


const constructData = (state) => {
  return {
    labels: state?.map((x) => {
      return x.date.split('-')[2]
    }),
    color: '#000',
    // height: 500,
    datasets: [
      {
        label: 'Patient Data',
        data: state.map((x) => x.patientCount),
        borderColor: '#5eccb973',
        tension: 0.7,
        pointStyle: 'circle',
        pointBackgroundColor: '#5ECCB9',
        pointHoverRadius: 8,
      },
    ],
  }
}
const AnalyticChart = () => {
  const [selectedValue, setSelectedValue] = useState('option1')
  const dispatch = useDispatch()
  const data = useSelector(patientsChatDataSelector)
  console.log(data, 'ADDADADADALSDMA')
  //   const [updateData, setUpdateData] = useState([45, 55, 52, 65, 62, 75, 67]);
  const [patientData, setPatientData] = useState(constructData(data))

  // const options = {
  //   scales: {
  //     y: {
  //       type: 'linear', // or 'logarithmic' for logarithmic scale
  //     },
  //   },
  // };
  const options = {
    // aspectRatio: 2.2,
    maintainAspectRatio: false,
    scales: {
      y: {
        display: true,
      },
      x: {
        // ticks: {
        //   color: "black",
        // },
        display: false,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  }

  function getCurrentWeekData(fullMonthData) {
    const today = new Date()
    const startOfWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay() + 1
    )
    const endOfWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + (7 - today.getDay())
    )

    const currentWeekData = fullMonthData.filter((item) => {
      const itemDate = new Date(item.date)
      return itemDate >= startOfWeek && itemDate <= endOfWeek
    })

    return currentWeekData
  }
  function handleDropdownChange(event) {
    setSelectedValue(event.target.value)
    // console.log("selectedValue Data", selectedValue);
    // }
    //   // Update the data in the chart
    // if (chartRef.current) {
    if (event.target.value === 'option1') {
      setPatientData(constructData(data))
    } else if (event.target.value === 'option2') {
      let weekData = getCurrentWeekData(data)
      console.log(weekData, 'WEEEKEEKEKEK')
      setPatientData(constructData(weekData))
    }
    // }
  }

  useEffect(() => {
    dispatch(getPatientsChartData())
  }, [])

  useEffect(() => {
    if (data?.length) {
      setPatientData(constructData(data))
    }
  }, [data?.length])

  return (
    <>
      <div className="flex justify-between text-black mb-4 text-[14px]">
        <div>
          <p className="text-[16px] text-[#464D59] ml-4  font-medium">
            Analytics
          </p>
        </div>

        <select
          value={selectedValue}
          className="bg-transparent text-[#464D59] text-[12px]"
          onChange={handleDropdownChange}
        >
          <option className="text-[#464D59] " value="option1">
            This Month
          </option>
          <option className="text-[#464D59] " value="option2">
            This Week
          </option>
          {/* <option className="text-[#464D59] " value="option2">
            Today
          </option> */}
        </select>
      </div>
      <div className="h-[190px]  flex justify-center mt-4">
        <Line data={patientData} options={options} />
      </div>
    </>
  )
}

export default AnalyticChart
