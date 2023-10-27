import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Form, Input, message } from "antd";
import { Link, useNavigate } from 'react-router-dom';
import { ClipLoader } from "react-spinners";
import auth from '../../Services/auth';
import { loginUser, user } from '../../Slices/Auth.slice';
import { useDispatch, useSelector } from "react-redux";
import { NotificationWithIcon } from '../../Utils/Notification';


const override = {
    display: "block",
    marginLeft: "1rem",
    borderColor: "white",
  };
  const validateMessages = {
    required: "${label} is required!",
    types: {
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };
function Signin() {

    const [loading, setLoading] = useState(false);
    const [state, setstate] = useState({});
    const { user: userdata } = useSelector(user);
    console.log(userdata,'userDataCheck');

  const dispatch = useDispatch();
    
    
    let [color, setColor] = useState("black");
    const navigate = useNavigate();
    
    const onSubmit =async (data) => {
      setLoading(true);
      console.log('Data',data);
        dispatch(loginUser({ email: data.email, password: data.password }))
        .unwrap()
        .then((x) => {
          console.log("LOgin", x);
          NotificationWithIcon("success", x?.data);
          setLoading(false);
        })
        .catch((x) => {
          setLoading(false);
          const error = x?.response?.data?.message || x?.message;
          NotificationWithIcon("error", error);
        });
        
      };


      useEffect(() => {
        if (userdata) {
         return navigate("/dashboard");
        }
      }, [userdata]);
     

   if(userdata){
    return null
   }
  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      
      <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
        Sign in to your account
      </h2>
    </div>

    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md ">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <Form validateMessages={validateMessages} onFinish={onSubmit}>
          <div>
            <Form.Item
              size="large"
              name="email"
              rules={[{  min: 6 , required: true}, { type: 'email' }]}
              label={
                <span className="text-gray-800 font-medium">Email</span>
              }
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <div className="rounded-lg">
                <Input
                  size="large"
                  name='email'
                  placeholder="john@creative.com"
                  style={{ borderRadius: "5px" }}
                />
              </div>
            </Form.Item>
          </div>
          <div>
            <Form.Item
              name="password"
              size="large"
              rules={[{  min: 6, required: true }]}
              label={
                <span className="text-gray-800 font-medium">Password</span>
              }
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <div className="rounded-lg">
                <Input.Password
                  size="large"
                  placeholder="please provide a password"
                  style={{ borderRadius: "5px" }}
                />
              </div>
            </Form.Item>
          </div>
          <div className="flex items-center justify-between mt-8">
            {/* <div className="flex items-center">
              <Link
                to="/passwordreset"
                className="text-sm text-gray-900 hover:text-indigo-600"
              >
                Forgot your password?
              </Link>
            </div>
            <div className="text-sm">
              <Link
                to="register"
                className="ml-2 block text-sm text-gray-900 cursor-pointer hover:text-indigo-600"
              >
                Sign up your account?
              </Link>
            </div> */}
          </div>
          <div>
            <button
              disabled={loading}
              type="submit"
              className="flex w-full justify-center rounded-md border border-transparent bg-sea-green py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-sea-greent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mt-2"
            >
              Sign in
              <span>
                <ClipLoader
                  cssOverride={override}
                  color={color}
                  loading={loading}
                  size={20}
                />
              </span>
            </button>
          </div>
        </Form>

      </div>
    </div>
  </div>
  )
}

export default Signin