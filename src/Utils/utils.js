

function generateDataFromToday() {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  const today = new Date();
  const todayDay = today.getDate();
  const todayDayOfWeek = daysOfWeek[today.getDay()];
  const data = [];
  for (let i = 0; i < 7; i++) {
    const nextDay = new Date(today);
    nextDay.setDate(todayDay + i);
    const nextDayOfWeek = daysOfWeek[nextDay.getDay()];

    // set hours and amOrPm based on time of day
    let hours = 0;
    let amOrPm = "AM";
    if (i % 2 !== 0) {
      hours = 12;
      amOrPm = "PM";
    }

    const nextData = {
      key: (i + 1).toString(),
      day: nextDay.getDate().toString(),
      dayOfWeek: nextDayOfWeek,
      date: nextDay.toISOString().split("T")[0],
      time: `${hours}:00 ${amOrPm}` // add time property
    };
    data.push(nextData);
  }
  return data;
}
export function convertData(data) {
  return data?.map((item, index) => {
    const timestamp = item?.time;
    const date = new Date(timestamp);
    const formattedTime = date?.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return {
      key: index,
      name: `${item?.name}`, // this field is hard-coded as it is not available
      time: `${item?.time?.split("T")[0]} ${formattedTime}`,
      dentist: item?.dentist,
    };
  });
}

export function setAppoinmentData(practice){
  let data = [];
  for (let i = 0; i < practice.length; i++) {
    for (let j = 0; j < practice[i].Dentists.length; j++) {
      for (let k = 0; k < practice[i].Dentists[j].Availabilities.length; k++) {
        for (let l = 0; l < practice[i].Dentists[j].Availabilities[k].Appointments.length; l++) {
          const appointment = practice[i].Dentists[j].Availabilities[k].Appointments[l];
          const patient = appointment.Patient;
  
          patient.time = appointment.start_time;
          patient.start_time = appointment.start_time;
          patient.end_time = appointment.end_time;
          patient.status = appointment.status;
          patient.dentist = practice[i].Dentists[j]?.name;
          patient.appointment_type = appointment.AppointmentType?.type;
          patient.apt_id = appointment.id
          patient.priority = appointment.priority
  
          data.push(patient);
        }
      }
    }
  }
  return data;
}

export function generateUniqueKey(){
  const one = Math.floor(Math.random() * (9999999 - 1111111 + 1)) + 1111111
  const two = Math.floor(Math.random() * (9999999 - 1111111 + 1)) + 1111111
  const three = Math.floor(Math.random() * (9999999 - 1111111 + 1)) + 1111111
  return one + "-" + two + "-" + three
}

export const statusList = ["booked", "confirmed", "cancelled", "check in", "no show"];

export const phone_prefix = process.env.REACT_APP_PHONE_NUMBER_PREFIX;

export default generateDataFromToday;
