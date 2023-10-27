
import { TimePicker } from 'antd';
import dayjs from 'dayjs';

function DurationPicker(props) {
  const { value, onChange, width, height } = props;

  function convertToHMS(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const seconds = 0;
    return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  const onDurationChange = (duration) => {
    // Get the difference between the two dayjs objects in minutes
    const minutes = duration.minute() + duration.hour() * 60;
    
    // console.log(convertToHMS(minutes), "minutes");
    console.log(minutes, "minutes");
    if(minutes == 0){
      onChange(value);
      return;
    }

    // Call onChange with the number of minutes
    onChange(convertToHMS(minutes));
  };

  const onOpenChange = (open) => {
    if (!open && !value) {
      // Reset value to 10 minutes when the picker is closed and no value is selected
      onChange(value);
    }
  };

  // Check if the value is in the format "hh:mm:ss", and convert it to minutes
  const defaultTime = dayjs(value, 'HH:mm:ss');

  return (
    <>
      <TimePicker
        style={{ width, height }}
        defaultValue={defaultTime}
        showNow={false}
        value={defaultTime ? defaultTime : undefined}
        format="HH [h] mm [min]"
        minuteStep={5}
        onChange={onDurationChange}
        onOpenChange={onOpenChange}
        clearIcon={null}
      />
    </>
  );
}

export default DurationPicker;












// import { TimePicker } from 'antd';
// import dayjs from 'dayjs';

// function DurationPicker(props) {
//   const { value, onChange } = props;

//   const onDurationChange = (duration) => {
//     // Get current time as a dayjs object
//     const currentTime = dayjs();

//     // Set the time of the dayjs object to the selected duration
//     const selectedTime = currentTime.set('hour', 0).set('minute', 0).set('second', 0).add(duration.hour(), 'hour').add(duration.minute(), 'minute');

//     // Get the difference between the two dayjs objects in minutes
//     // const minutes = selectedTime.diff(currentTime, 'minute');
//     const minutes = duration.minute() + duration.hour() * 60;

//     // Call onChange with the number of minutes
//     console.log(minutes, 'minutess');
//     onChange(minutes.toString());
//   };

//   const onOpenChange = (open) => {
//     if (!open && !value) {
//       // Reset value to 10 minutes when the picker is closed and no value is selected
//       onChange("10");
//     }
//   };

//   return (
//     <TimePicker
//       value={value ? dayjs().startOf('day').add(value, 'minute') : undefined}
//       format="mm[min]"
//       minuteStep={5}
//       onChange={onDurationChange}
//       onOpenChange={onOpenChange}
//       clearIcon={null}
//     />
//   );
// }

// export default DurationPicker;