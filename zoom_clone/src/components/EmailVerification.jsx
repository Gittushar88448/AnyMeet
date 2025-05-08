import axios from 'axios';
import React, { useEffect, useState } from 'react'
import OtpInput from 'react-otp-input';
import { useNavigate } from 'react-router-dom';
import { RxCountdownTimer } from "react-icons/rx";
import { BiArrowBack } from "react-icons/bi";
import { Link } from 'react-router-dom';

const EmailVerification = () => {
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();
    const [signupData, setSignupData] = useState({})

    useEffect(() => {   
        const {firstName, lastName, email, password , confirmPassword} = window.history.state.usr;
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            navigate("/");
        }else{
            setSignupData({
                firstName,
                lastName,
                password,
                email,
                confirmPassword
            })
        }
    },[navigate]);

    useEffect(() => {
        setSignupData((pre) => ({
            ...pre,
            otp: otp
        }))
    },[otp]);

    const dispatchOtpAgain = async(email) => {
        try{
            const response = await axios.post('http://localhost:8000/api/v1/send-otp', {
                email
              });
          
              if(!response.data.newOtp){
                return;
              }
        }catch(err){
            throw new Error(err)
        }
    }

    const dispatchSignupCall = async() => {
        try{
            const response = await axios.post('http://localhost:8000/api/v1/signup', signupData);
            const {newUser} = response.data;
            if(response.data.status === false){
                console.log(response.data.message)
            }
            return newUser;
        }catch(err){
            throw new Error(err)
        }
    }

    const submitHandler = async(event) => {
        event.preventDefault();
        // console.log(otp)
        // console.log("first", signupData)
       const newUser = await dispatchSignupCall();
       setSignupData("");
       if(newUser){
        navigate('/auth');
       }
       return;
    }

    return (
        <div className='w-screen h-screen grid place-items-center bg-[#f5f5f5] overflow-x-hidden'>
            <div className='w-[70%] h-[70%] bg-white rounded-md shadow-md p-6 text-center box-border -mt-6'>
                <h1 className="bg-gradient-to-t from-[#ca93e5] to-[#87a6dc] bg-clip-text text-transparent fade-text font-semibold text-[1.875rem] leading-[2.375rem]">Verify email</h1>
                <p className="text-[1.125rem] leading-[1.625rem] my-4 text-gray-900">A verification code has been sent to your email address, Enter the code below</p>
                <p className="text-[1.125rem] leading-[1.625rem] my-4 text-gray-900">** In case you won't found otp , please check spam</p>

                <form onSubmit={submitHandler} className='flex flex-col items-center justify-center py-5 mt-12'>
                    <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        renderSeparator={<span>-</span>}
                        renderInput={(props) => <input {...props}
                            style={{
                                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)"
                            }}
                            className="w-[48px] lg:w-[60px] border-0 bg-gray-100 rounded-[0.5rem] text-gray-900 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50 "
                        />}
                    />

                    <button type='submit' className=" p-3 rounded-[8px] mt-8 font-medium bg-blue-500 text-white hover:bg-blue-400 shadow-md">
                        Verify email
                    </button>

                </form>
                <div className='flex items-center py-3 space-x-7 justify-end'>
                    <div>
                        <Link to="/auth">
                            <p className="flex items-center gap-x-2 text-richblack-5">
                                <BiArrowBack /> Back To Login
                            </p>
                        </Link>
                    </div>
                    <button className="flex items-center text-gray-600 hover:text-gray-900 gap-x-2" onClick={() => dispatchOtpAgain(signupData.email)}>
                        <RxCountdownTimer />
                         Resend it
                    </button>
                </div>

                <div className='flex justify-between'>
                    <img src='/assets/mobile.png' className='w-[25%]'/>
                    <img src='/assets/laptop.png' className='w-[25%]'/>
                </div>
            </div>
        </div>
    )
}

export default EmailVerification