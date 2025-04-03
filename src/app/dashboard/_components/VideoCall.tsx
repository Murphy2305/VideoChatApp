"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import VideoContainer from "./VideoContainer";
import { useSocket } from "@/context/context";
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from "react-icons/fa";
import { motion } from "framer-motion";

const VideoCall = () => {
  const { localStream, peer, ongoingCall, hangUpCall, isCallEnded } = useSocket();
  const [mic, setMic] = useState(true);
  const [vid, setVid] = useState(true);
  const peerVideoRef = useRef(null);

  useEffect(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      setVid(videoTrack.enabled);
      const audioTrack = localStream.getAudioTracks()[0];
      setMic(audioTrack.enabled);
    }
  }, [localStream]);

  const toggleCamera = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setVid(videoTrack.enabled);
    }
  }, [localStream]);

  const toggleAudio = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setMic(audioTrack.enabled);
    }
  }, [localStream]);

  const isOnCall = localStream && peer && ongoingCall ? true : false;

  if (isCallEnded) {
    return (
      <div className="flex-1 flex flex-col items-center mt-1  h-screen border-l border-gray-700 rounded-md text-red-600 text-l ">
          call ended
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center h-screen border-l border-gray-700 rounded-md">
      <div className="relative w-full h-[80vh] flex justify-center items-center">

        {peer?.stream && (
          <div ref={peerVideoRef} className="relative w-full h-full flex justify-center items-center">
            <VideoContainer stream={peer.stream} isOnCall={isOnCall} isLocalStream={false} />

            {localStream && (
              <motion.div
                drag
                dragConstraints={peerVideoRef}
                className="absolute top-4 right-4 w-32 h-32 rounded-md overflow-hidden cursor-grab active:cursor-grabbing"
              >
                <VideoContainer stream={localStream} isOnCall={isOnCall} isLocalStream={true} />
              </motion.div>
            )}
          </div>
        )}

        {!peer?.stream && localStream && (
          <motion.div className="relative w-full h-[80vh] flex justify-center items-center rounded-md overflow-hidden">
            <VideoContainer stream={localStream} isOnCall={isOnCall} isLocalStream={true} />
          </motion.div>
        )}
      </div>

      {isOnCall && (
        <div className="mt-4 flex gap-4">
          <button onClick={toggleAudio} className="text-white text-xl">
            {mic ? <FaMicrophone size={24} /> : <FaMicrophoneSlash size={24} />}
          </button>
          <button
            className="bg-red-600 text-white text-lg px-4 py-2 rounded-md hover:bg-red-700 transition"
            onClick={() => hangUpCall({ ongoingCall: ongoingCall ? ongoingCall : null, isEmitHangUp: true })}
          >
            End Call
          </button>
          <button onClick={toggleCamera} className="text-white text-xl">
            {vid ? <FaVideo size={24} /> : <FaVideoSlash size={24} />}
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
