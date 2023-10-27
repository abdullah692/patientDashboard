import { useEffect, useState } from "react";
import { DatePicker, Form } from "antd";
import dayjs from "dayjs";
import 'dayjs/locale/en'; 

const DatePickers = ({ callback, _for, req_msg, width="180px", size="large", maxWidth="180px", defaultValue=null, value=null, required=true, height="auto"  }) => {
    const [selectedValue, setSelectedValue] = useState(defaultValue);
    // const [isRender, setIsRender] = useState(false);

    const handleChange = (date) => {
        console.log(dayjs(date).format('YYYY-MM-DD'), "newValue");
        setSelectedValue(dayjs(date).format('YYYY-MM-DD'));
        callback(dayjs(date).format('YYYY-MM-DD'));
    }
    
    // useEffect(()=>{
    //     console.log(defaultValue, "defaultValueDate");
    //     setSelectedValue(defaultValue);
    // }, [defaultValue]);
    // console.log(defaultValue, "DatePickDefau");

  return (
    <Form.Item 
        style={{ marginBottom: 0 }}
        name={_for}
        valuePropName={selectedValue}
        rules={[
        {
            required: required,
            message: 'Please Select ' + req_msg || _for,
        },
        ]}
    >
        <DatePicker
        showToday={false}
            size={size}
            style={{ width:width, maxWidth: maxWidth, height: height }}
            selected={new Date()}
            defaultValue={defaultValue}
            value={value ? dayjs(value) : null}
            onChange={handleChange}
            dateFormat="yyyy-MM-dd"
            className="border-b-2 border-slate-200 w-[150px] py-1 text-red-900"
        />
    </Form.Item>
  )
}

export default DatePickers