"use client";
import { projects } from "@/lib/dummyData";

export default function ProjectTimeline() {
  return (
    <div className="glass rounded-2xl p-4 md:p-6 overflow-x-auto">
      <div className="flex items-center justify-between">
        <h3 className="font-bold">📅 Projects • Status • Deadline</h3>
        <span className="text-xs text-white/50">Deadline Adherence 82%</span>
      </div>
      <div className="mt-4 grid gap-3">
        <div className="hidden md:grid grid-cols-[1.6fr_0.8fr_0.6fr_0.7fr_0.6fr] text-[11px] tracking-widest text-white/40 px-2">
          <span>PROJECT</span><span>STATUS</span><span>DEADLINE</span><span>PROGRESS</span><span>P/L</span>
        </div>
        {projects.map(p=>(
          <div key={p.id} className="rounded-xl bg-[#0f1a33]/60 border border-white/10 p-3 md:px-4 md:py-3 grid md:grid-cols-[1.6fr_0.8fr_0.6fr_0.7fr_0.6fr] gap-2 items-center">
            <div>
              <div className="font-semibold text-sm">{p.name} <span className="text-white/40 font-normal">• {p.client}</span></div>
              <div className="text-xs text-white/50">{p.office} • {p.region} • {p.team} members</div>
            </div>
            <div>
              <span className={`text-xs px-2 py-1 rounded-full border ${p.status==="On Track"?"bg-emerald-500/15 text-emerald-300 border-emerald-500/20":p.status==="At Risk"?"bg-amber-500/15 text-amber-300 border-amber-500/20":p.status==="Delayed"?"bg-red-500/15 text-red-300 border-red-500/20":"bg-white/10 text-white/60"}`}>{p.status}</span>
              <div className="text-[11px] text-white/40 mt-1 md:hidden">Deadline {p.deadline}</div>
            </div>
            <div className="hidden md:block text-sm">{p.deadline}</div>
            <div>
              <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#d4a843] to-[#3dd5d6]" style={{ width: `${p.progress}%` }} />
              </div>
              <div className="text-[11px] text-white/50 mt-1">{p.progress}%</div>
            </div>
            <div className={`text-sm font-bold ${p.profit<0?"text-red-300":"text-emerald-300"}`}>{p.profit<0?"-":"+"}${Math.abs(p.profit).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
