"use client";

import { Copy, RefreshCw, Volume2, Check } from "lucide-react";
import { useState } from "react";

interface ReplyCardProps {
  suggestions: {
    short: string;
    natural: string;
    creative: string;
  };
  detectedMode?: string;
  onRegenerate: () => void;
}

const LANGUAGE_CODES: Record<string, string> = {
  English: "en-IN",
  Hindi: "hi-IN",
  Hinglish: "en-IN",
  Telugu: "te-IN",
  Marathi: "mr-IN",
  Gujarati: "gu-IN",
  Tamil: "ta-IN",
  Bengali: "bn-IN",
  Kannada: "kn-IN",
  Malayalam: "ml-IN",
  Punjabi: "pa-IN",
  Odia: "or-IN",
  Assamese: "as-IN",
  Urdu: "ur-IN",
};

export default function ReplyCard({
  suggestions,
  detectedMode,
  onRegenerate,
}: ReplyCardProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleTTS = (text: string) => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Detect the language from the generated text.
    const detectedLanguage =
      detectedMode?.toLowerCase().includes("hindi")
        ? "Hindi"
        : detectedMode?.toLowerCase().includes("telugu")
        ? "Telugu"
        : detectedMode?.toLowerCase().includes("marathi")
        ? "Marathi"
        : detectedMode?.toLowerCase().includes("gujarati")
        ? "Gujarati"
        : detectedMode?.toLowerCase().includes("tamil")
        ? "Tamil"
        : detectedMode?.toLowerCase().includes("bengali")
        ? "Bengali"
        : detectedMode?.toLowerCase().includes("kannada")
        ? "Kannada"
        : detectedMode?.toLowerCase().includes("malayalam")
        ? "Malayalam"
        : detectedMode?.toLowerCase().includes("punjabi")
        ? "Punjabi"
        : "English";

    const languageCode = LANGUAGE_CODES[detectedLanguage] || "en-IN";
    utterance.lang = languageCode;

    const voices = window.speechSynthesis.getVoices();

    // Prefer an exact language voice.
    const exactVoice = voices.find(
      (voice) => voice.lang.toLowerCase() === languageCode.toLowerCase()
    );

    // Otherwise prefer the same language family.
    const regionalVoice = voices.find(
      (voice) =>
        voice.lang.toLowerCase().startsWith(languageCode.split("-")[0].toLowerCase())
    );

    // For Indian languages, fall back to an Indian English voice.
    const indianEnglishVoice = voices.find(
      (voice) => voice.lang.toLowerCase() === "en-in"
    );

    utterance.voice = exactVoice || regionalVoice || indianEnglishVoice || null;
    utterance.rate = 0.95;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };

  const Option = ({
    type,
    text,
    label,
  }: {
    type: string;
    text: string;
    label: string;
  }) => (
    <div className="bg-white border rounded-xl p-4 mb-3 shadow-sm hover:border-blue-200 transition">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          {label}
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => handleTTS(text)}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
            title="Read Aloud"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleCopy(text, type)}
            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition"
            title="Copy"
          >
            {copied === type ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <p className="text-gray-800 font-medium">{text}</p>
    </div>
  );

  return (
    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
      <div className="flex justify-between items-center mb-4 px-1">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-gray-900">AI Suggestions</h4>

          {detectedMode && (
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
              Mode: {detectedMode}
            </span>
          )}
        </div>

        <button
          onClick={onRegenerate}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Regenerate
        </button>
      </div>

      <Option type="short" text={suggestions.short} label="Short" />
      <Option type="natural" text={suggestions.natural} label="Natural" />
      <Option type="creative" text={suggestions.creative} label="Creative" />
    </div>
  );
}
