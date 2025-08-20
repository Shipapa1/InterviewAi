"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
//import { interviewer } from "@/constants";
//import { createFeedback } from "@/lib/actions/general.action";

enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

interface SavedMessage{
  role: 'user' | 'system' | 'assistant';
  content: string;
}

interface AgentProps {
  userName: string;
  userId: string;
  type: string;
  userPhone?: string; // Added phone number prop
}

const Agent = ({ userName, userId, type, userPhone }: AgentProps) => {

  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);

  useEffect(() =>{
      const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
      const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

      const onMessage = (message: Message) => {
        if(message.type === 'transcript' && message.transcriptType == 'final'){
          const newMessage = { role: message.role, content: message.transcript}
          setMessages((prev) => [...prev, newMessage]);
        }
      }

      const onSpeechStart = () => setIsSpeaking(true);
      const onSpeechEnd = () => setIsSpeaking(false);
      const onError = (error:Error) => console.log('Error', error);

      vapi.on('call-start', onCallStart);
      vapi.on('call-end', onCallEnd);
      vapi.on('message', onMessage);
      vapi.on('speech-start', onSpeechStart);
      vapi.on('speech-end', onSpeechEnd);
      vapi.on('error', onError);

      return () => {
           vapi.off('call-start', onCallStart);
           vapi.off('call-end', onCallEnd);
           vapi.off('message', onMessage);
           vapi.off('speech-start', onSpeechStart);
           vapi.off('speech-end', onSpeechEnd);
           vapi.off('error', onError);
      }

  }, [])

  useEffect(() => {
      if(callStatus === CallStatus.FINISHED)router.push('/');
  }, [messages, callStatus, type, userId]);

  // const isSpeaking = true;
  // const callStatus = CallStatus.FINISHED;
  // const messages = [
  //   'Whats your name?',
  //   'My name is John Doe, nice to meet you',
  // ];
  const lastMessage = messages[messages.length - 1];

  const handleCall = async() => {
    setCallStatus(CallStatus.CONNECTING);
    
    // Check if userPhone is provided for phone-based calling
    if (userPhone) {
      // Use phone-based calling via your API route
      try {
        const response = await fetch('/api/your-route', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userid: userId,
            userPhone: userPhone,
            // Add other required fields from your route.ts
            type,
            // role, level, techstack, amount - you may need to pass these as props too
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Phone call initiated:', data.callId);
          // The call status will be managed by Vapi events
        } else {
          console.error('Failed to initiate phone call');
          setCallStatus(CallStatus.INACTIVE);
        }
      } catch (error) {
        console.error('Error initiating phone call:', error);
        setCallStatus(CallStatus.INACTIVE);
      }
    } else {
      // Use web-based calling (your original implementation)
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          username: userName,
          userid: userId,
        }
      });
      console.log('Web call started');
    }
  };

  const handleDisconnect = async () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
    console.log('Call ended');
  };

  const latestMessage = messages[messages.length-1]?.content;
  const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus ===
  CallStatus.FINISHED;

  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai_robot.jpeg"
              alt="vapi"
              width={110}
              height={100}
              className="object-cover rounded-full"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        <div className="card-border">
          <div className="card-content">
            <Image
              src="/nathan.png"
              alt="user avatar"
              width={540}
              height={540}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{userName}</h3>
            {userPhone && (
              <p className="text-sm text-gray-600 mt-1">
                Phone: {userPhone}
              </p>
            )}
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={latestMessage}
              className={cn(
                'transition-opacity duration-500 opacity-0',
                'animate-fadeIn opacity-100'
              )}
            >
              {latestMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
        {callStatus !== CallStatus.ACTIVE ? (
          <button className="relative btn-call" onClick={handleCall}>
            <span
              className={cn(
                'absolute animate-ping rounded-full opacity-75',
                callStatus !== CallStatus.CONNECTING && 'hidden'
              )}
            />
            <span className="relative">
              {callStatus === CallStatus.INACTIVE ||
              callStatus === CallStatus.FINISHED
                ? (userPhone ? 'Call Phone' : 'Call')
                : '. . .'}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={handleDisconnect}>
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;