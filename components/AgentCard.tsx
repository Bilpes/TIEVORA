"use client";
import { motion } from "framer-motion";

export default function AgentCard({ def, state, awakened }: any) {
  const statusColor: Record<string,string> = {
    idle: "bg-white/10 text-white/60",
    waking: "bg-amber-400/20 text-amber-300",
    thinking: "bg-sky-400/20 text-sky-300",
    streaming: "bg-violet-400/20 text-violet-300",
    done: "bg-emerald-400/20 text-emerald-300",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
      className="glass rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-[0.06]" style={{ background: `radial-gradient(400px at 20% 0%, ${def.color}, transparent)` }} />
      <div className="relative flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl grid place-items-center text-lg" style={{ background: `${def.color}22`, border: `1px solid ${def.color}40` }}>{def.icon}</div>
          <div>
            <div className="font-bold text-sm leading-none">{def.name}</div>
            <div className="text-[11px] text-white/60">{def.role}</div>
            <div className="text-[11px] text-white/40">{def.office} • {def.country}</div>
          </div>
        </div>
        <span className={`text-[10px] px-2 py-1 rounded-full border ${statusColor[state?.status || "idle"]}`}>{(state?.status || "idle").toUpperCase()}</span>
      </div>

      <div className="relative">
        <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
          <motion.div className="h-full rounded-full" style={{ background: def.color }} animate={{ width: `${state?.progress || 0}%` }} transition={{ duration: 0.5 }} />
        </div>
        <div className="text-[10px] text-white/40 mt-1 flex justify-between"><span>{awakened ? "Streaming…" : "Idle"}</span><span>{state?.progress || 0}%</span></div>
      </div>

      <div className="relative min-h-[84px] rounded-xl bg-black/20 border border-white/5 p-3 text-xs leading-relaxed">
        {state?.insight ? (
          <span className="text-white/90">{state.insight}</span>
        ) : (
          <span className="text-white/40">{awakened ? "Waking up • checking office pulse…" : "Say “Hello Tievora” to wake this agent. It will scan its office and report to CEO."}</span>
        )}
      </div>

      {state?.logs?.length > 0 && (
        <div className="text-[11px] font-mono text-white/50 bg-black/20 rounded-lg p-2 border border-white/5">
          {state.logs.slice(-2).map((l: string, i: number)=><div key={i}>› {l}</div>)}
        </div>
      )}
    </motion.div>
  );
}
