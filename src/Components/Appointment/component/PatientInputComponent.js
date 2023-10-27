import { useDispatch, useSelector } from "react-redux";
import { deletePartnerById, setDeletePartner } from "../../../Slices/Patient.slice";
import dayjs from "dayjs";
import { Button, DatePicker, Dropdown, Form, Input, Menu, Tooltip } from "antd";
import DropDownComp from "../../DropDown/DropdownComp";
import { UserOutlined, MailOutlined, DeleteFilled, DownOutlined } from '@ant-design/icons'

const PatientInputComponent = ({
    patient,
    _for,
    handleDropDown,
    handleDateChange,
    handleRadioChange,
    currApmnt,
    checkbox,
    handleInputChange,
    isDisabled,
    isDisabledDelete = false,
    readOnly,
  }) => {
    const dispatch = useDispatch();
    const insuranceList = useSelector(state => state.Insurance.insuranceList)
  
    const isDis = isDisabled || isDisabledDelete;
  
    const handleDeletePartner = (partnerId) => {
      dispatch(setDeletePartner());
      dispatch(deletePartnerById({id: partnerId }));
    }
  
    const deleteIcon = () => {
      if (readOnly === false) {
        return (
          <div
            className={`flex items-center w-[100px] mr-1 ${
              isDis ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
            onClick={
              isDis
                ? () => {}
                : () => handleDeletePartner(patient?.id)
            }
          >
            <DeleteFilled
              // fontSize={40}
              className='text-lg'
              style={{ color: isDis ? 'gray' : 'red' }}
            />
            <span
              className={`${
                isDis ? 'text-gray-600' : 'text-red-500'
              } font-semibold text-lg inline-block ml-2 mt-1`}
            >
              Delete
            </span>
          </div>
        )
      }
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
        console.log(regex.test(value), "valueInValidate:2");
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

    const handleKeyPress = e => {
      const regex = /^[0-9]*$/
      const isValid = regex.test(e.key)
      if (!isValid || e.target.value.length >= 10) {
        e.preventDefault()
      }
    }
  
    const menuForInsurance = (
      <Menu
        onClick={e => {
          handleDropDown("Insurance", e.key, _for);
        }}
      >
        {insuranceList?.map(ins => (
          <Menu.Item key={ins?.id}>{ins?.type}</Menu.Item>
        ))}
      </Menu>
    )
  
    return (
      <div className='flex items-center mt-2'>
        {checkbox && (
          <div className='w-[30px]'>
            <input
              type='radio'
              id='html'
              name='appointmentFor'
              value={_for}
              // checked={_for === currentApmntFor}
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
        )}
        <div className='flex items-center gap-x-4 gap-y-2 flex-wrap flex-1 ml-3'>
          <div className='hidden'>
            <Form.Item
              name={_for + 'id'}
              rules={[
                {
                  required: false,
                  message: "Please Enter Patient's Name",
                },
              ]}
            >
              <Input
                size='large'
                name={_for + 'id'}
                placeholder='Id'
                onChange={(e) => handleInputChange(e, _for, "id")}
                prefix={<UserOutlined style={{ color: 'seagreen' }} />}
                hidden={true}
              />
            </Form.Item>
          </div>
          <div className='patient-details w-[250px]'>
            <p className='text-gray-400 mb-1'>Patient&apos;s Name</p>
            <Form.Item
              name={_for + 'name'}
              rules={[
                {
                  required: true,
                  message: "Please Enter Patient's Name",
                },
                // {
                  // validator: (rule, value, callback) =>
                    // validateInput(rule, value, callback, 'alpha'),
                // },
              ]}
            >
              <Input
                size='large'
                name={_for + 'name'}
                placeholder='Enter Name here'
                onChange={(e) => handleInputChange(e, _for, "name")}
                prefix={<UserOutlined style={{ color: 'seagreen' }} />}
                disabled={readOnly}
              />
            </Form.Item>
          </div>
          <div className='patient-details w-[250px]'>
            <p className='text-gray-400 mb-1'>Patient&apos;s Email</p>
            <Form.Item
              name={_for + 'email'}
              rules={[
                {
                  required: true,
                  message: "Please Enter Patient's Email",
                },
                // {
                //   type: 'email',
                //   message: 'Please Enter Valid Email',
                // },
                {
                  validator: (rule, value, callback) =>
                    validateInput(rule, value, callback, 'email'),
                },
              ]}
            >
              <Input
                size='large'
                name={_for + 'email'}
                // value={patient['email']}
                placeholder='Enter Email here'
                onChange={(e) => handleInputChange(e, _for, "email")}
                prefix={<MailOutlined style={{ color: 'seagreen' }} />}
                disabled={readOnly}
              />
            </Form.Item>
          </div>
          <div className='patient-details w-[250px]'>
            <p className='text-gray-400 mb-1'>Patient&apos;s Phone Number</p>
            <Form.Item
              name={_for + 'phone'}
              rules={[
                {
                  required: true,
                  message: "Please Enter Patient's Phone Number",
                },
                // {
                //   min: 10,
                //   pattern: /^[\d]{10,10}$/,
                //   message: "Please enter valid number"
                // },
                // {
                //   validator: (rule, value, callback) =>
                //     validateInput(rule, value, callback, 'num'),
                // },
                // { validator: (rule, value, callback) => validateInput(rule, value, callback, "phone") }
              ]}
            >
              <Input
                addonBefore="+1"
                size="large"
                name={_for + 'phone'}
                // value={patient['phone']}
                placeholder='Enter Phone Number here'
                onChange={(e) => handleInputChange(e, _for, "phone")}
                // onChange={(e) => console.log(e.target.value, "phoneOnChnage")}
                // prefix={<MobileOutlined style={{ color: 'seagreen' }} />}
                prefix={<></>}
                onKeyPress={handleKeyPress}
                disabled={readOnly}
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
              callback={(key, value) => handleDropDown("gender", value, _for)}
              // disabled={isDisabled}
              readOnly={readOnly}
            />
          </div>
          <div className='patient-details w-[250px]'>
            <p className='text-gray-400 mb-1'>Marital Status</p>
            <DropDownComp
              value={patient['maritalStatus']}
              size='large'
              width='250px'
              maxWidth='250px'
              _for={_for + 'maritalStatus'}
              req_msg='Marital Status'
              arr={['single', 'married', 'divorced', 'widowed']}
              // callback={handleDropDown}
              callback={(key, value) => handleDropDown("maritalStatus", value, _for)}
              // disabled={isDisabled}
              readOnly={readOnly}
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
                onChange={(date, dateString) => handleDateChange(date, dateString, _for, 'dob')}
                disabledDate={disabledDate}
                disabled={readOnly}
              />
            </Form.Item>
          </div>
          <div className='patient-details w-[250px]'>
              <p className='text-gray-400 mb-1'>Insurance Type</p>
              <Form.Item
                name={_for + 'Insurance'}
                rules={[
                  {
                    required: true,
                    message: "Please Select Insurance",
                  },
                ]}
              >
                <Dropdown overlay={menuForInsurance}>
                  <Button size='large' style={{ width: '100%', overflow: "hidden"}}>
                      {patient?.ins_id ? patient["Insurance"]?.type : "Select Insurance"} <DownOutlined />
                  </Button>
                </Dropdown>
              </Form.Item>
            </div>
        </div>
        {_for === 'partner' && !isDis && deleteIcon()}
        {_for === 'partner' && isDis && (
          <Tooltip placement='top' title='Delete Appointment First'>
            {deleteIcon()}
          </Tooltip>
        )}
      </div>
    )
}


export default PatientInputComponent;  