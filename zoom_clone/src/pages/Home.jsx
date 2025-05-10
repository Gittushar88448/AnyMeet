import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaUserPlus, FaSignInAlt, FaVideo, FaRocket, FaTimes, FaBars } from 'react-icons/fa';

const Home = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem('token'));

        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            if (window.innerWidth > 768) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
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
                className='w-full h-20 fixed top-0 flex justify-between items-center px-8 md:px-16 lg:px-24 z-50 bg-transparent backdrop-blur-sm'
            >
                {/* Logo */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => navigate('/')}
                >
                    <FaVideo className="text-2xl sm:text-3xl text-amber-400" />
                    <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                        ANYMEET
                    </span>
                </motion.div>

                {/* Desktop Navigation */}
                {windowWidth > 768 ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className='flex gap-4 md:gap-6 items-center'
                    >
                        {isLoggedIn ? (
                            <>
                                {/* Logged in items */}
                            </>
                        ) : (
                            <>
                                <motion.div variants={itemVariants} className="flex items-center gap-1 text-gray-300 hover:text-amber-400 cursor-pointer transition-colors">
                                    <FaUser className="text-sm" />
                                    <span className="text-sm md:text-base">Guest</span>
                                </motion.div>
                                <motion.div variants={itemVariants} onClick={() => navigate('/auth')} className="flex items-center gap-1 text-gray-300 hover:text-amber-400 cursor-pointer transition-colors">
                                    <FaUserPlus className="text-sm" />
                                    <span className="text-sm md:text-base">Register</span>
                                </motion.div>
                            </>
                        )}
                        <motion.button
                            variants={itemVariants}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className='bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1 sm:px-4 sm:py-2 rounded-md text-white flex items-center gap-2 text-sm sm:text-base'
                            onClick={() => navigate("/auth")}
                        >
                            {isLoggedIn ? 'Connect' : <><FaSignInAlt /><span>Login</span></>}
                        </motion.button>
                    </motion.div>
                ) : (
                    <>
                        {/* Mobile Menu Button */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            className="text-amber-400 text-2xl z-50"
                            onClick={toggleMobileMenu}
                        >
                            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                        </motion.button>

                        {/* Mobile Menu */}
                        {isMobileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, x: '100%' }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: '100%' }}
                                transition={{ duration: 0.3 }}
                                className="fixed inset-0 bg-gray-900 bg-opacity-95 backdrop-blur-sm flex flex-col items-center justify-center gap-8 z-40"
                            >
                                <div className="flex flex-col items-center gap-6">
                                    {isLoggedIn ? (
                                        <>
                                            {/* Logged in mobile items */}
                                        </>
                                    ) : (
                                        <>
                                            <motion.div
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                                className="flex items-center gap-2 text-xl text-gray-300 hover:text-amber-400 cursor-pointer"
                                                onClick={() => {
                                                    navigate('/auth');
                                                    setIsMobileMenuOpen(false);
                                                }}
                                            >
                                                <FaUser />
                                                <span>Guest</span>
                                            </motion.div>
                                            <motion.div
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.3 }}
                                                className="flex items-center gap-2 text-xl text-gray-300 hover:text-amber-400 cursor-pointer"
                                                onClick={() => {
                                                    navigate('/auth');
                                                    setIsMobileMenuOpen(false);
                                                }}
                                            >
                                                <FaUserPlus />
                                                <span>Register</span>
                                            </motion.div>
                                        </>
                                    )}
                                    <motion.button
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className='bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 rounded-md text-white flex items-center gap-3 text-xl'
                                        onClick={() => {
                                            navigate("/auth");
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        {isLoggedIn ? 'Connect' : <><FaSignInAlt /><span>Login</span></>}
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </>
                )}
            </motion.nav>

            {/* Main Content */}
            <div className='container mx-auto px-8 lg:px-24 min-h-screen flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 pt-20'>
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