"use client";
import { resources } from "@/lib/dummyData";

export default function ResourcePanel() {
  return (
    <div className="glass rounded-2xl p-4 md:p-6">
      <h3 className="font-bold">🧩 Resources • Attrition • Backup</h3>
      <p className="text-xs text-white/60 mt-1">Watchtower scans leaving risk. If backup missing, CEO gets alert + auto suggestion.</p>
      <div className="mt-4 grid gap-3 max-h-[520px] overflow-auto pr-1">
        {resources.map(r=>(
          <div key={r.id} className={`rounded-xl border p-3 flex gap-3 ${r.leavingRisk==="High"?"bg-red-500/10 border-red-500/20":"bg-[#0f1a33]/60 border-white/10"}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/15 to-white/5 grid place-items-center font-bold text-sm">{r.name.split(" ").map(s=>s[0]).join("")}</div>
            <div className="flex-1">
              <div className="text-sm font-semibold">{r.name} <span className="text-white/50 font-normal">• {r.role}</span></div>
              <div className="text-xs text-white/50">{r.office} • {r.country}/{r.state} • {r.utilization}% util</div>
              <div className="text-xs mt-1 text-white/80 line-clamp-2">› {r.lastLog}</div>
              <div className="flex flex-wrap gap-1 mt-2">
                {r.skills.map(s=><span key={s} className="text-[10px] px-2 py-1 rounded-full bg-white/10 border border-white/10">{s}</span>)}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={`text-[10px] px-2 py-1 rounded-full border ${r.leavingRisk==="High"?"bg-red-500/20 text-red-300 border-red-500/30":r.leavingRisk==="Medium"?"bg-amber-500/20 text-amber-300 border-amber-500/30":"bg-emerald-500/15 text-emerald-300 border-emerald-500/20"}`}>{r.leavingRisk} RISK</span>
              <span className={`text-[11px] ${r.backup?"text-emerald-300":"text-red-300 font-bold"}`}>{r.backup?`Backup: ${r.backup}`:"⚠ NO BACKUP"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
