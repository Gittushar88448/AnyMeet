import React, { useEffect, useRef, useState } from 'react'
import { io } from "socket.io-client";
import { IoVideocamOffOutline } from "react-icons/io5";
import { IoVideocamOutline } from "react-icons/io5";
import { AiOutlineAudio, AiOutlineAudioMuted } from 'react-icons/ai';
import { MdOutlineCallEnd } from "react-icons/md";
import { FiMessageCircle } from "react-icons/fi";
import { MdOutlineScreenShare } from "react-icons/md";
import { MdOutlineStopScreenShare } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import server from '../environment';

const connections = {};
const iceCandidatesQueue = {};


// stun server connections
const peerConfigConnections = {
    "iceServers": [
        { 'urls': 'stun:stun.l.google.com:19302' }
    ]
};
const VideoComponent = () => {
    const server_url = server;
    const socketRef = useRef();
    let socketIdRef = useRef();
    let localVideoRef = useRef();
    const navigate = useNavigate();

    let [videoAvailable, setVideoAvailable] = useState(true);
    let [audioAvailable, setAudioAvailable] = useState(true);

    let [video, setVideo] = useState();
    let [audio, setAudio] = useState();
    let [screen, setScreen] = useState(false);

    let [showModal, setShowModal] = useState(false);
    let [screenShareAvailable, setScreeShareAvailable] = useState(false);
    let [messages, setMessages] = useState([]);
    let [message, setMessage] = useState("");

    let [newMessages, setNewMessages] = useState(0);
    let [askForUsername, setAskForUsername] = useState(true);
    let [username, setUsername] = useState("");

    const videoRef = useRef([]);

    let [videos, setVideos] = useState([]);

    const [email, setEmail] = useState("");


    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });

            if (videoPermission) {
                setVideoAvailable(true)
            } else {
                setVideoAvailable(false)
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });

            if (audioPermission) {
                setAudioAvailable(true);
            } else {
                setAudioAvailable(false)
            }

            // changes*
            // try {
            //     const screenStream = await navigator.mediaDevices.getDisplayMedia({
            //         video: videoAvailable,
            //         audio: audioAvailable,
            //     });

            //     if (screenStream) {
            //         setScreeShareAvailable(true);
            //     }
            // } catch (err) {
            //     // console.error("Screen share not available:", err);
            //     setScreeShareAvailable(false);
            // }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreeShareAvailable(true)
            } else {
                setScreeShareAvailable(false)
            }


            if (videoAvailable || audioAvailable) {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: audioAvailable,
                    video: videoAvailable
                });


                if (stream) {
                    window.localStream = stream;
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = stream;
                    }
                }
            }
        } catch (err) {
            if (err) {
                console.log("error", err);
            }
        }
    }


    let silence = () => {
        let ctx = new AudioContext();
        let oscillator = ctx.createOscillator();
        let dst = oscillator.connect(ctx.createMediaStreamDestination());

        oscillator.start();
        ctx.resume();

        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: true });
    }

    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement('canvas'), { width, height });
        canvas.getContext('2d').fillRect(0, 0, width, height);

        let stream = canvas.captureStream();
        return Object.assign(stream.getVideoTracks()[0], { enabled: false });
    }

    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach((track) => track.stop());
        } catch (e) {
            console.log("Media stream error", e)
        }

        window.localStream = stream;
        localVideoRef.current.srcObject = stream;

        for (let id in connections) {
            if (id == socketIdRef.current) continue;

            connections[id].addStream(window.localStream)
            connections[id].createOffer().then((desc) => {
                connections[id].setLocalDescription(desc)
                    .then(() => {
                        // change
                        socketRef.current.emit("signal", id, JSON.stringify({ "sdp": connections[id].localDescription }))
                    }).catch(e => console.log(e));
            }).catch((e) => console.log(e))
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(videoAvailable);
            setAudio(audioAvailable);
            try {
                let tracks = localVideoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            } catch (error) {
                console.log(error)
            }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()]);

            window.localStream = blackSilence();

            localVideoRef.current.srcObject = window.localStream;

            for (let id in connections) {
                connections[id].addStream(window.localStream);
                connections[id].createOffer().then((desc) => {
                    connections[id].setLocalDescription(desc)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ "sdp": connections[id].localDescription }))
                        })
                })
            }
        })
    }

    let getUserMedias = async () => {
        if (video && videoAvailable || audio && audioAvailable) {
            await navigator.mediaDevices.getUserMedia({
                video: video,
                audio: audio
            })
                .then(getUserMediaSuccess)
                .then((stream) => { })
                .catch(e => console.log(e))
        } else {
            try {
                let tracks = localVideoRef.current.srcObject.getTracks();
                tracks.forEach((track) => track.stop())

            } catch (error) {
                console.log(error)
            }
        }
    }

    const gotMessageFromServer = (fromId, messagee) => {
        const signal = JSON.parse(messagee);

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp))
                    .then(() => {
                        // ✅ Flush queued ICE candidates
                        if (iceCandidatesQueue[fromId]) {
                            iceCandidatesQueue[fromId].forEach(candidate => {
                                connections[fromId].addIceCandidate(new RTCIceCandidate(candidate))
                                    .catch(e => console.error("Failed to add queued candidate", e));
                            });
                            delete iceCandidatesQueue[fromId];
                        }

                        if (signal.sdp.type === "offer") {
                            connections[fromId].createAnswer()
                                .then((description) => {
                                    connections[fromId].setLocalDescription(description)
                                        .then(() => {
                                            socketRef.current.emit("signal", fromId, JSON.stringify({
                                                "sdp": connections[fromId].localDescription
                                            }));
                                        }).catch((e) => console.log("LocalDescription error", e));
                                }).catch((e) => console.log("createAnswer error", e));
                        }
                    }).catch((e) => console.log("RemoteDescription error", e));
            }

            if (signal.ice) {
                if (connections[fromId] && connections[fromId].remoteDescription && connections[fromId].remoteDescription.type) {
                    connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice))
                        .catch(e => console.log("addIceCandidate error", e));
                } else {
                    // 📥 Queue ICE candidates if remoteDescription is not set yet
                    if (!iceCandidatesQueue[fromId]) {
                        iceCandidatesQueue[fromId] = [];
                    }
                    iceCandidatesQueue[fromId].push(signal.ice);
                }
            }
        }
    }

    const addMessage = (data, sender, socketIdSender) => {
        //console.log("daata", data + "from" + sender + socketIdSender)
        setMessages((prev) => [
            ...prev,
            {sender: sender, data: data}
        ]);
        //console.log("message", message)
        if(socketIdSender != socketIdRef.current){
            setNewMessages((prev) => prev + 1);
        }
    }

    const connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false });

        socketRef.current.on('signal', gotMessageFromServer);

        socketRef.current.on('connect', () => {

            socketRef.current.emit('join-call', window.location.href);
            socketIdRef.current = socketRef.current.id;

            socketRef.current.on('chat-message', addMessage)

            socketRef.current.on('user-left', (id) => {
                setVideos((video) => video.filter((vid) => vid.socketId != id));
            })
        })

        socketRef.current.on('user-joined', (id, clients) => {
            setMessages([]);
            clients.forEach((socketListId) => {
                connections[socketListId] = new RTCPeerConnection(peerConfigConnections);
                connections[socketListId].onicecandidate = (e) => {
                    if (e.candidate != null) {
                        socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': e.candidate }));
                    }
                }

                connections[socketListId].onaddstream = (e) => {
                    let videoExist = videoRef.current.find(video => video.socketId == socketListId);

                    if (videoExist) {
                        setVideos((videos) => {
                            const updateVideos = videos.map(vid => vid.socketId == socketListId ? { ...vid, stream: e.stream } : vid)

                            videoRef.current = updateVideos;
                            return updateVideos;
                        });
                    } else {
                        let newVideo = {
                            socketId: socketListId,
                            stream: e.stream,
                            autoPlay: true,
                            playsinline: true
                        }
                        setVideos((video) => {
                            const updateVideos = [...video, newVideo];
                            videoRef.current = updateVideos;
                            return updateVideos
                        })
                    }

                }

                if (window.localStream != undefined && window.localStream != null) {
                    connections[socketListId].addStream(window.localStream);
                } else {
                    //console.log("localstram is null" + window.localStream);

                    let blackSilence = (...args) => new MediaStream([black(...args), silence()]);

                    window.localStream = blackSilence();

                    connections[socketListId].addStream(window.localStream);
                }
            });

            if (id == socketIdRef.current) {
                for (let id2 in connections) {
                    if (id2 === socketIdRef.current) continue;

                    try {
                        connections[id2].addStream(window.localStream)
                    } catch (e) {
                        console.log("errorrrrrr", e);
                    }

                    connections[id2].createOffer().then((desc) => {
                        connections[id2].setLocalDescription(desc)
                            .then(() => {
                                socketRef.current.emit("signal", id2, JSON.stringify({
                                    "sdp": connections[id2].localDescription
                                }))
                            }).catch((e) => {
                                console.log("error", e)
                            })
                    })

                }
            }
        })

    }

    const getDisplayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: true
                })
                    .then(getDisplayMediaSuccess)
                    .then((stream) => {})
                    .catch((e) => console.log(e))
            }
        }
    }

    const getDisplayMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop());
        } catch (e) {
            console.log(e)
        }

        window.localStream = stream;
        localVideoRef.current.srcObject = stream;

        for (let id in connections) {
            if (id === socketIdRef.current) continue;

            connections[id].addStream(window.localStream);

            connections[id].createOffer().then((description) => [
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ "sdp": connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            ]);

            stream.getTracks().forEach(track => track.onended = () => {
                setScreen(false);
                try {
                    let tracks = localVideoRef.current.srcObject.getTracks();
                    tracks.forEach(track => track.stop());
                } catch (error) {
                    console.log(error)
                }

                let blackSilence = (...args) => new MediaStream([black(...args), silence()]);

                window.localStream = blackSilence();

                localVideoRef.current.srcObject = window.localStream;

                getUserMedias();
            })
        }
    }

    const handleEndCall = () => {
        try{
            let tracks = localVideoRef.current.srcObject.getTracks();

            tracks.forEach(track => track.stop());
        }catch(e){
            console.log(e)
        }

        navigate('/dashboard')
    }

    useEffect(() => {
        getPermissions();
    }, []);

    useEffect(() => {
        console.log(messages)
    },[message])

    useEffect(() => {
        if (video != undefined && audio != undefined) {
            getUserMedias();
        }
    }, [video, audio])

    let getMedia = () => {

        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();
    }

    let connect = (e) => {
        e.preventDefault();
        setAskForUsername(false);
        getMedia();
    }

    const handleVideoClick = () => {
        setVideo(!video);
    }

    const handleAudioClick = () => {
        setAudio(!audio);
    }

    const handleScreen = () => {
        setScreen(!screen);
    }

    useEffect(() => {
        if (screen != undefined) {
            getDisplayMedia()
        }
    }, [screen]);

    useEffect(() => {
        if(email){
            setUsername(email.split('@')[0])
        }
    },[email]);

    const handleMessage = () => {
        setShowModal(!showModal)
    }

    const chatHandler = (e) => {
    e.preventDefault();

    if (message.trim() !== "") {
        socketRef.current.emit("chat-message", message, email.split('@')[0]);
        setMessages((prev) => [...prev, { sender: email.split('@')[0], data: message }]);
        setMessage(""); 
    }
    }

    useEffect(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = window.localStream;
        }
      }, [window.localStream]);

    return (
        <div>
        <AnimatePresence>
          {askForUsername ? (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={connect}
              className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg"
            >
              <motion.h2 
                className="text-xl font-bold mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                Enter Email to Join
              </motion.h2>
             
             <motion.input
                className="border p-2 my-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              />
              <motion.button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Connect
              </motion.button>
              <motion.div 
                className="mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <video ref={localVideoRef} autoPlay muted className="w-full rounded-lg shadow-md" />
              </motion.div>
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative bg-[#1c1835] min-h-screen p-4"
            >
              {/* Local Video */}
              <motion.div
                className="rounded-lg absolute bottom-20 w-[20vw] left-4 shadow-xl z-10"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <video ref={localVideoRef} autoPlay muted className="w-full rounded-lg" />
              </motion.div>
  
              {/* Controls */}
              <motion.div 
                className='absolute bottom-0 w-full flex items-center justify-center gap-4 p-4 z-10 bg-[#1c1835]/80 backdrop-blur-sm'
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {[
                  { 
                    icon: video ? IoVideocamOutline : IoVideocamOffOutline, 
                    handler: handleVideoClick,
                    color: 'white'
                  },
                  { 
                    icon: audio ? AiOutlineAudio : AiOutlineAudioMuted, 
                    handler: handleAudioClick,
                    color: 'white'
                  },
                  { 
                    icon: screenShareAvailable ? MdOutlineScreenShare : MdOutlineStopScreenShare, 
                    handler: handleScreen,
                    color: 'white'
                  },
                  { 
                    icon: MdOutlineCallEnd, 
                    handler: handleEndCall,
                    color: 'red'
                  },
                  { 
                    icon: FiMessageCircle, 
                    handler: handleMessage,
                    color: 'white',
                    badge: newMessages > 0 ? newMessages : null
                  }
                ].map((control, index) => (
                  <motion.div
                    key={index}
                    onClick={control.handler}
                    className="relative cursor-pointer p-2 rounded-full hover:bg-white/20"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {control.badge && (
                      <motion.div 
                        className='absolute text-white bg-green-500 rounded-full w-5 h-5 flex items-center justify-center -right-1 -top-1'
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring" }}
                      >
                        <span className="text-xs">{control.badge}</span>
                      </motion.div>
                    )}
                    <control.icon color={control.color} size={32} />
                  </motion.div>
                ))}
              </motion.div>
  
              {/* Chat Modal */}
              <AnimatePresence>
                {showModal && (
                  <motion.div
                    className='h-[85%] mt-2 bg-white w-[45%] sm:w-[30%] absolute right-4 rounded-xl shadow-2xl overflow-hidden z-20'
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 300, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <div className='h-full mx-auto w-[90%] relative'>
                      <h1 className='text-2xl font-semibold text-gray-800 py-4'>Chat</h1>
                      
                      <div className='h-[calc(100%-120px)] overflow-y-auto'>
                        {messages.length !== 0 ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ staggerChildren: 0.1 }}
                          >
                            {messages.map((item, index) => (
                              <motion.div
                                key={index}
                                className="mb-4 p-3 bg-gray-50 rounded-lg"
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                              >
                                <p className="font-bold text-blue-600">{item.sender}</p>
                                <p className="text-gray-700">{item.data}</p>
                              </motion.div>
                            ))}
                          </motion.div>
                        ) : (
                          <motion.p 
                            className="text-gray-500 text-center mt-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            No Messages Yet
                          </motion.p>
                        )}
                      </div>
  
                      {/* Input */}
                      <motion.div 
                        className='absolute bottom-4 w-full z-20'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <form className='w-full flex gap-2' onSubmit={chatHandler}>
                          <motion.input
                            type='text'
                            id='chat'
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            name='message'
                            placeholder='Type your message...'
                            className='px-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                            whileFocus={{ scale: 1.01 }}
                          />
                          <motion.button
                            type='submit'
                            className='bg-blue-500 hover:bg-blue-600 px-4 rounded-lg text-white shadow-sm'
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Send
                          </motion.button>
                        </form>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
  
              {/* Remote Videos */}
              {videos.map((vid) => (
                <motion.div
                  key={vid.socketId}
                  className="relative bg-gray-800 rounded-xl overflow-hidden shadow-lg"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring" }}
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className="absolute top-2 left-2 text-white text-sm bg-black/50 px-2 py-1 rounded z-10">
                    User: {vid.socketId.slice(0, 8)}
                  </h3>
                  <video
                    autoPlay
                    data-socket={vid.socketId}
                    ref={(ref) => {
                      if (ref && vid.stream) {
                        ref.srcObject = vid.stream;
                      }
                    }}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
}

export default VideoComponent