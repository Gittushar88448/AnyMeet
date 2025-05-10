import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { FaSignInAlt } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Signup from './Signup';
import server from '../environment';

const Login = ({setCurrentTab}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const changeHandler = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
    // Clear error when user starts typing
    if (errorMsg) setErrorMsg('');
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${server}/api/v1/login`, formData);
  
      if (response.data.user) {
        localStorage.setItem('token', JSON.stringify(response.data.user.access_token));
        navigate('/dashboard');
      } else {
        setErrorMsg(response.data.message);
        localStorage.setItem('token', null);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setErrorMsg(err.response.data.message || 'Invalid email or password');
      } else {
        setErrorMsg('Server error. Please try again later.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
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
        className='bg-white py-4 px-3 sm:p-8 rounded-xl shadow-lg'
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col items-center mb-8">
          <motion.div 
            className="flex items-center gap-2 mb-2"
            whileHover={{ scale: 1.05 }}
          >
            <FaSignInAlt className="text-2xl text-indigo-600" />
            <h2 className='text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent'>
              Welcome Back
            </h2>
          </motion.div>
          <motion.p 
            variants={itemVariants}
            className="text-gray-500 text-sm"
          >
            Sign in to continue to AnyMeet
          </motion.p>
        </motion.div>

        {/* Email Field */}
        <motion.div variants={itemVariants} className="mb-4">
          <label className='block text-gray-700 text-sm font-medium mb-2'>Email Address</label>
          <motion.div whileHover={{ scale: 1.01 }}>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={changeHandler}
              placeholder='your@email.com'
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all'
              required
            />
          </motion.div>
        </motion.div>

        {/* Password Field */}
        <motion.div variants={itemVariants} className="mb-1">
          <label className='block text-gray-700 text-sm font-medium mb-2'>Password</label>
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.01 }}
          >
            <input
              type={showPassword ? 'text' : 'password'}
              name='password'
              value={formData.password}
              onChange={changeHandler}
              placeholder='••••••••'
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none pr-10 transition-all'
              required
            />
            <motion.button
              type="button"
              className='absolute right-3 top-4 text-gray-500 hover:text-indigo-600'
              onClick={() => setShowPassword(!showPassword)}
              whileTap={{ scale: 0.9 }}
            >
              {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              variants={errorVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="overflow-hidden mb-4"
            >
              <div className="text-red-500 text-sm bg-red-50 p-2 rounded-lg">
                {errorMsg}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <motion.div variants={itemVariants} className="mt-6">
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
                <FaSignInAlt />
                Login
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.div 
          variants={itemVariants}
          className="mt-6 text-center text-sm text-gray-500"
        >
          Don't have an account?{' '}
          <motion.button
            type="button"
            className="text-indigo-600 font-medium hover:underline focus:outline-none"
            onClick={() => setCurrentTab(2)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Sign up
          </motion.button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
};

export default Login;