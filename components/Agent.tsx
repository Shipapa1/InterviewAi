"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";

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

interface AgentComponentProps {
  userName: string;
  userId?: string;
  type: string;
  userPhone?: string;
  questions?: string[];
  interviewId?: string;
  feedbackId?: string;
}

const Agent = ({ userName, userId, type, userPhone, questions = [], interviewId, feedbackId }: AgentComponentProps) => {

  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [hasStartedQuestions, setHasStartedQuestions] = useState<boolean>(false);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState<boolean>(false);

  useEffect(() =>{
      const onCallStart = () => {
        setCallStatus(CallStatus.ACTIVE);
        // Persist that the interview has started if we have an interview id
        if (userId) {
          fetch('/api/interviews/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ interviewId, userId }),
          }).catch(() => {});
        }
        if (!hasStartedQuestions) {
          sendNextQuestion();
        }
      };
      
      const onCallEnd = async () => {
        setCallStatus(CallStatus.FINISHED);
        
        // Generate feedback if we have messages and an interview ID
        if (messages.length > 0 && interviewId && userId && !feedbackId) {
          await generateFeedback();
        }
      };

      const onMessage = (message: Message) => {
        if(message.type === 'transcript' && message.transcriptType == 'final'){
          const newMessage = { role: message.role, content: message.transcript}
          setMessages((prev) => [...prev, newMessage]);

          // When we receive the user's final answer, move to the next question
          if (message.role === 'user') {
            sendNextQuestion();
          }
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

  }, [messages, interviewId, userId, feedbackId])

  const generateFeedback = async () => {
    if (!interviewId || !userId || messages.length === 0) return;
    
    setIsGeneratingFeedback(true);
    
    try {
      const response = await fetch('/api/feedback/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewId,
          userId,
          transcript: messages,
        }),
      });
      
      if (response.ok) {
        const { feedbackId: newFeedbackId } = await response.json();
        // Redirect to feedback page
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        console.error('Failed to generate feedback');
        router.push('/');
      }
    } catch (error) {
      console.error('Error generating feedback:', error);
      router.push('/');
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  const handleDisconnect = async () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
    console.log('Call ended');
  };

  const sendNextQuestion = () => {
    if (!questions || questions.length === 0) return;

    setCurrentQuestionIndex((prev) => {
      const nextIndex = hasStartedQuestions ? prev + 1 : prev;
      const withinBounds = nextIndex < questions.length;

      if (!hasStartedQuestions) {
        setHasStartedQuestions(true);
      }

      if (withinBounds) {
        const q = questions[nextIndex];
        try {
          // Ask the next question as the assistant so it is spoken out loud
          // Many Vapi clients support sending an assistant message this way.
          // If your SDK exposes a different helper (e.g., vapi.say), swap accordingly.
          // @ts-ignore
          vapi.send({ type: 'add-message', role: 'assistant', content: q });
        } catch (err) {
          console.error('Failed to send next question', err);
        }
      } else {
        // No more questions; optionally end the call
        // setCallStatus(CallStatus.FINISHED);
      }

      return withinBounds ? nextIndex : prev;
    });
  };

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
            type,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Phone call initiated:', data.callId);
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

  const latestMessage = messages[messages.length-1]?.content;
  const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

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

      {isGeneratingFeedback && (
        <div className="text-center py-4">
          <p className="text-lg">Generating your feedback...</p>
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