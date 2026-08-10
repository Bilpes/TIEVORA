"use client";
import { useEffect, useRef, useState } from "react";
import { Mic, Sparkles, RotateCcw } from "lucide-react";
import { useTiaraStore } from "@/lib/store";
import { agentDefs } from "@/lib/agents";

export default function WakeBar() {
  const { awakened, triggerAwaken, reset, updateAgent } = useTiaraStore();
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const wake = (word: string) => {
    triggerAwaken(word);
    // Simulate parallel streaming via SSE fallback + local simulation
    startParallelSimulation(word);
  };

  const startParallelSimulation = (word: string) => {
    // Try SSE; fallback to local timeout simulation if fails
    let sseFailed = false;
    try {
      const es = new EventSource(`/api/agents/stream?word=${encodeURIComponent(word)}`);
      es.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.type === "agent") {
            updateAgent(data.id, { status: data.status, progress: data.progress, insight: data.insight, logs: data.logs });
          }
          if (data.type === "done") es.close();
        } catch {}
      };
      es.onerror = () => {
        sseFailed = true;
        es.close();
        localSim();
      };
      setTimeout(() => {
        if (es.readyState === 0) { es.close(); localSim(); }
      }, 800);
    } catch {
      localSim();
    }

    function localSim() {
      agentDefs.forEach((agent, idx) => {
        updateAgent(agent.id, { status: "waking", progress: 10, logs: [`[${agent.office}] Wake signal received…`] });
        setTimeout(() => updateAgent(agent.id, { status: "thinking", progress: 45, logs: [`Scanning ${agent.office} projects & resources…`] }), 400 + idx * 120);
        setTimeout(() => updateAgent(agent.id, { status: "streaming", progress: 80, logs: [`Synthesizing insight…`] }), 900 + idx * 120);
        setTimeout(() => updateAgent(agent.id, { status: "done", progress: 100, insight: agent.insight(), logs: [`✓ Insight ready for CEO`] }), 1500 + idx * 180);
      });
    }
  };

  const checkWakeWord = (text: string) => {
    const t = text.toLowerCase();
    if (t.includes("hello tiara") || t.includes("hi tiara") || t.includes("hey tiara")) {
      if (!awakened) wake(text);
      return true;
    }
    return false;
  };

  const startListening = () => {
    const SR: any = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) {
      alert("Voice not supported in this browser — type Hello Tiara and press Enter.");
      return;
    }
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-US";
    recognitionRef.current = rec;
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onresult = (e: any) => {
      const transcript = Array.from(e.results).map((r: any) => r[0].transcript).join(" ");
      setInput(transcript);
      checkWakeWord(transcript);
    };
    rec.onerror = () => setListening(false);
    rec.start();
  };

  useEffect(() => {
    // keyboard shortcut: press / to focus
    const h = (e: KeyboardEvent) => { if (e.key === "/" ) { e.preventDefault(); document.getElementById("wake-input")?.focus(); } };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            id="wake-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (!checkWakeWord(input)) {
                  // still allow manual trigger if contains hello/hi
                  if (input.trim().length > 2) wake(input);
                }
              }
            }}
            placeholder='Type “Hello Tiara” or “Hi Tiara” and press Enter — or tap mic'
            className="w-full h-12 md:h-14 rounded-2xl bg-[#0f1a33] border border-white/15 px-4 md:px-5 pr-28 text-sm md:text-base outline-none focus:border-[#d4a843]/50 placeholder:text-white/40"
          />
          <button
            onClick={startListening}
            className={`absolute right-2 top-2 h-8 md:h-10 px-3 rounded-xl flex items-center gap-2 text-sm font-semibold transition ${listening ? "bg-red-500 text-white animate-pulse" : "bg-[#d4a843] text-[#0a0f1e] hover:brightness-110"}`}
          >
            <Mic className="w-4 h-4" /> {listening ? "Listening…" : "Voice"}
          </button>
        </div>
        <button
          onClick={() => checkWakeWord(input) || (input && wake(input))}
          className="h-12 md:h-14 px-5 md:px-7 rounded-2xl bg-gradient-to-br from-[#d4a843] to-[#c08a1e] text-[#0a0f1e] font-black flex items-center gap-2 hover:brightness-110 whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4" /> Awaken
        </button>
        {awakened && (
          <button onClick={() => reset()} className="h-12 md:h-14 w-12 md:w-14 grid place-items-center rounded-2xl bg-white/10 border border-white/10">
            <RotateCcw className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="text-[11px] text-white/50 flex flex-wrap gap-2 items-center">
        <span>Try:</span>
        <button onClick={() => { setInput("Hello Tiara"); wake("Hello Tiara"); }} className="px-2 py-1 rounded-full bg-white/10 hover:bg-white/15">Hello Tiara 👋</button>
        <button onClick={() => { setInput("Hi Tiara, what's the profit today?"); wake("Hi Tiara"); }} className="px-2 py-1 rounded-full bg-white/10 hover:bg-white/15">Hi Tiara — profit?</button>
        <span className="hidden md:inline text-white/30">• Press “/” to focus • Mobile mic friendly</span>
      </div>
    </div>
  );
}
