import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/ui/Header";
import TranscriptPanel from "@/components/interview/TranscriptPanel";
import CodeEditorPanel from "@/components/interview/CodeEditorPanel";
import ProblemSelector from "@/components/interview/ProblemSelector";
import { Message } from "@/components/interview/ChatBubble";
import { InterviewStatus } from "@/components/interview/StatusIndicator";
import { CodingProblem, BehavioralQuestion, isCodingProblem } from "@/data/codingProblems";
import { Code2, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

// Type declarations for Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
    speechSynthesis: SpeechSynthesis;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare const SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

// Text-to-Speech types
interface SpeechSynthesis extends EventTarget {
  speak(utterance: SpeechSynthesisUtterance): void;
  cancel(): void;
  pause(): void;
  resume(): void;
  getVoices(): SpeechSynthesisVoice[];
  speaking: boolean;
  paused: boolean;
  pending: boolean;
}

interface SpeechSynthesisUtterance extends EventTarget {
  text: string;
  lang: string;
  voice: SpeechSynthesisVoice | null;
  volume: number;
  rate: number;
  pitch: number;
  onstart: ((this: SpeechSynthesisUtterance, ev: Event) => void) | null;
  onend: ((this: SpeechSynthesisUtterance, ev: Event) => void) | null;
  onerror: ((this: SpeechSynthesisUtterance, ev: Event) => void) | null;
}

interface SpeechSynthesisVoice {
  voiceURI: string;
  name: string;
  lang: string;
  localService: boolean;
  default: boolean;
}

const Interview = () => {
  const navigate = useNavigate();
  const [selectedProblem, setSelectedProblem] = useState<CodingProblem | BehavioralQuestion | null>(null);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<InterviewStatus>("idle");
  const [isRecording, setIsRecording] = useState(false);
  const [showCodePanel, setShowCodePanel] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [pendingAICall, setPendingAICall] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  const addMessage = useCallback((role: "ai" | "user", content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);
  
  const speakMessage = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => {
        setStatus('speaking');
      };
      
      utterance.onend = () => {
        setStatus('idle');
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setStatus('idle');
      };
      
      window.speechSynthesis.speak(utterance);
    }
  }, []);
  
  const callAI = useCallback(async (conversationMessages: Message[]) => {
    setStatus('thinking');
    try {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      if (!apiKey) {
        console.error('OpenRouter API key not found');
        const errorMessage = 'Sorry, I cannot respond right now. API key is missing.';
        addMessage('ai', errorMessage);
        speakMessage(errorMessage);
        return;
      }

      if (!selectedProblem) {
        console.error('No problem selected');
        const errorMessage = 'No problem selected for the interview.';
        addMessage('ai', errorMessage);
        speakMessage(errorMessage);
        return;
      }

      let systemMessage;
      
      if (isCodingProblem(selectedProblem)) {
        const codingProblem = selectedProblem as CodingProblem;
        systemMessage = {
          role: 'system',
          content: `You are conducting a coding interview for the following problem:

Title: ${codingProblem.title}

Difficulty: ${codingProblem.difficulty}

Description: ${codingProblem.description}

Examples:
${codingProblem.examples.map(ex => `- ${ex}`).join('\n')}

Test Cases:
${codingProblem.testCases.map(tc => `- Input: ${JSON.stringify(tc.input)}, Expected: ${JSON.stringify(tc.expected)}, Description: ${tc.description}`).join('\n')}

IMPORTANT: All code examples, hints, solutions, and discussions must be in JavaScript only. Do not mention or suggest solutions in any other programming language (Python, Java, etc.). When providing code snippets or algorithmic hints, always use JavaScript syntax and concepts.

Please act as a professional coding interviewer. Ask relevant questions about the candidate's approach, provide feedback on their JavaScript code, and guide them through solving this problem using JavaScript. Maintain a conversational tone and be encouraging.`
        };
      } else {
        const behavioralQuestion = selectedProblem as BehavioralQuestion;
        systemMessage = {
          role: 'system',
          content: `You are conducting a behavioral interview. The question being asked is:

Question: ${behavioralQuestion.title}

Description: ${behavioralQuestion.description}

Key Points to Look For in the Candidate's Answer:
${behavioralQuestion.suggestedAnswerPoints.map(point => `- ${point}`).join('\n')}

Please act as a professional behavioral interviewer. Ask follow-up questions to help the candidate elaborate on their answer. Listen for the key points above and provide constructive feedback. Be encouraging and help them develop their answer further if needed. Focus on understanding their approach, decision-making, and what they learned from the experience.`
        };
      }

      const apiMessages = [
        systemMessage,
        ...conversationMessages.map(m => ({ 
          role: m.role === 'ai' ? 'assistant' : m.role, 
          content: m.content 
        }))
      ];

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3-haiku',
          messages: apiMessages,
        }),
      });

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      addMessage('ai', aiResponse);
      speakMessage(aiResponse);
    } catch (error) {
      console.error('Error calling AI:', error);
      const errorMessage = 'Sorry, I encountered an error. Please try again.';
      addMessage('ai', errorMessage);
      speakMessage(errorMessage);
    }
  }, [addMessage, speakMessage, selectedProblem]);

  // Setup speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        addMessage('user', transcript);
        setPendingAICall(true);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setStatus('idle');
      };
    }
  }, [addMessage]);

  // Handle AI calls when user speaks
  useEffect(() => {
    if (pendingAICall && messages.length > 0 && messages[messages.length - 1].role === 'user') {
      callAI(messages);
      setPendingAICall(false);
    }
  }, [pendingAICall, messages, callAI]);
  
  const handleSelectProblem = (problem: CodingProblem | BehavioralQuestion) => {
    setSelectedProblem(problem);
  };

  const handleStartInterview = () => {
    if (selectedProblem) {
      setInterviewStarted(true);
      setStartTime(new Date());
      if (isCodingProblem(selectedProblem)) {
        setShowCodePanel(true); // Show code panel immediately so user can see the problem
      }
      // Add initial AI message
      const initialMessage = selectedProblem.aiConversation[0].content;
      addMessage('ai', initialMessage);
      speakMessage(initialMessage);
    }
  };
  
  const handleToggleRecording = () => {
    if (!isRecording) {
      // Stop any ongoing speech when starting recording
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (!recognitionRef.current) {
        alert('Speech recognition is not supported in this browser.');
        return;
      }
      setIsRecording(true);
      setIsListening(true);
      setStatus("listening");
      recognitionRef.current.start();
    } else {
      setIsRecording(false);
      setIsListening(false);
      setStatus("idle");
      recognitionRef.current?.stop();
    }
  };
  
  const handleEndInterview = () => {
    // Stop any ongoing speech
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    // Navigate back to problem selector
    navigate("/");
  };
  
  const handleCodeSubmit = (code: string) => {
    // Stop any ongoing speech
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    // Calculate actual interview metrics
    const endTime = new Date();
    const durationMs = startTime ? endTime.getTime() - startTime.getTime() : 0;
    const durationMinutes = Math.floor(durationMs / 60000);
    const durationSeconds = Math.floor((durationMs % 60000) / 1000);
    const duration = `${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`;
    
    // Count user messages (questions answered)
    const questionsAnswered = messages.filter(msg => msg.role === 'user').length;
    
    // Navigate to results with interview data
    navigate("/results", {
      state: {
        messages,
        duration,
        questionsAnswered,
        submittedCode: code,
      }
    });
  };

  // Show problem selector if interview hasn't started
  if (!interviewStarted) {
    return (
      <div className="flex flex-col bg-background min-h-screen">
        <Header />
        <main className="flex-1 pt-16">
          <div className="h-[calc(100vh-4rem)]">
            <ProblemSelector
              selectedProblem={selectedProblem}
              onSelectProblem={handleSelectProblem}
              onStartInterview={handleStartInterview}
            />
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col bg-background min-h-screen">
      <Header />
      
      <main className="flex-1 pt-16">
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Mode Tabs - Mobile */}
          <div className="md:hidden right-0 bottom-0 left-0 z-20 fixed flex bg-card/95 backdrop-blur-sm border-border border-t">
            <button
              onClick={() => setShowCodePanel(false)}
              className={cn(
                "flex flex-1 justify-center items-center gap-2 py-4 transition-colors",
                !showCodePanel ? "text-primary" : "text-muted-foreground"
              )}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium text-sm">Chat</span>
            </button>
            {selectedProblem && isCodingProblem(selectedProblem) && (
              <button
                onClick={() => setShowCodePanel(true)}
                className={cn(
                  "flex flex-1 justify-center items-center gap-2 py-4 transition-colors",
                  showCodePanel ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Code2 className="w-5 h-5" />
                <span className="font-medium text-sm">Code</span>
              </button>
            )}
          </div>
          
          {/* Desktop: Two Column Layout */}
          <div className="hidden md:flex flex-1">
            {/* Left Panel - Transcript */}
            <div className={cn(
              "bg-card border-border border-r transition-all duration-300",
              showCodePanel ? "w-1/2" : "w-full"
            )}>
              <TranscriptPanel
                messages={messages}
                status={status}
                isRecording={isRecording}
                onToggleRecording={handleToggleRecording}
                onEndInterview={handleEndInterview}
              />
            </div>
            
            {/* Right Panel - Code Editor */}
            {showCodePanel && selectedProblem && isCodingProblem(selectedProblem) && (
              <div className="w-1/2 animate-slide-in-right">
                <CodeEditorPanel
                  problem={selectedProblem as CodingProblem}
                  onSubmit={handleCodeSubmit}
                />
              </div>
            )}
          </div>
          
          {/* Mobile: Single Panel */}
          <div className="md:hidden flex-1 pb-16">
            {!showCodePanel ? (
              <TranscriptPanel
                messages={messages}
                status={status}
                isRecording={isRecording}
                onToggleRecording={handleToggleRecording}
                onEndInterview={handleEndInterview}
              />
            ) : selectedProblem ? (
              <CodeEditorPanel
                problem={selectedProblem}
                onSubmit={handleCodeSubmit}
              />
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Interview;
