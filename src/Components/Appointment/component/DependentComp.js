import { DatePicker, Form, Input, Tooltip } from "antd";
import { UserOutlined, DeleteFilled } from '@ant-design/icons';
import DropDownComp from "../../DropDown/DropdownComp";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

const DependentInputComponent = ({
    patient,
    _for,
    handleRadioChange,
    currApmnt,
    handleInputChange,
    handleDelete,
    isDisabled,
    insuranceInherit,
  }) => {
    const depInsuranceStatus = useSelector(state => state.Patient.depInsuranceStatus);
    
    const deleteIcon = () => {
        return (
          <div
            className={`flex items-center w-[100px] mr-1 ${
              isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
            onClick={
              isDisabled
                ? () => {}
                : () => handleDelete(_for)
            }
          >
            <DeleteFilled
              // fontSize={40}
              className='text-lg'
              style={{ color: isDisabled ? 'gray' : 'red' }}
            />
            <span
              className={`${
                isDisabled ? 'text-gray-600' : 'text-red-500'
              } font-semibold text-lg inline-block ml-2 mt-1`}
            >
              Delete
            </span>
          </div>
        )
    //   }
    }
  
    const validateInput = (rule, value, callback, _for) => {
      console.log(rule, 'valueInValidate', value)
      if (!value) return callback()
      if (_for === 'num') {
        let regex = /^[\d]+$/
        if (!regex.test(value)) {
          callback('Please enter Numbers Only')
        } else {
          callback()
        }
      } else if (_for === 'alpha') {
        let regex = /^[A-Za-z\s]+$/
        if (!regex.test(value)) {
          callback('Please enter Alphabet and spaces only')
        } else {
          callback()
        }
      } else if (_for === 'email') {
        // const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        let regex = /^[A-Za-z0-9._]+@[A-Za-z0-9]+\.[A-Za-z]{2,}$/
        if (!regex.test(value)) {
          callback('Please enter valid email')
        } else {
          callback()
        }
      }
    }
  
    const disabledDate = current => {
      return current && current >= dayjs().endOf('day')
    }
  
    // console.log(_for, "eachDependent_for");
    return (
      <div className='flex items-center mt-2'>
        <div className='w-[30px]'>
        <input
            type='radio'
            id='html'
            name='appointmentFor'
            value={_for}
            checked={currApmnt}
            onChange={handleRadioChange}
            style={{
            width: '15px',
            height: '15px',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            }}
            disabled={isDisabled}
        />
        </div>
        <div className='flex items-center gap-x-4 gap-y-2 flex-wrap flex-1 ml-3'>
          <div className='patient-details w-[250px]'>
            <p className='text-gray-400 mb-1'>Patient&apos;s Name</p>
            <Form.Item
              name={_for + 'name'}
              rules={[
                {
                  required: true,
                  message: "Please Enter Patient's Name",
                },
                {
                  validator: (rule, value, callback) =>
                    validateInput(rule, value, callback, 'alpha'),
                },
              ]}
            >
              <Input
                size='large'
                name={_for + 'name'}
                placeholder='Enter Name here'
                onChange={(e) => handleInputChange(e.target.value, _for, "name")}
                prefix={<UserOutlined style={{ color: 'seagreen' }} />}
                // disabled={isDisabled}
              />
            </Form.Item>
          </div>
          <div className='patient-details w-[250px]'>
            <p className='text-gray-400 mb-1'>Gender</p>
            <DropDownComp
              size='large'
              width='250px'
              maxWidth='250px'
              _for={_for + 'gender'}
              value={patient['gender']}
              arr={['male', 'female']}
              req_msg={'Gender'}
              // callback={handleDropDown}
              callback={(_, value) => handleInputChange(value, _for, "gender")}
              // disabled={isDisabled}
            />
          </div>
          <div className='patient-details w-[250px]'>
            <p className='text-gray-400 mb-1'>Date Of Birth</p>
            <Form.Item
              name={_for + 'dob'}
              rules={[
                {
                  required: true,
                  message: "Please Enter Patient's Date Of Birth",
                },
              ]}
            >
              <DatePicker
                format={"MM/DD/YY"}
                showToday={false}
                name={_for + 'dob'}
                className='my-datepicker h-[40px] w-full'
                onChange={(date, dateString) =>
                  handleInputChange(dateString, _for, 'dob')
                }
                disabledDate={disabledDate}
              />
            </Form.Item>
          </div>
          <div className='patient-details w-[250px]'>
              <p className='text-gray-400 mb-1'>Inherit Insurance From</p>
              <DropDownComp
                value={insuranceInherit}
                size='large'
                width='250px'
                maxWidth='250px'
                _for={_for + 'insurance'}
                req_msg='Insurance'
                arr={depInsuranceStatus}
                // callback={handleDropDown}
                callback={(_, value) => handleInputChange(value, _for, "insurance")}
                // disabled={isDisabled}
              />
            </div>
        </div>
        {deleteIcon()}
      </div>
    );
}

export default DependentInputComponent;