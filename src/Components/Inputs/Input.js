import { Form, Input } from "antd";
import { UserOutlined, MobileOutlined, } from "@ant-design/icons";

const Inputs = ({ callback, _for, req_msg, value, minWidth= "350px", maxWidth= "430px", type="text", outline=<UserOutlined/> }) => {
  return (
    <div className="">
      <p className="text-gray-400 mb-1">{req_msg}</p>
      <Form.Item
        style={{ marginBottom: 0 }}
        name={_for}
        rules={[
          {
            required: true,
            message: "Please Enter " + req_msg || _for,
          },
          {
            type: type,
            message: `Please enter a valid ${type}`
          }
        ]}
      >
        <Input
          type={type}
          size="large"
          name={_for}
          value={value}
          onChange={callback}
          placeholder={`Enter ${req_msg}`}
          style={{ minWidth, maxWidth }}
          prefix={outline}
        />
      </Form.Item>
    </div>
  );
};

export default Inputs;
