import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Error = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const buttonHover = {
    scale: 1.05,
    transition: { type: 'spring', stiffness: 400, damping: 10 }
  };

  const buttonTap = {
    scale: 0.95
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
      >
        <motion.div
          variants={itemVariants}
          className="flex justify-center mb-6"
        >
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </motion.div>

        <motion.h1 
          variants={itemVariants}
          className="text-3xl font-bold text-gray-800 mb-3"
        >
          Oops! Page Not Found
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          className="text-gray-600 mb-8"
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>

        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={buttonHover}
            whileTap={buttonTap}
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
          >
            Go Back
          </motion.button>

          <motion.button
            whileHover={buttonHover}
            whileTap={buttonTap}
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            Return Home
          </motion.button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-8 text-sm text-gray-400"
        >
          Error code: 404
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Error;