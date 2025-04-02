"use client"
import { useEffect, useRef } from "react";
import { useSocket } from "@/context/context";
import { Button } from "@/components/ui/button";
import { PhoneIncoming, PhoneOff } from "lucide-react";

const CallNotification = () => {
  const { ongoingCall ,handleJoinCall } = useSocket();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    console.log('ringing execution');
    
    if (ongoingCall?.isRinging) {
      if (!audioRef.current) {
        audioRef.current = new Audio("/ringtone.mp3");
        audioRef.current.loop = true;
      }
      audioRef.current.play().catch((err) => {
        console.error('Failed to play ringtone:', err);
      });
    } else {
      audioRef.current?.pause();
      audioRef.current = null;
    }

    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [ongoingCall]);

  console.log("ongoingcall>> ",ongoingCall);
  

  if (!ongoingCall?.isRinging) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-xl shadow-xl text-center w-80 border border-gray-700">
        <img
          src={ongoingCall.participants.caller.profile.imageUrl}
          alt="Caller"
          className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-gray-600"
        />
        <h2 className="text-white text-lg font-semibold mb-2">Incoming Call...</h2>
        <p className="text-gray-400">{ongoingCall.participants.caller.profile.fullName}</p>
        <div className="flex justify-around mt-5">
          <Button
            className="bg-green-600 hover:bg-green-500 text-white p-3 rounded-full shadow-lg"
            onClick={() => {
              handleJoinCall(ongoingCall)
              audioRef.current?.pause()
            }}
          >
            <PhoneIncoming className="w-6 h-6" />
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-500 text-white p-3 rounded-full shadow-lg"
            onClick={() => audioRef.current?.pause()}
          >
            <PhoneOff className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CallNotification;
