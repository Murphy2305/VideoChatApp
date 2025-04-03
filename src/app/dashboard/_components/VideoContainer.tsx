"use client"
import React, { useRef, useEffect } from 'react'

interface iVideoContainer{
    stream : MediaStream | null;
    isLocalStream : boolean;
    isOnCall : boolean;
}

const VideoContainer = ({stream, isLocalStream} : iVideoContainer) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
      if(videoRef.current && stream)
      {
        videoRef.current.srcObject = stream
      }

    }, [stream])
    
  
    return (
    <video className='rounded border w-[800px]' ref={videoRef} autoPlay muted = {isLocalStream}/>
  )
}

export default VideoContainer