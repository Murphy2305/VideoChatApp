"use client"
/* eslint-disable */

import { OngoingCall, Participants, PeerData, SocketUser } from "@/types";
import { useUser } from "@clerk/nextjs";
import React, { useCallback, createContext, useContext, useState, useEffect } from "react";
import { Socket, io } from "socket.io-client";
import Peer, { SignalData } from "simple-peer";

interface iSocketContext {
  onlineUsers: SocketUser[] | null;
  ongoingCall: OngoingCall | null;
  handleCall: (user: SocketUser) => void;
  handleJoinCall: (ongoingCall: OngoingCall) => void;
  hangUpCall : (data : {ongoingCall? : OngoingCall | null , isEmitHangUp : boolean}) =>void;
  localStream: MediaStream | null;
  isCallEnded : boolean;
  peer : PeerData | null;
}

export const SocketContext = createContext<iSocketContext | null>(null);

export const SocketContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<SocketUser[] | null>(null);
  const [ongoingCall, setOngoingCall] = useState<OngoingCall | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peer, setPeer] = useState<PeerData | null>(null);
  const [isCallEnded,setIsCallEnded] = useState(false);

  const currSocketUser = onlineUsers?.find((u) => u.userId === user?.id);



  const getUserStream = useCallback(
    async(faceMode? : string) => {

       if (localStream) return localStream;
      try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter((device) => device.kind === "videoinput");
            
            const stream = await navigator.mediaDevices.getUserMedia({
              audio: true,
              video: {
                width: { min: 640, ideal: 1280, max: 1920 },
                height: { min: 360, ideal: 720, max: 1080 },
                frameRate: { min: 16, ideal: 30, max: 30 },
                facingMode: videoDevices.length > 0 ? faceMode : undefined,
        },
      });

        setLocalStream(stream);
        return stream;

    } catch (error) {
      console.error("Failed to get the stream", error);
      setLocalStream(null);
      return null;
    }
    },
    [localStream],
  )
  







  const hangUpCall = useCallback((data : {ongoingCall? : OngoingCall | null , isEmitHangUp : boolean}) => {
    
    if(socket && user && data?.ongoingCall && data?.isEmitHangUp)
    {
        socket.emit('hangup',{
          ongoingCall : data.ongoingCall,
          userHangingupId : user.id
        })


    }

    setOngoingCall(null);
    setPeer(null);
    if(localStream)
    {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null)
    }

    setIsCallEnded(true);







  }, [socket,user,localStream]);

  const createPeer = useCallback(
    (stream: MediaStream | null, initiator: boolean) => {

     

      const iceServers: RTCIceServer[] = [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
            "stun:stun3.l.google.com:19302",
          ],
        },
      ];

      const peer = new Peer({
        stream: stream || undefined,
        initiator,
        trickle: true,
        config: { iceServers },
      });

          peer.on("stream", (remoteStream) => {
      setPeer((prevPeer) => {
        if (prevPeer) return { ...prevPeer, stream: remoteStream };
        return prevPeer;
      });
      });


      peer.on("error", console.error);
      peer.on("close", () => hangUpCall({ongoingCall:null,isEmitHangUp:false}));

      const rtcPeerConnection: RTCPeerConnection = (peer as any)._pc;

      rtcPeerConnection.onconnectionstatechange = async () => {
        if (
          rtcPeerConnection.iceConnectionState === "disconnected" ||
          rtcPeerConnection.iceConnectionState === "failed"
        ) {
          console.log('hangup createpeer');
          
          hangUpCall({ongoingCall:null,isEmitHangUp:false});
        }
      };

      return peer;
    },
    [ongoingCall, setPeer]
  );
  

  const completePeerConnection = useCallback(
    async (connectionData: { sdp: SignalData; ongoingCall: OngoingCall; isCaller: boolean }) => {
        
      
      console.log("WebRTC signal received:", connectionData);
        console.log('local stream complete>> ',localStream);
        
      if(!localStream)
      {
        console.log('Missing the local stream (completePeerConnection)');
        return;
      }
      
      if (peer) {
        console.log('connection p2p');
                if (!peer || peer.peerConnection.destroyed) {
          console.warn("Attempted to signal after peer was destroyed.");
          return;
        }
        peer.peerConnection?.signal(connectionData.sdp);
        //here p2p connection completes and now ice servers( ICE servers are used to facilitate the direct connection between WebRTC clients that are behind NATs and firewall rule)
        //  will handle to exchange vid audio via an optimized path
        return;
      }

      const newPeer = createPeer(localStream, true);

        if (!ongoingCall) {
        console.error("Ongoing call is null when trying to set peer.");
        return;
      }

        setPeer({
          peerConnection: newPeer,
          participantUser: ongoingCall.participants.receiver,
          stream: undefined
        });
        

      newPeer.on("signal", async (data: SignalData) => {
        if(socket)
        {
            console.log('emit offer to caller');
            //emittting of offer
            socket.emit("webrtcSignal", {
              sdp: data,
              ongoingCall,
              isCaller: true,
          });
        }
      });
    },
    [peer, localStream, ongoingCall, createPeer]
  );





  const handleJoinCall = useCallback(
    async (ongoingCall: OngoingCall) => {
      
      setIsCallEnded(false);
      setOngoingCall((prev) => 
          {
            if(prev)
            {
              return {...prev, isRinging: false}
            }
            return prev;
          });

      const stream = await getUserStream();
      if (!stream)
        {
          console.log('could not get stream in handleJoinCall');
          hangUpCall({ ongoingCall: ongoingCall ? ongoingCall : null, isEmitHangUp: true })
          
          return;
        }

      //   if (peer && peer.peerConnection && !peer.peerConnection.destroyed) {
      //   peer.peerConnection.destroy();
      // }


      const newPeer = createPeer(stream, true);
            
      setPeer({
        peerConnection: newPeer,
        participantUser: ongoingCall.participants.caller,
        stream: undefined
      });

              /**
         * Event handler for the peer's "signal" event.
         * 
         * IMPORTANT: This is NOT listening for incoming signals from the remote peer.
         * Instead, it's listening for when our local peer instance GENERATES signaling data
         * (offers, answers, ICE candidates) that needs to be sent to the remote peer.
         * 
         * Flow:
         * 1. Local peer generates signaling data internally
         * 2. The "signal" event fires with this data
         * 3. This callback captures that data and sends it to the remote peer via the socket
         * 4. The server relays this data to the remote peer
         * 
         * To handle incoming signals FROM the remote peer, we need to call peer.signal(incomingData)
         * when we receive data through the socket.
         */


      newPeer.on("signal", async (data: SignalData) => {
          if(socket)
          {
            console.log('webrtc data send');
            
            socket.emit("webrtcSignal",
           { 
            sdp: data, 
            ongoingCall,
            isCaller: false 
          }
          );
          }
      });
    },
    [socket, currSocketUser]
  );



  const onIncomingCall = useCallback((participants: Participants) => {
    console.log('incoming call');
    
    
    setOngoingCall({ 
      participants, 
      isRinging: true 
    });
    console.log(ongoingCall);
    
  
  }, [socket, user, ongoingCall]);



  const handleCall = useCallback(
    async (user: SocketUser) => {

      setIsCallEnded(false);

      if (!currSocketUser || !socket) return;
      const stream = await getUserStream();

      if (!stream)
        {
          console.log('no stream in handleCall');
          return;
          
        }

      const participants = { caller: currSocketUser, receiver: user };
        setOngoingCall({ 
          participants, 
          isRinging: false
        }
        );
      socket.emit("call", participants);
    },
    [currSocketUser, socket, ongoingCall]
  );







  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);
  
    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // useEffect(() => {
  //   console.log('changes in local stream', localStream);
    
  // }, [localStream])
  


  useEffect(() => {
    if (socket === null) return;
    
    function onConnect() {
      console.log('running');
      setIsSocketConnected(true);
    }
    
    function onDisconnect() {
      setIsSocketConnected(false);
    }
    
    if (socket.connected) {
      console.log('running');
      onConnect();
    }
    
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [socket]);
  


  useEffect(() => {
    if (!socket || !isSocketConnected) return;

    socket.emit("addNewUser", user);
    
    function onGetUsers(res: SocketUser[]) {
      console.log("response incoming");
      setOnlineUsers(res);
    }
    
    socket.on("getUsers", onGetUsers);

    return () => {
      socket.off("getUsers", onGetUsers);
    };
  }, [user, isSocketConnected, socket]);
  



  useEffect(() => {
    if (!socket || !isSocketConnected) return;

    socket.on('incomingCall', onIncomingCall);
    socket.on('webrtcSignal', completePeerConnection);
    socket.on('hangup', hangUpCall);
  
    return () => {
      socket.off('incomingCall', onIncomingCall);
      socket.off('webrtcSignal', completePeerConnection);
      socket.off('hangup', hangUpCall);

    };
  }, [user, isSocketConnected, socket, onIncomingCall, completePeerConnection]);


  useEffect(() => {
    let timeout : ReturnType<typeof setTimeout>

    if(isCallEnded)
    {
      timeout = setTimeout(() => {
        setIsCallEnded(false);
      }, 2000);
    }
  
    return () => {
      clearTimeout(timeout)
    }
  }, [isCallEnded])
  
 





  return (
    <SocketContext.Provider value={{ 
      onlineUsers,
       handleCall,
        ongoingCall, 
        handleJoinCall, 
        hangUpCall,
        isCallEnded,
        localStream,
        peer
         }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocket must be used within a SocketContextProvider");
  return context;
};