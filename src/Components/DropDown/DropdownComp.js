import { useState } from 'react'
import { Button, Dropdown, Form, Menu } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { useEffect } from 'react'

const DropDownComp = ({
  arr,
  _for,
  callback,
  size = 'large',
  width = '180px',
  maxWidth = '430px',
  req_msg,
  value = null,
  disabled = false,
  icon = <DownOutlined />,
  readOnly,
}) => {
  // const [selectedValue, setSelectedValue] = useState(defaultValue);

  const menu = (
    <Menu
      onClick={e => {
        //   setSelectedValue(e.key);
        callback(_for, e.key)
      }}
    >
      {arr?.map(st => (
        <Menu.Item key={st}>
          {st?.charAt(0)?.toUpperCase() + st?.slice(1)}
        </Menu.Item>
      ))}
    </Menu>
  )
  return (
    <Form.Item
      style={{ marginBottom: 0 }}
      name={_for}
      valuePropName={value}
      rules={[
        {
          required: true,
          message: 'Please Select ' + req_msg || _for,
        },
      ]}
    >
      <Dropdown overlay={menu} disabled={readOnly}>
        <Button
          style={{
            width: width,
            maxWidth: maxWidth,
            background: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
          }}
          size={size}
        >
          <span>
            {value?.charAt(0)?.toUpperCase() + value?.slice(1) ||
              req_msg ||
              _for}
          </span>{' '}
          <span>{icon}</span>
        </Button>
      </Dropdown>
    </Form.Item>
  )
}

export default DropDownComp
