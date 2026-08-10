"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { speakOneAgent, isSpeechSupported, stopSpeaking } from "@/lib/speech";
import { useTievoraStore } from "@/lib/store";

export default function AgentCard({ def, state, awakened }: any) {
  const { speakingId, setSpeakingId } = useTievoraStore();
  const [mounted, setMounted] = useState(false);
  useEffect(()=> setMounted(true), []);
  const isSpeaking = speakingId === def.id;
  const canSpeak = mounted && !!state?.insight && isSpeechSupported();
  const displayStatus = isSpeaking ? "speaking" : (state?.status || "idle");
  const statusColor: Record<string,string> = {
    idle: "bg-white/10 text-white/60",
    waking: "bg-amber-400/20 text-amber-300",
    thinking: "bg-sky-400/20 text-sky-300",
    streaming: "bg-violet-400/20 text-violet-300",
    done: "bg-emerald-400/20 text-emerald-300",
    speaking: "bg-emerald-500 text-white animate-pulse border-emerald-400",
  };
  const handleSpeak = async () => {
    if (isSpeaking) { stopSpeaking(); setSpeakingId(null); return; }
    setSpeakingId(def.id);
    await speakOneAgent({ id: def.id, name: def.name, office: def.office, insight: state.insight });
    setSpeakingId(null);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
      className={`glass rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden ${isSpeaking ? "ring-2 ring-emerald-400/50 glow-cyan" : ""}`}
    >
      <div className="absolute inset-0 opacity-[0.06]" style={{ background: `radial-gradient(400px at 20% 0%, ${def.color}, transparent)` }} />
      <div className="relative flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl grid place-items-center text-lg relative" style={{ background: `${def.color}22`, border: `1px solid ${def.color}40` }}>
            {def.icon}
            {isSpeaking && <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />}
          </div>
          <div>
            <div className="font-bold text-sm leading-none flex items-center gap-1">{def.name} {isSpeaking && <span className="text-[10px] px-1 rounded bg-emerald-500 text-white animate-pulse">SPEAKING</span>}</div>
            <div className="text-[11px] text-white/60">{def.role}</div>
            <div className="text-[11px] text-white/40">{def.office} • {def.country}</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {canSpeak && (
            <button onClick={handleSpeak} title={isSpeaking ? "Stop" : "Speak insight"} className={`w-7 h-7 grid place-items-center rounded-full border ${isSpeaking ? "bg-emerald-500 text-white border-emerald-500 animate-pulse" : "bg-white/10 border-white/10 hover:bg-white/15"}`}>
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          )}
          <span className={`text-[10px] px-2 py-1 rounded-full border ${statusColor[displayStatus]}`}>{displayStatus.toUpperCase()}</span>
        </div>
      </div>

      <div className="relative">
        <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
          <motion.div className="h-full rounded-full" style={{ background: def.color }} animate={{ width: `${state?.progress || 0}%` }} transition={{ duration: 0.5 }} />
        </div>
        <div className="text-[10px] text-white/40 mt-1 flex justify-between"><span>{isSpeaking ? "Speaking…" : awakened ? "Streaming…" : "Idle"}</span><span>{state?.progress || 0}%</span></div>
      </div>

      <div className={`relative min-h-[84px] rounded-xl p-3 text-xs leading-relaxed border ${isSpeaking ? "bg-emerald-500/10 border-emerald-400/30" : "bg-black/20 border-white/5"}`}>
        {state?.insight ? (
          <span className={isSpeaking ? "text-white font-medium" : "text-white/90"}>{state.insight}</span>
        ) : (
          <span className="text-white/40">{awakened ? "Waking up • checking office pulse…" : "Say “Hello Tievora” to wake this agent. It will scan its office and report to CEO."}</span>
        )}
        {isSpeaking && <div className="mt-2 flex gap-1"><span className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay:"0ms"}} /><span className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay:"150ms"}} /><span className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay:"300ms"}} /></div>}
      </div>

      {state?.logs?.length > 0 && (
        <div className="text-[11px] font-mono text-white/50 bg-black/20 rounded-lg p-2 border border-white/5">
          {state.logs.slice(-2).map((l: string, i: number)=><div key={i}>› {l}</div>)}
        </div>
      )}
    </motion.div>
  );
}
