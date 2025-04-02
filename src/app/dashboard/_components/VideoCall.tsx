"use client"
import React, { useState, useCallback, useEffect } from 'react';
import VideoContainer from './VideoContainer';
import { useSocket } from '@/context/context';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from 'react-icons/fa';

const VideoCall = () => {
  const { localStream, peer , ongoingCall } = useSocket();
  const [mic, setMic] = useState(true);
  const [vid, setVid] = useState(true);

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

  

  const isOnCall = localStream && peer && ongoingCall ? true : false
  console.log("peer>>>",peer);
  console.log("stream>>>",localStream);
  

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {localStream && <VideoContainer stream={localStream} isOnCall={isOnCall} isLocalStream={true} />}
      {peer && peer.stream && <VideoContainer stream={peer.stream} isOnCall={isOnCall} isLocalStream={false} /> }
      <div style={{ marginTop: '10px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
        <button onClick={toggleAudio} style={{ fontSize: '24px' }}>
          {mic ? <FaMicrophone size={24} /> : <FaMicrophoneSlash size={24} />} 
        </button>
        <button onClick={()=>{}} style={{ background: 'red', color: 'white', fontSize: '18px', padding: '5px 15px', borderRadius: '5px' }}>
          End Call
        </button>
        <button onClick={toggleCamera} style={{ fontSize: '24px' }}>
          {vid ? <FaVideo size={24} /> : <FaVideoSlash size={24} />} 
        </button>
        
      </div>
    </div>
  );
};

export default VideoCall;