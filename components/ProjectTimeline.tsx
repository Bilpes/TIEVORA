"use client";
import { useEffect, useState } from "react";
import { projects as dummyProjects, offices } from "@/lib/dummyData";
import { useAuth, canSeeProject } from "@/lib/auth";
import { businessUnits } from "@/lib/config";

export default function ProjectTimeline() {
  const { user } = useAuth();
  const [projects, setProjects] = useState(dummyProjects);
  const [unit, setUnit] = useState<string>("All");

  useEffect(()=> {
    fetch("/api/projects").then(r=>r.json()).then(j=> { if (j.projects?.length) setProjects(j.projects); }).catch(()=>{});
  },[]);

  const filtered = projects.filter(p=> {
    const byUnit = unit==="All" || (p as any).unit===unit;
    const byRole = canSeeProject(user, p.office, offices);
    return byUnit && byRole;
  });

  return (
    <div className="glass rounded-2xl p-4 md:p-6 overflow-x-auto">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-bold">📅 Projects • Status • Deadline • Unit</h3>
        <div className="flex items-center gap-2">
          <select value={unit} onChange={e=>setUnit(e.target.value)} className="h-8 rounded-full bg-[#0f1a33] border border-white/15 px-3 text-xs">
            <option value="All">All Units</option>
            {businessUnits.map(u=> <option key={u} value={u}>{u}</option>)}
          </select>
          <span className="text-xs text-white/50 hidden md:inline">Adherence 82% • {user.role} view</span>
        </div>
      </div>
      <div className="mt-2 text-xs text-white/40">{filtered.length} projects {unit!=="All" ? `in ${unit}`:""} {user.role==="Manager" ? `• filtered to ${user.country}`:""}</div>
      <div className="mt-4 grid gap-3">
        <div className="hidden md:grid grid-cols-[1.5fr_0.7fr_0.6fr_0.7fr_0.5fr_0.6fr] text-[11px] tracking-widest text-white/40 px-2">
          <span>PROJECT</span><span>UNIT</span><span>STATUS</span><span>DEADLINE</span><span>PROGRESS</span><span>P/L</span>
        </div>
        {filtered.map(p=>(
          <div key={p.id} className="rounded-xl bg-[#0f1a33]/60 border border-white/10 p-3 md:px-4 md:py-3 grid md:grid-cols-[1.5fr_0.7fr_0.6fr_0.7fr_0.5fr_0.6fr] gap-2 items-center">
            <div>
              <div className="font-semibold text-sm">{p.name} <span className="text-white/40 font-normal">• {p.client}</span></div>
              <div className="text-xs text-white/50">{p.office} • {p.region} • {p.team} members</div>
            </div>
            <div><span className="text-[10px] px-2 py-1 rounded-full bg-white/10 border border-white/10">{(p as any).unit}</span></div>
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
            <div suppressHydrationWarning className={`text-sm font-bold ${p.profit<0?"text-red-300":"text-emerald-300"}`}>{p.profit<0?"-":"+"}${Math.abs(p.profit).toLocaleString('en-US')}</div>
          </div>
        ))}
        {filtered.length===0 && <div className="text-sm text-white/50 py-6 text-center">No projects in this unit / role filter</div>}
      </div>
      <div className="mt-3 text-[11px] text-white/30">API: GET /api/projects • Filter by ?unit=Create • Role-filtered server-side in prod (row-level)</div>
    </div>
  );
}
