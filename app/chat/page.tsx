"use client";

import { useState, useRef, useEffect } from "react";
import {
  Mic,
  Send,
  Trash2,
  MicOff,
  Loader2,
  Sparkles,
  ArrowLeft,
  Brain,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import ReplyCard from "@/components/ReplyCard";

const LANGUAGES = [
  "English",
  "Hindi",
  "Gujarati",
  "Marathi",
  "Bengali",
  "Punjabi",
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Odia",
  "Assamese",
  "Urdu",
];

const MODES = [
  "Friendly",
  "Flirty",
  "Professional",
  "Friends",
  "Funny",
  "Caring",
  "Simple",
  "Confident",
  "Respectful",
  "Custom",
];

type Message = {
  id: string;
  role: "user" | "ai";
  content?: string;
  suggestions?: {
    short: string;
    natural: string;
    creative: string;
  };
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

  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [activeInput, setActiveInput] =
    useState<"incoming" | "intent">("incoming");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;

          if (activeInput === "incoming") {
            setIncomingMessage((prev) =>
              prev ? prev + " " + transcript : transcript
            );
          } else {
            setUserIntent((prev) =>
              prev ? prev + " " + transcript : transcript
            );
          }

          setIsRecording(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
          setError("Couldn't hear that. Try again.");
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
      setError("Voice input isn't supported in this browser.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    setActiveInput(target);

    try {
      recognitionRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      setError("Microphone is already in use.");
      setTimeout(() => setError(null), 3000);
    }
  };

  const generateReply = async (retry: boolean = false) => {
    if (!incomingMessage && !userIntent && !retry) {
      setError("Tell me what they said or what you want to say.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setIsGenerating(true);
    setError(null);

    if (!retry) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "user",
          content: `Received: "${incomingMessage}" | Intent: "${userIntent}"`,
        },
      ]);
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          incomingMessage,
          userIntent,
          mode,
          language,
          isSmartMode,
          history: messages.slice(-4),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate reply.");
      }

      setMessages((prev) => {
        if (
          retry &&
          prev.length > 0 &&
          prev[prev.length - 1].role === "ai"
        ) {
          const updated = [...prev];

          updated[updated.length - 1] = {
            id: Date.now().toString(),
            role: "ai",
            suggestions: data.suggestions,
            detectedMode: data.detectedMode,
          };

          return updated;
        }

        return [
          ...prev,
          {
            id: Date.now().toString(),
            role: "ai",
            suggestions: data.suggestions,
            detectedMode: data.detectedMode,
          },
        ];
      });

      if (!retry) {
        setIncomingMessage("");
        setUserIntent("");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fafafa] text-zinc-900">

      {/* NAVBAR */}

      <nav className="sticky top-0 z-50 border-b border-black/5 bg-[#fafafa]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">

          <Link
            href="/"
            className="group flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-sm font-black text-white transition group-hover:scale-105">
              iT
            </div>

            <div>
              <p className="font-bold tracking-tight">
                IntroText
              </p>

              <p className="hidden text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 sm:block">
                Conversation wingman
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">

            <div className="hidden items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-500 sm:flex">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              AI ready
            </div>

            <button
              onClick={() => setMessages([])}
              className="rounded-full border border-zinc-200 bg-white p-2.5 text-zinc-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
              title="Clear conversation"
            >
              <Trash2 className="h-4 w-4" />
            </button>

          </div>
        </div>
      </nav>

      {/* MAIN */}

      <div className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl grid-cols-1 lg:grid-cols-[280px_1fr]">

        {/* SETTINGS */}

        <aside className="border-b border-zinc-200 px-5 py-6 lg:border-b-0 lg:border-r lg:px-6">

          <div className="mb-8">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-blue-600">
              Your settings
            </p>

            <h2 className="text-2xl font-black tracking-tight">
              Find your voice.
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-zinc-500">
              Pick a vibe and let IntroText handle the awkward part.
            </p>
          </div>

          {/* SMART MODE */}

          <div className="mb-6 rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Brain className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-bold">
                    Smart Mode
                  </p>

                  <p className="text-[11px] text-zinc-400">
                    Let AI read the vibe
                  </p>
                </div>

              </div>

              <button
                onClick={() => setIsSmartMode(!isSmartMode)}
                className={`relative h-6 w-11 rounded-full transition ${
                  isSmartMode
                    ? "bg-zinc-900"
                    : "bg-zinc-200"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                    isSmartMode
                      ? "left-6"
                      : "left-1"
                  }`}
                />
              </button>

            </div>
          </div>

          {/* MODE */}

          {!isSmartMode && (
            <div className="mb-6">

              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">
                Communication mode
              </label>

              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
              >
                {MODES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

            </div>
          )}

          {/* LANGUAGE */}

          <div>

            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">
              Language
            </label>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
            >
              {LANGUAGES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

          </div>

          <div className="mt-8 hidden rounded-3xl bg-zinc-900 p-5 text-white lg:block">

            <Sparkles className="mb-5 h-5 w-5 text-blue-400" />

            <p className="text-sm font-bold">
              Context first.
            </p>

            <p className="mt-1 text-xs leading-relaxed text-zinc-500">
              IntroText tries to understand what you mean before suggesting what to say.
            </p>

          </div>

        </aside>

        {/* CHAT */}

        <section className="flex min-h-[calc(100vh-73px)] flex-col">

          {/* CHAT HEADER */}

          <div className="border-b border-zinc-200 px-5 py-5 sm:px-8">

            <div className="mx-auto max-w-4xl">

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
                Your conversation
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                What happened?
              </h1>

              <p className="mt-2 text-sm text-zinc-500">
                Tell me what they said. I'll help you figure out what to say next.
              </p>

            </div>

          </div>

          {/* MESSAGES */}

          <div className="flex-1 overflow-y-auto px-5 py-8 sm:px-8">

            <div className="mx-auto max-w-4xl">

              {messages.length === 0 ? (

                <div className="flex min-h-[380px] flex-col items-center justify-center text-center">

                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-zinc-900 text-white shadow-xl">
                    <MessageCircle className="h-7 w-7" />
                  </div>

                  <h2 className="text-2xl font-black tracking-tight">
                    Nothing awkward here.
                  </h2>

                  <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-500">
                    Paste the message you received below,
                    tell me what you actually want to say,
                    and we'll take it from there.
                  </p>

                  <div className="mt-7 flex flex-wrap justify-center gap-2">

                    {[
                      "“we need to talk.”",
                      "“k”",
                      "“okay 👍”",
                    ].map((text) => (
                      <button
                        key={text}
                        onClick={() => setIncomingMessage(text.replaceAll("“", "").replaceAll("”", ""))}
                        className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-500 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:text-zinc-900"
                      >
                        {text}
                      </button>
                    ))}

                  </div>

                </div>

              ) : (

                <div className="space-y-8">

                  {messages.map((msg) => (

                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >

                      {msg.role === "user" ? (

                        <div className="max-w-[85%]">

                          <p className="mb-2 text-right text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                            You
                          </p>

                          <div className="rounded-3xl rounded-tr-md bg-zinc-900 px-5 py-4 text-sm leading-relaxed text-white shadow-lg">
                            {msg.content
                              ?.split(" | ")
                              .map((line, index) => (
                                <div key={index}>
                                  {line}
                                </div>
                              ))}
                          </div>

                        </div>

                      ) : (

                        <div className="w-full max-w-2xl">

                          <div className="mb-3 flex items-center gap-2">

                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-[10px] font-black text-white">
                              iT
                            </div>

                            <span className="text-xs font-bold text-zinc-500">
                              IntroText
                            </span>

                            {msg.detectedMode && (
                              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-600">
                                {msg.detectedMode}
                              </span>
                            )}

                          </div>

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

                  ))}

                </div>

              )}

              {isGenerating && (

                <div className="mt-8 flex items-center gap-3">

                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 text-white">
                    <Sparkles className="h-4 w-4" />
                  </div>

                  <div className="rounded-2xl bg-white px-4 py-3 text-sm text-zinc-400 shadow-sm ring-1 ring-zinc-200">
                    Thinking about the vibe...
                  </div>

                  <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />

                </div>

              )}

            </div>

          </div>

          {/* INPUT */}

          <div className="border-t border-zinc-200 bg-[#fafafa]/95 px-5 py-5 backdrop-blur-xl sm:px-8">

            <div className="mx-auto max-w-4xl">

              {error && (

                <div className="mb-3 flex items-center justify-between rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">

                  <span>{error}</span>

                  <button
                    onClick={() => setError(null)}
                    className="font-bold"
                  >
                    ×
                  </button>

                </div>

              )}

              <div className="rounded-[1.75rem] border border-zinc-200 bg-white p-3 shadow-xl shadow-zinc-200/40">

                {/* RECEIVED MESSAGE */}

                <div className="relative">

                  <div className="mb-1 px-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    They said
                  </div>

                  <input
                    type="text"
                    value={incomingMessage}
                    onChange={(e) =>
                      setIncomingMessage(e.target.value)
                    }
                    placeholder="Paste the message you received..."
                    className="w-full rounded-2xl bg-zinc-50 px-4 py-3.5 pr-12 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      generateReply(false)
                    }
                  />

                  <button
                    onClick={() =>
                      toggleRecording("incoming")
                    }
                    className={`absolute right-3 bottom-2.5 rounded-xl p-2 transition ${
                      isRecording &&
                      activeInput === "incoming"
                        ? "bg-red-50 text-red-500"
                        : "text-zinc-400 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    {isRecording &&
                    activeInput === "incoming" ? (
                      <MicOff className="h-4 w-4" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </button>

                </div>

                {/* INTENT */}

                <div className="relative mt-3">

                  <div className="mb-1 px-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    You want to say
                  </div>

                  <input
                    type="text"
                    value={userIntent}
                    onChange={(e) =>
                      setUserIntent(e.target.value)
                    }
                    placeholder="What are you actually trying to say?"
                    className="w-full rounded-2xl bg-zinc-50 px-4 py-3.5 pr-12 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      generateReply(false)
                    }
                  />

                  <button
                    onClick={() =>
                      toggleRecording("intent")
                    }
                    className={`absolute right-3 bottom-2.5 rounded-xl p-2 transition ${
                      isRecording &&
                      activeInput === "intent"
                        ? "bg-red-50 text-red-500"
                        : "text-zinc-400 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    {isRecording &&
                    activeInput === "intent" ? (
                      <MicOff className="h-4 w-4" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </button>

                </div>

                {/* GENERATE */}

                <button
                  onClick={() => generateReply(false)}
                  disabled={
                    isGenerating ||
                    (!incomingMessage && !userIntent)
                  }
                  className="group mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-5 py-3.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
                >

                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Thinking...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 text-blue-300" />
                      Help me reply
                      <Send className="h-4 w-4 transition group-hover:translate-x-1" />
                    </>
                  )}

                </button>

              </div>

              <p className="mt-3 text-center text-[10px] text-zinc-400">
                IntroText helps you find the words. You decide what to send.
              </p>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}