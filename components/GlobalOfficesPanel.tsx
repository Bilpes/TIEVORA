"use client";
import { offices } from "@/lib/dummyData";

export default function GlobalOfficesPanel() {
  return (
    <div className="glass rounded-2xl p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold">🌍 Offices • Every Country & State</h3>
        <span className="text-xs px-2 py-1 rounded-full bg-white/10">{offices.length} offices</span>
      </div>
      <p className="text-xs text-white/60 mt-1">When you say Hello Tievora, each office's agent wakes and pulses here. Tap a card to see live pulse.</p>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-auto pr-1">
        {offices.map(o => (
          <div key={o.id} className="rounded-xl bg-[#0f1a33]/60 border border-white/10 p-3 flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4a843]/30 to-[#3dd5d6]/30 grid place-items-center text-xs font-bold">{o.id}</div>
            <div className="flex-1">
              <div className="text-sm font-semibold">{o.city} <span className="text-white/50 font-normal">• {o.country} / {o.state}</span></div>
              <div className="text-[11px] text-white/60">{o.headcount} people • {o.projects} projects</div>
              <div className="text-xs mt-1 text-emerald-200/90">› {o.pulse}</div>
            </div>
            <div className="w-2 h-2 mt-2 bg-emerald-400 rounded-full animate-pulse" />
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-xl bg-amber-400/10 border border-amber-400/20 p-3 text-xs">
        <b className="text-amber-300">CEO Tip:</b> <span className="text-white/80">Offices turn amber/red when their agent detects risk. Watch Dubai (no backup) & Singapore (delay).</span>
      </div>
    </div>
  );
}
