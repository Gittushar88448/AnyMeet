import axios from 'axios';
import React, { useEffect, useState } from 'react'
import OtpInput from 'react-otp-input';
import { useNavigate } from 'react-router-dom';
import { RxCountdownTimer } from "react-icons/rx";
import { BiArrowBack } from "react-icons/bi";
import { Link } from 'react-router-dom';
import server from '../environment';
import { motion } from 'framer-motion';

const EmailVerification = () => {
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();
    const [signupData, setSignupData] = useState({})

    const floatAnimation = {
        float: {
            y: [0, -15, 0],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const floatDelayAnimation = {
        float: {
            y: [0, -15, 0],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
            }
        }
    };

    useEffect(() => {   
        try {
            const {firstName, lastName, email, password , confirmPassword} = window.history.state.usr;
            if (!firstName || !lastName || !email || !password || !confirmPassword ) {
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
        } catch (error) {
            navigate('/')
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
            const response = await axios.post(`${server}/api/v1/send-otp`, {
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
            const response = await axios.post(`${server}/api/v1/signup`, signupData);
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
        const newUser = await dispatchSignupCall();
        setSignupData("");
        if(newUser){
            navigate('/auth');
        }
        return;
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className='w-screen h-screen grid place-items-center bg-[#f5f5f5] overflow-x-hidden'
        >
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className='w-[100%] h-[100%] md:w-[70%] md:h-[80%] bg-white rounded-md shadow-md px-4 py-2 md:p-6 text-center box-border md:-mt-6'
            >
                <motion.h1 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-t from-[#ca93e5] to-[#87a6dc] bg-clip-text text-transparent fade-text font-semibold text-[1.875rem] leading-[2.375rem]"
                >
                    Verify email
                </motion.h1>

                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-[1.125rem] leading-[1.625rem] my-4 text-gray-900"
                >
                    A verification code has been sent to your email address, Enter the code below
                </motion.p>

                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-[1.125rem] leading-[1.625rem] my-4 text-gray-900"
                >
                    ** In case you won't found otp , please check spam
                </motion.p>

                <motion.form 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    onSubmit={submitHandler} 
                    className='flex flex-col items-center justify-center py-5 mt-12'
                >
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <OtpInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            renderSeparator={<span>-</span>}
                            renderInput={(props) => <input {...props}
                                style={{
                                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)"
                                }}
                                className="w-full sm:w-[48px] lg:w-[60px] border-0 bg-gray-100 rounded-[0.5rem] text-gray-900 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50 "
                            />}
                        />
                    </motion.div>

                    <motion.button 
                        type="submit"
                        className="px-8 py-3 rounded-xl mt-5 bg-gradient-to-r  from-blue-500 to-purple-500 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                        whileHover={{ 
                            scale: 1.05,
                            boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)"
                        }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        <span className="relative z-10">Verify Email</span>
                        <motion.span
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.9 }}
                            className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 hover:opacity-100 transition-opacity duration-300"
                        />
                    </motion.button>
                </motion.form>

                <motion.div 
                    className="flex flex-col sm:flex-row items-center justify-around mt-8 gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <motion.div
                        whileHover={{ x: -5 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring" }}
                    >
                        <Link to="/auth" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
                            <BiArrowBack className="text-lg" />
                            <span>Back to Login</span>
                        </Link>
                    </motion.div>

                    <motion.button 
                        onClick={() => dispatchOtpAgain(signupData.email)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors shadow-md px-5 py-3 rounded-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring" }}
                    >
                        <RxCountdownTimer className="text-lg" />
                        <span>Resend Code</span>
                    </motion.button>
                </motion.div>

                <motion.div 
                    className="flex justify-between items-end mt-8 md:mt-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                >
                    <motion.img 
                        src="/assets/mobile.png" 
                        className="w-1/4 max-w-[120px]"
                        variants={floatAnimation}
                        initial="initial"
                        animate="float"
                    />
                    <motion.img 
                        src="/assets/laptop.png" 
                        className="w-1/4 max-w-[180px]"
                        variants={floatDelayAnimation}
                        initial="initial"
                        animate="float"
                    />
                </motion.div>
            </motion.div>
        </motion.div>
    )
}

export default EmailVerification