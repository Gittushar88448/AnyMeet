import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import server from '../environment';

const Signup = ({setCurrentTab}) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState('')

  const changeHandler = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendOTP = async (email) => {
    try {
      const response = await axios.post(`${server}/api/v1/send-otp`, { email });
      
      if(response.data.newOtp){
        return response.data.newOtp;
      }else{
        setErr(response.data.message)
      }
    } catch (error) {
      return false;
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    const otpSent = await sendOTP(formData.email);
    setIsLoading(false);
    
    if (otpSent) {
      navigate('/auth/verify-otp', { state: formData });
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const errorVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.3
      }
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <motion.form 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onSubmit={submitHandler}
        className="bg-white py-4 px-3 sm:p-8 rounded-xl shadow-lg"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col items-center mb-8">
          <motion.div 
            className="flex items-center gap-2 mb-2"
            whileHover={{ scale: 1.05 }}
          >
            <FaUserPlus className="text-2xl text-indigo-600" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Create Account
            </h2>
          </motion.div>
          <motion.p 
            variants={itemVariants}
            className="text-gray-500 text-sm"
          >
            Join AnyMeet today
          </motion.p>
        </motion.div>

        { err ? <p className='text-red-600'>{err}</p>: ""}
        {/* Form Error */}
        <AnimatePresence>
          {errors.form && err &&(
            <motion.div
              variants={errorVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="overflow-hidden mb-4"
            >
              <div className="text-red-500 text-sm bg-red-50 p-2 rounded-lg">
                {errors.form}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Name Fields */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className='flex items-center text-gray-700 text-sm font-medium mb-2 gap-1'>
              <FaUser className="text-gray-400" />
              First Name
            </label>
            <motion.div whileHover={{ scale: 1.01 }}>
              <input 
                type='text' 
                name='firstName' 
                value={formData.firstName} 
                onChange={changeHandler} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="John"
              />
            </motion.div>
            <AnimatePresence>
              {errors.firstName && (
                <motion.p 
                  variants={errorVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="text-red-500 text-xs mt-1"
                >
                  {errors.firstName}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          
          <div>
            <label className='flex items-center text-gray-700 text-sm font-medium mb-2 gap-1'>
              <FaUser className="text-gray-400" />
              Last Name
            </label>
            <motion.div whileHover={{ scale: 1.01 }}>
              <input 
                type='text' 
                name='lastName' 
                value={formData.lastName} 
                onChange={changeHandler} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="Doe"
              />
            </motion.div>
            <AnimatePresence>
              {errors.lastName && (
                <motion.p 
                  variants={errorVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="text-red-500 text-xs mt-1"
                >
                  {errors.lastName}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Email Field */}
        <motion.div variants={itemVariants} className="mb-4">
          <label className='flex items-center text-gray-700 text-sm font-medium mb-2 gap-1'>
            <FaEnvelope className="text-gray-400" />
            Email
          </label>
          <motion.div whileHover={{ scale: 1.01 }}>
            <input 
              type='email' 
              name='email' 
              value={formData.email} 
              onChange={changeHandler} 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder='your@email.com'
            />
          </motion.div>
          <AnimatePresence>
            {errors.email && (
              <motion.p 
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-red-500 text-xs mt-1"
              >
                {errors.email}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Password Field */}
        <motion.div variants={itemVariants} className="mb-4">
          <label className='flex items-center text-gray-700 text-sm font-medium mb-2 gap-1'>
            <FaLock className="text-gray-400" />
            Password
          </label>
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.01 }}
          >
            <input 
              type={showPassword ? 'text' : 'password'} 
              name='password' 
              value={formData.password} 
              onChange={changeHandler} 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none pr-10 transition-all"
              placeholder='••••••••'
            />
            <motion.button
              type="button"
              className='absolute right-3 top-4 text-gray-500 hover:text-indigo-600'
              onClick={() => setShowPassword(!showPassword)}
              whileTap={{ scale: 0.9 }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </motion.button>
          </motion.div>
          <AnimatePresence>
            {errors.password && (
              <motion.p 
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-red-500 text-xs mt-1"
              >
                {errors.password}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Confirm Password Field */}
        <motion.div variants={itemVariants} className="mb-6">
          <label className='flex items-center text-gray-700 text-sm font-medium mb-2 gap-1'>
            <FaLock className="text-gray-400" />
            Confirm Password
          </label>
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.01 }}
          >
            <input 
              type={showConfirmPassword ? 'text' : 'password'} 
              name='confirmPassword' 
              value={formData.confirmPassword} 
              onChange={changeHandler} 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none pr-10 transition-all"
              placeholder='••••••••'
            />
            <motion.button
              type="button"
              className='absolute right-3 top-4 text-gray-500 hover:text-indigo-600'
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              whileTap={{ scale: 0.9 }}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </motion.button>
          </motion.div>
          <AnimatePresence>
            {errors.confirmPassword && (
              <motion.p 
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-red-500 text-xs mt-1"
              >
                {errors.confirmPassword}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Submit Button */}
        <motion.div variants={itemVariants}>
          <motion.button
            type='submit'
            className='w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2'
            whileHover={{ scale: 1.01, boxShadow: "0 5px 15px rgba(79, 70, 229, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <>
                <FaUserPlus />
                Sign Up
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.div 
          variants={itemVariants}
          className="mt-6 text-center text-sm text-gray-500"
        >
          Already have an account?{' '}
          <motion.button
            type="button"
            className="text-indigo-600 font-medium hover:underline focus:outline-none"
            onClick={() => setCurrentTab(1)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Login
          </motion.button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
};

export default Signup;