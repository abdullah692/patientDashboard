import { Form, Modal, Switch, TimePicker } from 'antd'
import { useState } from 'react'
import dayjs from 'dayjs'
// import 'dayjs/locale/en';

const AddScheduleModel = ({
  open,
  close,
  handleScheduleSubmit,
  schedule,
  setSchedule,
  form,
}) => {
  // const [form] = Form.useForm()

  const handleTime = (day, key, value) => {
    let selDay = schedule[day]
    selDay[key] = dayjs(value).format('HH:mm:ss')
    form.setFieldsValue({ [day.toLowerCase() + key]: value })
    setSchedule({ ...schedule, [day]: selDay })
  }
  console.log(schedule, 'scheduleschedule')

  const formattedData = {}

  for (const day in schedule) {
    formattedData[`${day}startTime`] = schedule[day].startTime
      ? dayjs(schedule[day].startTime, 'HH:mm:ss')
      : null
    formattedData[`${day}endTime`] = schedule[day].endTime
      ? dayjs(schedule[day].endTime, 'HH:mm:ss')
      : null
    formattedData[`${day}breakStartTime`] = schedule[day].breakStartTime
      ? dayjs(schedule[day].breakStartTime, 'HH:mm:ss')
      : null
    formattedData[`${day}breakEndTime`] = schedule[day].breakEndTime
      ? dayjs(schedule[day].breakEndTime, 'HH:mm:ss')
      : null
  }

  console.log(formattedData, 'initialFormValue')
  console.log('schedulessss', schedule)
  return (
    <Modal
      width={630}
      open={open}
      title="Set Provider Schedule"
      // onOk={() => handleScheduleSubmit(schedule)}
      onCancel={close}
      footer={[]}
    >
      {/* <div className="flex flex-col gap-4 mt-8"> */}
      <Form
        className="flex flex-col gap-4 mt-8"
        form={form}
        initialValues={formattedData}
        onFinish={(_) => handleScheduleSubmit(schedule)}
      >
        {Object.keys(schedule).map((sch, i) => (
          <EachDaySchedule
            key={i}
            day={sch}
            handleTime={handleTime}
            scheduled={schedule}
            setSchedule={setSchedule}
          />
        ))}

        <div className="flex justify-end mt-8">
          <button
            onClick={close}
            className={`w-[170px] rounded-lg bg-gradient-to-r text-black bg-gray-300/40 hover:bg-gray-400/30 flex items-center justify-center site p-2 `}
          >
            Cancel
          </button>
          <button
            type="submit"
            // onClick={() => handleScheduleSubmit(schedule)}
            className={`ml-4 w-[170px] rounded-lg bg-gradient-to-r text-white from-sea-green to-dashboard-green hover:from-dashboard-green hover:to-[#10967f] flex items-center justify-center site p-2 `}
          >
            Submit
          </button>
        </div>
      </Form>
    </Modal>
  )
}

const EachDaySchedule = ({ day, handleTime, scheduled, setSchedule }) => {
  const [checked, setChecked] = useState(scheduled[day].isCheck)
  const [isBreak, setIsBreak] = useState(
    (scheduled[day]['breakStartTime'] && scheduled[day]['breakEndTime']) ||
      false
  )
  // isCheck={schedule[sch].isCheck} startTime={schedule[sch].startTime} endTime={schedule[sch].endTime}

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
          isCheck: checked,
          breakStartTime: null,
          breakEndTime: null,
        },
      })
    }
    setIsBreak(isBreak)
  }

  console.log(scheduled[day], 'scheduledddddd')
  // console.log('checkedsssssss',checked);
  console.log(checked, 'checkedddddd')

  return (
    <div className="border-b border-gray-400/40 pb-2">
      <div className="flex items-center gap-4">
        <p className="text-base font-semibold text-gray-400 mr-8 w-[100px]">
          {day.charAt(0).toUpperCase() + day.slice(1)}
        </p>
        <Switch
          className=" mr-8"
          size="small"
          defaultChecked={checked}
          onChange={(checked, event) => handleChecked(checked, event)}
        />
        {checked && (
          <div className="flex items-center">
            <Form.Item
              style={{ marginBottom: 0 }}
              name={day.toLowerCase() + 'startTime'}
              rules={[{ required: checked, message: 'Please select time' }]}
            >
              <TimePicker
                size={'middle'}
                style={{ width: '160px' }}
                defaultValue={
                  scheduled[day]['startTime']
                    ? dayjs(scheduled[day]['startTime'], 'HH:mm:ss')
                    : null
                }
                // value={scheduled["startTime"] ? dayjs(scheduled["startTime"], 'HH:mm:ss') : null}
                onChange={(time) =>
                  handleTime(day.toLowerCase(), 'startTime', time)
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
              name={day.toLowerCase() + 'endTime'}
              rules={[{ required: checked, message: 'Please select time' }]}
            >
              <TimePicker
                size={'middle'}
                style={{ width: '160px' }}
                defaultValue={
                  scheduled[day]['endTime']
                    ? dayjs(scheduled[day]['endTime'], 'HH:mm:ss')
                    : null
                }
                // value={scheduled["endTime"] ? dayjs(scheduled["endTime"]) : null}
                onChange={(time) =>
                  handleTime(day.toLowerCase(), 'endTime', time)
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
      {checked && (
        <div className="flex items-center gap-4 mt-2">
          <p className="text-base font-semibold text-gray-400 mr-8 w-[100px]">
            Break Time
          </p>
          <Switch
            style={{ backgroundColor: isBreak ? 'green' : 'gray' }}
            className=" mr-8"
            size="small"
            defaultChecked={isBreak}
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

export default AddScheduleModel
