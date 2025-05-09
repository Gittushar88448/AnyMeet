import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHistory, FaPowerOff, FaVideo } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import server from '../environment';
// import './App.css';

const Dashboard = () =>{
  const [meetingCode, setMeetingCode] = useState('');
  const [history, setHistory] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate()

  const handleJoinMeeting =async (e) => {
    e.preventDefault();
    if (meetingCode.trim()) {
      try {
        const response = await axios.post(`${server}/api/v1/add-history`,{meetingCode},{ headers: { Authorization: `Bearer ${token}`} } );
        if(response.data){
          console.log('history added');
        }
      } catch (error) {
        console.log(error);
      }
      navigate(`/dashboard/${meetingCode}`)
    }
  };

    const logout = () => {
    localStorage.setItem('token', '');
    if(!localStorage.getItem("token")){
      navigate('/auth');
    }
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex-shrink-0 flex items-center cursor-pointer"
                onClick={() => navigate('/')}
              >
                <FaVideo className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-indigo-600">AnyMeet</span>
              </motion.div>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate('/dashboard/history')} className="p-2 rounded-full text-gray-600 hover:text-indigo-600 hover:bg-gray-100 transition-colors">
                <FaHistory className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-full text-gray-600 hover:text-red-600 hover:bg-gray-100 transition-colors">
                <FaPowerOff className="h-5 w-5" onClick={logout} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left Side - Text and Input */}
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              Premium video meetings. Now free for everyone.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg text-gray-600 mb-8"
            >
              We re-engineered the service we built for secure business meetings, AnyMeet, to make it free and available for all.
            </motion.p>
            
            <motion.form 
              onSubmit={handleJoinMeeting}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="meeting-code" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter meeting code
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    id="meeting-code"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-4 pr-12 py-3 sm:text-sm border-gray-300 rounded-lg border"
                    placeholder="abc-defg-hij"
                    value={meetingCode}
                    onChange={(e) => setMeetingCode(e.target.value)}
                  />
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
              >
                {isHovered ? 'Join now!' : 'Join Meeting'}
              </motion.button>
            </motion.form>
          </div>
          
          {/* Right Side - Image */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 flex justify-center"
          >
            <div className="relative">
              <img 
                src="https://illustrations.popsy.co/amber/video-call.svg" 
                alt="Video call illustration" 
                className="w-full max-w-md lg:max-w-lg"
              />
              <motion.div 
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-6 -left-6 bg-indigo-100 p-3 rounded-full shadow-lg"
              >
                <FaVideo className="h-6 w-6 text-indigo-600" />
              </motion.div>
              <motion.div 
                animate={{
                  y: [0, 10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
                className="absolute -top-6 -right-6 bg-indigo-100 p-3 rounded-full shadow-lg"
              >
                <FaVideo className="h-6 w-6 text-indigo-600" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;