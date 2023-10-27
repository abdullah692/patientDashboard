import { useState } from "react";
import { Button, Dropdown, Form, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useEffect } from "react";


const DropDown = ({ arr, _for, callback, size="large", width='180px', maxWidth='430px', req_msg, defaultValue=null, icon=<DownOutlined /> }) => {
    const [selectedValue, setSelectedValue] = useState(defaultValue);

    const menu = (
        <Menu onClick={(e) => {
          setSelectedValue(e.key);
          callback(_for, e.key);
        }}>
            {arr?.map((st) => (
                <Menu.Item key={st}>
                    {st.charAt(0).toUpperCase() + st.slice(1)}
                </Menu.Item>
            ))}
        </Menu>
    );
  return (
    <Form.Item 
        style={{ marginBottom: 0 }}
        name={_for}
        valuePropName={selectedValue}
        rules={[
        {
            required: true,
            message: 'Please Select ' + req_msg || _for,
        },
        ]}
    >
        <Dropdown overlay={menu}>
            <Button style={{ width: width, maxWidth: maxWidth, background: '#fff' }} size={size}>
                {selectedValue?.charAt(0)?.toUpperCase() + selectedValue?.slice(1) || req_msg || _for} {icon}
            </Button>
        </Dropdown>
    </Form.Item> 
  )
}

export default DropDown