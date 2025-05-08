import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaUserPlus, FaSignInAlt, FaVideo, FaRocket } from 'react-icons/fa';

const Home = () => {
    const navigate = useNavigate();

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
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

    const imageVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                duration: 0.8
            }
        },
        hover: {
            scale: 1.05,
            transition: { duration: 0.3 }
        }
    };

    const floatingVariants = {
        float: {
            y: ["0%", "-10%", "0%"],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 overflow-hidden relative">
            {/* Floating background elements */}
            <motion.div 
                className="absolute top-20 left-20 w-40 h-40 rounded-full bg-indigo-800 opacity-20 blur-xl"
                variants={floatingVariants}
                animate="float"
            />
            <motion.div 
                className="absolute bottom-20 right-20 w-60 h-60 rounded-full bg-amber-600 opacity-10 blur-xl"
                variants={floatingVariants}
                animate="float"
                style={{ y: ["0%", "10%", "0%"] }}
            />

            {/* Navbar */}
            <motion.nav 
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className='w-full h-20 absolute top-0 flex justify-between items-center px-8 md:px-16 lg:px-24 z-10'
            >
                <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 cursor-pointer"
                >
                    <FaVideo className="text-3xl text-amber-400" />
                    <span className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                        ANYMEET
                    </span>
                </motion.div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className='flex gap-4 md:gap-6 items-center'
                >
                    <motion.div variants={itemVariants} className="flex items-center gap-1 text-gray-300 hover:text-amber-400 cursor-pointer transition-colors">
                        <FaUser className="text-sm" />
                        <span className="text-sm md:text-base">Guest</span>
                    </motion.div>
                    <motion.div variants={itemVariants} onClick={() => navigate('/auth')} className="flex items-center gap-1 text-gray-300 hover:text-amber-400 cursor-pointer transition-colors">
                        <FaUserPlus className="text-sm" />
                        <span className="text-sm md:text-base">Register</span>
                    </motion.div>
                    <motion.button 
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className='bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 rounded-md text-white flex items-center gap-2'
                        onClick={() => navigate("/auth")}
                    >
                        {
                            localStorage.getItem('token') ? (<p>Connect</p>): (<><FaSignInAlt /><span>Login</span></>)
                        }
                    </motion.button>
                </motion.div>
            </motion.nav>

            {/* Main Content */}
            <div className='container mx-auto px-8 md:px-16 lg:px-24 min-h-screen flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 pt-20'>
                {/* Text Content */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className='flex-1 flex flex-col gap-6 text-center md:text-left'
                >
                    <motion.h1 variants={itemVariants} className='text-4xl md:text-5xl lg:text-6xl font-bold text-white'>
                        <span className='bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent'>Connect</span> With Your Loved Ones
                    </motion.h1>
                    
                    <motion.p variants={itemVariants} className='text-lg md:text-xl text-gray-300 max-w-lg'>
                        Bridge distances with crystal clear video calls that feel like you're in the same room
                    </motion.p>
                    
                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mt-6">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/auth')}
                            className='bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-3 rounded-md font-medium flex items-center justify-center gap-2'
                        >
                            <FaRocket />
                            Get Started
                        </motion.button>
                        
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className='border border-amber-500 text-amber-500 px-8 py-3 rounded-md font-medium'
                            onClick={() => navigate('/auth')}
                        >
                            Join Meeting
                        </motion.button>
                    </motion.div>
                </motion.div>

                {/* Image Content */}
                <motion.div 
                    variants={imageVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    className='flex-1 flex justify-center items-center relative'
                >
                    <img 
                        src='https://illustrations.popsy.co/amber/video-call.svg' 
                        alt='Video call illustration' 
                        className='w-full max-w-md xl:max-w-xl floating-element'
                    />
                    
                    {/* Animated floating elements */}
                    <motion.div 
                        className="absolute -bottom-5 -left-5 bg-amber-500/20 p-3 rounded-full shadow-lg backdrop-blur-sm"
                        variants={floatingVariants}
                        animate="float"
                    >
                        <FaVideo className="h-6 w-6 text-amber-400" />
                    </motion.div>
                    
                    <motion.div 
                        className="absolute -top-5 -right-5 bg-indigo-500/20 p-3 rounded-full shadow-lg backdrop-blur-sm"
                        variants={floatingVariants}
                        animate="float"
                        style={{ y: ["0%", "15%", "0%"] }}
                    >
                        <FaVideo className="h-6 w-6 text-indigo-400" />
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Home;