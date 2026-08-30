import Link from "next/link";
import { MessageSquare, Mic, Sparkles, Languages, Heart, Briefcase, Users, Brain, Zap } from "lucide-react";

export default function LandingPage() {
  const features = [
    { title: "AI Reply Generator", icon: <MessageSquare className="w-6 h-6" />, desc: "Instantly generate 3 contextual responses to any message." },
    { title: "12+ Indian Languages", icon: <Languages className="w-6 h-6" />, desc: "Native support for Hindi, Gujarati, Marathi, Bengali, and more." },
    { title: "Voice Assistant", icon: <Mic className="w-6 h-6" />, desc: "Speak your thoughts and let the AI draft the perfect text." },
    { title: "Flirting Mode", icon: <Heart className="w-6 h-6" />, desc: "Playful and charming replies to keep the conversation going." },
    { title: "Professional Mode", icon: <Briefcase className="w-6 h-6" />, desc: "Formal and respectful texts for work or academic settings." },
    { title: "Friends Mode", icon: <Users className="w-6 h-6" />, desc: "Casual, fun, and natural replies for your close ones." },
    { title: "Smart Mode", icon: <Brain className="w-6 h-6" />, desc: "Automatically detects context and adjusts tone on the fly." },
    { title: "Context-Aware Replies", icon: <Zap className="w-6 h-6" />, desc: "Understands previous messages and relationships effortlessly." },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-5xl px-6 py-24 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6">
          IntroText <span className="text-blue-600">AI</span>
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-8">
          "Never get stuck on what to say."
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Your AI-powered communication assistant that helps you understand, reply, and communicate with confidence.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/chat"
            className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl w-full sm:w-auto justify-center"
          >
            <Sparkles className="w-5 h-5" />
            Try IntroText AI
          </Link>
          <Link 
            href="/chat?voice=true"
            className="flex items-center gap-2 px-8 py-4 bg-white text-blue-600 border border-blue-200 rounded-full font-semibold hover:bg-blue-50 transition shadow-sm w-full sm:w-auto justify-center"
          >
            <Mic className="w-5 h-5" />
            Use Voice Assistant
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-16">
            Everything you need to talk flawlessly
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feat, idx) => (
              <div key={idx} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-100 hover:shadow-md transition">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                  {feat.icon}
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{feat.title}</h4>
                <p className="text-gray-600 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="w-full py-8 text-center text-gray-500 border-t bg-gray-50 mt-auto">
        <p>&copy; {new Date().getFullYear()} IntroText AI. Built to help you communicate.</p>
      </footer>
    </div>
  );
}
