"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, Brain, MessageCircle, Sparkles } from "lucide-react";
import { useRef } from "react";

const scenes = [
  {
    received: "we need to talk.",
    thought: "Wait... what happened? 😭",
    reply: "Sure. What's up? I'm listening.",
  },
  {
    received: "k",
    thought: "Bro... just 'k'? 💀",
    reply: "Haha, I feel like that 'k' has a story behind it 😂",
  },
  {
    received: "okay 👍",
    thought: "Is that actually okay?",
    reply: "Alright 😄 but now I'm curious what you're really thinking.",
  },
];

const modes = [
  ["Friendly", "Natural & easy-going"],
  ["Flirty", "Confident, playful & smooth"],
  ["Professional", "Clear & respectful"],
  ["Funny", "Turn awkward into fun"],
  ["Caring", "A little more heart"],
  ["Smart Mode", "Let AI read the vibe"],
];

function Scene({ scene, index }: { scene: typeof scenes[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0.15, 0.35, 0.7, 0.9], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0.15, 0.35, 0.7, 0.9], [0.85, 1, 1, 0.9]);
  const y = useTransform(scrollYProgress, [0.15, 0.35], [80, 0]);

  return (
    <div ref={ref} className="relative min-h-[85vh] flex items-center justify-center">
      <motion.div
        style={{ opacity, scale, y }}
        className="w-full max-w-3xl"
      >
        <div className="mb-5 flex items-center justify-between text-xs font-bold uppercase tracking-[0.25em] text-zinc-400">
          <span>Situation 0{index + 1}</span>
          <span>IntroText AI</span>
        </div>

        <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-xl sm:p-10">
          <div className="flex justify-end">
            <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-zinc-900 px-5 py-4 text-lg font-semibold text-white">
              {scene.received}
            </div>
          </div>

          <div className="my-10 flex items-center gap-4">
            <div className="h-px flex-1 bg-zinc-200" />
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Your brain
            </span>
            <div className="h-px flex-1 bg-zinc-200" />
          </div>

          <div className="rounded-2xl bg-zinc-50 p-5">
            <p className="text-xl font-semibold text-zinc-700 sm:text-2xl">
              {scene.thought}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/60 p-5"
          >
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600">
              <Sparkles className="h-4 w-4" />
              Human-like suggestion
            </div>
            <p className="text-lg leading-relaxed text-zinc-800">
              {scene.reply}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.82]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fafafa] text-zinc-900">

      {/* NAVIGATION */}
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-black/5 bg-[#fafafa]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-sm font-black text-white">
              iT
            </div>
            <span className="font-bold tracking-tight">IntroText</span>
          </div>

          <Link
            href="/chat"
            className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:scale-105"
          >
            Try it →
          </Link>
        </div>
      </nav>

      {/* HERO — reacts while scrolling */}
      <section
        ref={heroRef}
        className="relative flex min-h-[120vh] items-start justify-center px-6 pt-32"
      >
        <motion.div
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="sticky top-0 flex min-h-screen w-full items-center justify-center"
        >
          <div className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-200/30 blur-3xl" />

          <div className="relative max-w-5xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-600 shadow-sm"
            >
              <Sparkles className="h-4 w-4" />
              Your conversation wingman
            </motion.div>

            <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.05em] sm:text-7xl md:text-8xl">
              You know what
              <br />
              you want to say.
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-xl leading-relaxed text-zinc-500 sm:text-2xl">
              You just don't know{" "}
              <span className="font-semibold text-zinc-900">
                how to say it.
              </span>
            </p>

            <Link
              href="/chat"
              className="group mt-10 inline-flex items-center gap-3 rounded-full bg-zinc-900 px-7 py-4 font-semibold text-white shadow-xl transition hover:-translate-y-1"
            >
              Help me reply
              <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
            </Link>

            <div className="mt-20 flex flex-col items-center text-zinc-400">
              <span className="text-xs uppercase tracking-[0.3em]">
                scroll to see what happens
              </span>
              <ArrowDown className="mt-3 h-5 w-5 animate-bounce" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* PROBLEM */}
      <section className="px-6 py-32">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
            The problem
          </p>

          <h2 className="max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
            One tiny message.
            <br />
            <span className="text-zinc-400">
              A hundred thoughts in your head.
            </span>
          </h2>

          <div className="mt-10 flex items-center gap-3 text-zinc-400">
            <MessageCircle className="h-5 w-5" />
            <span>Keep scrolling.</span>
          </div>
        </div>
      </section>

      {/* SCROLL STORY */}
      <section className="bg-zinc-50 px-6 py-10">
        <div className="mx-auto max-w-4xl">
          {scenes.map((scene, index) => (
            <Scene key={scene.received} scene={scene} index={index} />
          ))}
        </div>
      </section>

      {/* AI PHILOSOPHY */}
      <section className="bg-zinc-900 px-6 py-36 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-16 md:grid-cols-2 md:items-center">
            <div>
              <p className="mb-5 text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
                The IntroText difference
              </p>

              <h2 className="text-4xl font-black tracking-tight sm:text-6xl">
                Not robotic.
                <br />
                <span className="text-zinc-500">Not generic.</span>
              </h2>
            </div>

            <div className="space-y-8">
              <p className="text-xl leading-relaxed text-zinc-400">
                IntroText focuses on the situation, your intention and the
                tone you want before suggesting a reply.
              </p>

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <Brain className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="font-bold text-white">Context first.</p>
                  <p className="text-sm text-zinc-500">AI second.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODES */}
      <section className="px-6 py-36">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
            Find your voice
          </p>

          <h2 className="text-4xl font-black tracking-tight sm:text-6xl">
            Same situation.
            <br />
            <span className="text-zinc-400">Different you.</span>
          </h2>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modes.map(([title, description], index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group rounded-3xl border border-zinc-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-10 text-sm font-bold text-zinc-300">
                  0{index + 1}
                </div>

                <h3 className="text-2xl font-bold">{title}</h3>
                <p className="mt-2 text-zinc-500">{description}</p>

                <ArrowRight className="mt-8 h-5 w-5 text-zinc-300 transition group-hover:translate-x-2 group-hover:text-zinc-900" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 py-40 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-4xl"
        >
          <p className="mb-6 text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
            Your next message is waiting
          </p>

          <h2 className="text-5xl font-black tracking-[-0.04em] sm:text-7xl">
            Stop staring at the keyboard.
          </h2>

          <p className="mx-auto mt-7 max-w-xl text-xl text-zinc-500">
            Start the conversation.
          </p>

          <Link
            href="/chat"
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-zinc-900 px-8 py-4 font-bold text-white shadow-xl transition hover:-translate-y-1"
          >
            Open IntroText AI
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </section>

      <footer className="border-t border-zinc-200 px-6 py-8 text-center text-sm text-zinc-400">
        © {new Date().getFullYear()} IntroText AI · Built for conversations that matter.
      </footer>
    </main>
  );
}
