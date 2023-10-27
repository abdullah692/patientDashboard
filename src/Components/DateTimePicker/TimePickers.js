import { Form, TimePicker } from "antd";

const TimePickers = ({ callback, _for, req_msg, width="180px", size="large", maxWidth="180px", defaultValue="", required=true, height="auto" }) => {
    <div className="px-4 mb-2">
        <p className="text-[#BABABA] ">{req_msg}</p>
        <Form.Item 
            style={{ marginBottom: 0 }}
            name={_for}
        >
            <TimePicker
                size={size}
                style={{ width, maxWidth }}
                defaultValue={defaultValue}
                onChange={(time) => callback(_for, time)}
                minuteStep={5}
                secondStep={60}
                hourStep={1}
                use12Hours
                format="h:mm a"
            />
        </Form.Item>
    </div>
}


export default TimePickers;