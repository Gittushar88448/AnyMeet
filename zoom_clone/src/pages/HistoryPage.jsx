import { motion } from 'framer-motion';
import { FiClock, FiCopy, FiTrash2 } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const HistoryPage = () => {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);

    const copyToClipboard = (code) => {
        if(navigator.clipboard.writeText(code)){
            toast.success('Copied successfully')
        }
        
    };

    useEffect(() => {
        const getUserHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/api/v1/get-history', {
                    params: {
                        token: token
                    }
                });
                
                if (response.data && Array.isArray(response.data.meetings)) {
                    setMeetings(response.data.meetings);
                }
            } catch (error) {
                console.error('Error fetching meeting history:', error);
            } finally {
                setLoading(false);
            }
        };
        getUserHistory();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
            },
        },
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Meeting History</h1>
                <p className="text-gray-600 mb-8">Your past video conference sessions</p>

                {meetings.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <FiClock className="mx-auto text-gray-400" size={48} />
                        <p className="mt-4 text-gray-500">No meeting history yet</p>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-4"
                    >
                        {meetings.map((meeting) => (
                            <motion.div
                                key={meeting._id}
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 flex justify-between items-center"
                            >
                                <div>
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-blue-100 p-3 rounded-lg">
                                            <FiClock className="text-blue-500" size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-800">Meeting Code</h3>
                                            <p className="text-2xl font-mono font-bold text-gray-900">
                                                {meeting.meeting_code}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-gray-500 mt-2 ml-14">
                                        {meeting.date}
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => copyToClipboard(meeting.meeting_code)}
                                        className="p-2 text-gray-500 hover:text-blue-500 rounded-full hover:bg-blue-50"
                                        title="Copy meeting code"
                                    >
                                        <FiCopy size={20} />
                                    </motion.button>

                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default HistoryPage;