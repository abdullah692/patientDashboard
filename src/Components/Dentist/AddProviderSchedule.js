import { Form, Modal, Switch, TimePicker } from 'antd'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/en'
import { NotificationWithIcon } from '../../Utils/Notification'
import { useRef } from 'react'

const AddProviderSchedule = ({
  handleScheduleSubmit,
  schedule,
  setSchedule,
}) => {
  const [form] = Form.useForm()
  const [formattedData, setFormattedData] = useState({})
  const timePickerRef = useRef();
  
  const handleTime = (day, key, value) => {
    let selDay = schedule[day]
    // 
    console.log('scheduleDaysssssssssssssss',selDay);
    console.log('scheduleDayVlauessssss',value, day, key);
    selDay[key] = dayjs(value).format('HH:mm:ss')
    console.log('scheduleDayVlaue',selDay[key]);
    debugger
    if(selDay?.startTime === selDay?.endTime)
    {
      const newVal = { ...selDay, endTime: '' }
      NotificationWithIcon('error','You cannot select the same time');
      form.setFieldsValue({ [day.toLowerCase() + key]: null })
      setSchedule({ ...schedule, [day]: newVal })
    }
    // 
    else if (selDay?.breakStartTime !== undefined && selDay?.breakEndTime !== undefined && selDay?.breakStartTime === selDay?.breakEndTime)
    {
      const newVal = { ...selDay, breakEndTime: '' }
      console.log('breakTimeNewVal',newVal);
      NotificationWithIcon('error','You cannot select the same time');
      form.setFieldsValue({ [day.toLowerCase() + key]: null })
      setSchedule({ ...schedule, [day]: newVal })
    }
    else{
      selDay[key] = dayjs(value).format('HH:mm:ss')
      form.setFieldsValue({ [day.toLowerCase() + key]: value })
      setSchedule({ ...schedule, [day]: selDay })
    }
  }

 
  console.log(schedule, 'scheduleschedule')
  console.log(formattedData, 'initialFormValue')
  console.log('schedulesssssssssssss', schedule)
  const scheduleKeys = Object.keys(schedule)
  const scheduleItems = []

  for (let i = 0; i < scheduleKeys.length; i++) {
    const sch = scheduleKeys[i]
    console.log("lslslslslslslls",schedule[sch]?.isCheck)
    scheduleItems.push(
      <EachDaySchedule
        key={i}
        day={sch}
        handleTime={handleTime}
        scheduled={schedule}
        setSchedule={setSchedule}
        ischecked={schedule[sch]?.isCheck}
        isbreak={(schedule[sch]?.breakStartTime && schedule[sch]?.breakEndTime) ? true : false}
      />
    )
    console.log(schedule[sch]?.breakStartTime && schedule[sch]?.breakEndTime, 'break tiemscheduleItems')
  }
  console.log(scheduleItems, 'scheduleItems')
  return (
    // <Modal
    //     width={630}
    //     open={open}
    //     title="Set Provider Schedule"
    //     // onOk={() => handleScheduleSubmit(schedule)}
    //     onCancel={close}
    //     footer={[]}
    //   >

    <>
      <div className="mx-5 mb-10">
        <Form
          className="flex flex-col gap-4 mt-8"
          form={form}
          initialValues={formattedData}
          onFinish={(_) => handleScheduleSubmit(schedule)}
        >
          {scheduleItems}
        </Form>
      </div>
    </>
  )
}

const EachDaySchedule = ({
  day,
  handleTime,
  scheduled,
  setSchedule,
  ischecked,
  isbreak,
  handleSelectTime,
  disabledPeriods,
  timePickerRef,
  timePickerVisible
}) => {
  console.log(ischecked, 'scheduled[day]?.isCheck', day)
  const [checked, setChecked] = useState(false);
  const [isBreak, setIsBreak] = useState(
    (scheduled[day]['breakStartTime'] && scheduled[day]['breakEndTime']) ? true : false
  );
  const [isBreakStart,setIsBreakStart]=useState(scheduled[day]['breakStartTime'] || '') ; 
  // isCheck={schedule[sch].isCheck} startTime={schedule[sch].startTime} endTime={schedule[sch].endTime}
  console.log('scheduledaaaaaaaaaaaaaaaaaaaaaa', scheduled)
  console.log('isbreakaaaaaaaaaaaaa', isBreakStart)
  console.log('scheduledaaaaaaaaaaaaaaaaaaaaaaisbreak', scheduled[day]['breakStartTime'] )
  console.log('scheduledaaaaaaaaaaaaaaaaaaaaaaisbreakendTime', scheduled[day]['breakEndTime'])


  const isTimeDisabled = (day, key, value) => {
    const selDay = scheduled[day];
    const startTime = selDay.startTime;
    const endTime = selDay.endTime;
    return value && startTime === endTime && startTime === value.format('HH:mm:ss');
  };

 
    useEffect(() => {
      setChecked(ischecked);
      console.log(isbreak,'isBreakisBreakisBreak');
    }, [])
    
    useEffect(()=>{
      setIsBreak(isbreak);
    }, [isbreak])

  console.log('checkedsssssss', checked)
  const handleChecked = (checked, event) => {
    console.log(checked, event, 'checked, event')
    setChecked(checked)
    setSchedule({
      ...scheduled,
      [day]: { ...scheduled[day], isCheck: checked },
    })
  }

  const handleBreakTime = (isBreak) => {
    if (!isBreak) {
      setSchedule({
        ...scheduled,
        [day]: {
          ...scheduled[day],
          isCheck: ischecked,
          breakStartTime: null,
          breakEndTime: null,
        },
      })
    }
    setIsBreak(isBreak)
  }


  console.log(isBreak, isbreak, "isBreakisBreakisBreak",scheduled[day]);
  console.log(scheduled[day], 'scheduledddddd')
  console.log(checked, 'checkedddddd')
  console.log(ischecked, 'ischeckeddddddaaaaaaaaaaaa')
  const days = Object.keys(scheduled);
  return (
    <div className="border-b border-gray-400/40 pb-2">
      <div className="flex items-center gap-4">
        <p className="text-base font-semibold text-gray-400 mr-8 w-[100px]">
          {day.charAt(0).toUpperCase() + day.slice(1)}
        </p>
        <Switch
          className=" mr-8"
          size="small"
          // defaultChecked={ischecked}
          checked={ischecked}
          onChange={(checked, event) => handleChecked(checked, event)}
        />
        {ischecked && (
          <div className="flex items-center">
            <Form.Item
              style={{ marginBottom: 0 }}
              name={day.toLowerCase() + 'startTime'}
              rules={[{ required: ischecked, message: 'Please select time' }]}
            >
              <TimePicker
                size={'middle'}
                style={{ width: '160px' }}
                // disabledHours={() => disabledHours(day)}
                // disabledMinutes={(hour) => disabledMinutes(day, hour)}
                defaultValue={
                  scheduled[day]['startTime']
                    ? dayjs(scheduled[day]['startTime'], 'HH:mm:ss')
                    : null
                }
                
                // ref={timePickerRef}
                // open={timePickerVisible}
                // value={scheduled["startTime"] ? dayjs(scheduled["startTime"], 'HH:mm:ss') : null}
                onChange={(time) =>
                  handleTime(day.toLowerCase(), 'startTime', time)
                }
                // onSelect={(time) =>
                //   handleSelectTime(day.toLowerCase(), 'startTime', time)}
                // disabled={isTimeDisabled(day, 'startTime', scheduled[day].startTime)}
                minuteStep={5}
                secondStep={60}
                hourStep={1}
                // disabledPeriods={disabledPeriods}
                use12Hours
                format="h:mm a"
              />
            </Form.Item>
            <p className="mx-3">to</p>
            <Form.Item
              style={{ marginBottom: 0 }}
              name={day.toLowerCase() + 'endTime'}
              rules={[{ required: ischecked, message: 'Please select time' }]}
            >
              <TimePicker
                size={'middle'}
                style={{ width: '160px' }}
                // disabledHours={() => disabledHours(day)}
                // disabledMinutes={(hour) => disabledMinutes(day, hour)}
                // ref={timePickerRef}
                // open={timePickerVisible}
                defaultValue={
                  scheduled[day]['endTime']
                    ? dayjs(scheduled[day]['endTime'], 'HH:mm:ss')
                    : null
                }
                // value={scheduled["endTime"] ? dayjs(scheduled["endTime"]) : null}
                onChange={(time) =>
                  handleTime(day.toLowerCase(), 'endTime', time)
                }
                // onSelect={(time) =>
                //   handleSelectTime(day.toLowerCase(), 'endTime', time)}
                // disabled={isTimeDisabled(day, 'endTime', scheduled[day].endTime)}
                minuteStep={5}
                secondStep={60}
                hourStep={1}
                use12Hours
                format="h:mm a"
              />
            </Form.Item>
          </div>
        )}
      </div>
      {ischecked && (
        <div className="flex items-center gap-4 mt-2">
          <p className="text-base font-semibold text-gray-400 mr-8 w-[100px]">
            Break Time
          </p>
          <Switch
            style={{ backgroundColor: isBreak ? '#5ECCB9' : 'gray' }}
            className=" mr-8"
            size="small"
            // defaultChecked={isBreak}
            checked={isBreak}
            onChange={(checked, event) => handleBreakTime(checked)}
          />
          {isBreak && (
            <div className="flex items-center">
              <Form.Item
                style={{ marginBottom: 0 }}
                name={day.toLowerCase() + 'breakStartTime'}
                rules={[{ required: isBreak, message: 'Please select time' }]}
              >
                <TimePicker
                  size={'middle'}
                  style={{ width: '160px' }}
                  defaultValue={
                    scheduled[day]['breakStartTime']
                      ? dayjs(scheduled[day]['breakStartTime'], 'HH:mm:ss')
                      : null
                  }
                  // value={scheduled["breakStartTime"] ? dayjs(scheduled["breakStartTime"], 'HH:mm:ss') : null}
                  onChange={(time) =>
                    handleTime(day.toLowerCase(), 'breakStartTime', time)
                  }
                  
                  minuteStep={5}
                  secondStep={60}
                  hourStep={1}
                  use12Hours
                  format="h:mm a"
                />
              </Form.Item>
              <p className="mx-3">to</p>
              <Form.Item
                style={{ marginBottom: 0 }}
                name={day.toLowerCase() + 'breakEndTime'}
                rules={[{ required: isBreak, message: 'Please select time' }]}
              >
                <TimePicker
                  size={'middle'}
                  style={{ width: '160px' }}
                  defaultValue={
                    scheduled[day]['breakEndTime']
                      ? dayjs(scheduled[day]['breakEndTime'], 'HH:mm:ss')
                      : null
                  }
                  // value={scheduled["breakEndTime"] ? dayjs(scheduled["breakEndTime"], 'HH:mm:ss') : null}
                  onChange={(time) =>
                    handleTime(day.toLowerCase(), 'breakEndTime', time)
                  }
                  minuteStep={5}
                  secondStep={60}
                  hourStep={1}
                  use12Hours
                  format="h:mm a"
                />
              </Form.Item>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AddProviderSchedule
