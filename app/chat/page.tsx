"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Send, Trash2, MicOff, Loader2 } from "lucide-react";
import ReplyCard from "@/components/ReplyCard";

const LANGUAGES = [
  "English", "Hindi", "Gujarati", "Marathi", "Bengali", "Punjabi", 
  "Tamil", "Telugu", "Kannada", "Malayalam", "Odia", "Assamese", "Urdu"
];

const MODES = [
  "Friendly", "Flirty", "Professional", "Friends", "Funny", 
  "Caring", "Simple", "Confident", "Respectful", "Custom"
];

type Message = {
  id: string;
  role: "user" | "ai";
  content?: string; // For user messages
  suggestions?: { short: string; natural: string; creative: string; }; // For AI replies
  detectedMode?: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [incomingMessage, setIncomingMessage] = useState("");
  const [userIntent, setUserIntent] = useState("");
  const [language, setLanguage] = useState("English");
  const [mode, setMode] = useState("Friendly");
  const [isSmartMode, setIsSmartMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Voice Recording State
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [activeInput, setActiveInput] = useState<"incoming" | "intent">("incoming");

  useEffect(() => {
    // Setup Speech Recognition
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (activeInput === "incoming") {
            setIncomingMessage(prev => prev ? prev + " " + transcript : transcript);
          } else {
            setUserIntent(prev => prev ? prev + " " + transcript : transcript);
          }
          setIsRecording(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
          setError("Speech recognition failed. Please try again.");
          setTimeout(() => setError(null), 3000);
        };
        
        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      }
    }
  }, [activeInput]);

  const toggleRecording = (target: "incoming" | "intent") => {
    if (!recognitionRef.current) {
      setError("Speech recognition is not supported in your browser.");
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setActiveInput(target);
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error(err);
        setError("Microphone permission denied or in use.");
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  const generateReply = async (retry: boolean = false) => {
    if (!incomingMessage && !userIntent && !retry) {
      setError("Please provide a message or your intent.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setIsGenerating(true);
    setError(null);

    // Save user message to history if it's not a retry
    if (!retry) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "user",
        content: `Received: "${incomingMessage}" | Intent: "${userIntent}"`
      }]);
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incomingMessage,
          userIntent,
          mode,
          language,
          isSmartMode,
          history: messages.slice(-4) // Send last 4 messages for context
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate reply.');
      }

      setMessages(prev => {
        // If it was a retry, replace the last AI message, else append
        if (retry && prev.length > 0 && prev[prev.length - 1].role === "ai") {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            id: Date.now().toString(),
            role: "ai",
            suggestions: data.suggestions,
            detectedMode: data.detectedMode
          };
          return newMessages;
        }
        
        return [...prev, {
          id: Date.now().toString(),
          role: "ai",
          suggestions: data.suggestions,
          detectedMode: data.detectedMode
        }];
      });

      if (!retry) {
        setIncomingMessage("");
        setUserIntent("");
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="p-4 border-b flex justify-between items-center bg-white z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            iT
          </div>
          <h1 className="font-bold text-xl text-gray-900">IntroText AI</h1>
        </div>
        <button 
          onClick={() => setMessages([])}
          className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition"
          title="Clear Conversation"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </header>

      {/* Main Layout: Settings (Sidebar on desktop) + Chat */}
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        
        {/* Settings Sidebar */}
        <aside className="w-full md:w-80 border-r bg-gray-50 p-4 overflow-y-auto flex-shrink-0 flex flex-col gap-6">
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Smart Mode</label>
            <div className="flex items-center justify-between p-3 bg-white border rounded-xl">
              <span className="text-sm text-gray-600">Auto-detect best tone</span>
              <button 
                onClick={() => setIsSmartMode(!isSmartMode)}
                className={`w-12 h-6 rounded-full transition-colors relative ${isSmartMode ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform ${isSmartMode ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          {!isSmartMode && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Communication Mode</label>
              <select 
                value={mode} 
                onChange={(e) => setMode(e.target.value)}
                className="w-full p-2.5 border rounded-xl bg-white text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
              >
                {MODES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Language</label>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-2.5 border rounded-xl bg-white text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
            >
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          
        </aside>

        {/* Chat Area */}
        <main className="flex-1 flex flex-col bg-white">
          
          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <Send className="w-12 h-12 mb-4 opacity-20" />
                <p>No messages yet. Start by typing below!</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={msg.id} className={`flex flex-col max-w-2xl ${msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                  {msg.role === 'user' ? (
                    <div className="bg-blue-600 text-white p-3 px-5 rounded-2xl rounded-tr-sm shadow-sm inline-block max-w-full break-words">
                      {msg.content?.split(' | ').map((line, i) => <div key={i} className="text-sm">{line}</div>)}
                    </div>
                  ) : (
                    <div className="w-full">
                      {msg.suggestions && (
                        <ReplyCard 
                          suggestions={msg.suggestions} 
                          detectedMode={msg.detectedMode} 
                          onRegenerate={() => generateReply(true)} 
                        />
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
            {isGenerating && (
              <div className="flex items-center gap-2 text-gray-400 mr-auto p-4">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">AI is thinking...</span>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t">
            {error && (
              <div className="mb-3 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex justify-between items-center">
                <span>{error}</span>
                <button onClick={() => setError(null)} className="font-bold">&times;</button>
              </div>
            )}
            
            <div className="space-y-3 max-w-4xl mx-auto">
              {/* Incoming Message Input */}
              <div className="relative">
                <input 
                  type="text"
                  placeholder="What message did you receive?"
                  value={incomingMessage}
                  onChange={(e) => setIncomingMessage(e.target.value)}
                  className="w-full p-3.5 pr-12 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  onKeyDown={(e) => e.key === 'Enter' && generateReply(false)}
                />
                <button 
                  onClick={() => toggleRecording("incoming")}
                  className={`absolute right-3 top-3 p-1 rounded-md transition ${isRecording && activeInput === "incoming" ? "text-red-500 bg-red-50" : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"}`}
                >
                  {isRecording && activeInput === "incoming" ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              </div>

              {/* Intent Input */}
              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <input 
                    type="text"
                    placeholder="What do you want to say? (Situation / Intent)"
                    value={userIntent}
                    onChange={(e) => setUserIntent(e.target.value)}
                    className="w-full p-3.5 pr-12 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                    onKeyDown={(e) => e.key === 'Enter' && generateReply(false)}
                  />
                  <button 
                    onClick={() => toggleRecording("intent")}
                    className={`absolute right-3 top-3 p-1 rounded-md transition ${isRecording && activeInput === "intent" ? "text-red-500 bg-red-50" : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"}`}
                  >
                    {isRecording && activeInput === "intent" ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                </div>
                
                <button
                  onClick={() => generateReply(false)}
                  disabled={isGenerating || (!incomingMessage && !userIntent)}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 rounded-xl font-semibold transition shadow-sm flex items-center gap-2"
                >
                  {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  <span className="hidden sm:inline">Generate</span>
                </button>
              </div>
            </div>
          </div>
          
        </main>
      </div>
    </div>
  );
}
