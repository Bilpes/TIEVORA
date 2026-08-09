"use client";
import { useEffect, useMemo, useState } from "react";
import { offices as dummyOffices } from "@/lib/dummyData";
import { useAuth } from "@/lib/auth";
import { businessUnits } from "@/lib/config";

export default function GlobalOfficesPanel() {
  const { user } = useAuth();
  const [offices, setOffices] = useState<any[]>(dummyOffices);
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("All");
  const [unit, setUnit] = useState("All");

  useEffect(()=> {
    fetch("/api/offices").then(r=>r.json()).then(j=> { if (j.offices?.length) setOffices(j.offices); }).catch(()=>{});
  },[]);

  const countries = useMemo(() => ["All", ...Array.from(new Set(offices.map(o=>o.country))).sort()], [offices]);
  const filtered = useMemo(() => {
    return offices.filter(o => {
      const mSearch = !search || `${o.city} ${o.country} ${o.state} ${o.address} ${o.unit}`.toLowerCase().includes(search.toLowerCase());
      const mCountry = country==="All" || o.country===country;
      const mUnit = unit==="All" || o.unit===unit;
      const mRole = user.role==="CEO" || o.country===user.country;
      return mSearch && mCountry && mUnit && mRole;
    });
  }, [search, country, unit, offices, user]);

  const counts = useMemo(()=> {
    const map: Record<string, number> = {};
    offices.filter(o=> user.role==="CEO" || o.country===user.country).forEach(o=> map[o.unit]=(map[o.unit]||0)+1);
    return Object.entries(map).sort((a,b)=>b[1]-a[1]);
  },[offices, user]);

  return (
    <div className="glass rounded-2xl p-4 md:p-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-bold">🌍 Tietoevry Offices • Every Country & State • Units</h3>
        <span className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/10">{filtered.length}/{offices.length} offices • {user.role}</span>
      </div>
      <p className="text-xs text-white/60 mt-1">Source: <a href="https://www.tieto.com/en/contact-us/locations/" target="_blank" className="underline text-[#d4a843]">tieto.com/locations</a> • Units: Create/Connect/Care/Banking/Industry/Transform • CEO sees all, Manager sees {user.country || "own"} only</p>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search city, state, unit…" className="h-9 rounded-xl bg-[#0f1a33] border border-white/15 px-3 text-sm placeholder:text-white/40" />
        <select value={country} onChange={e=>setCountry(e.target.value)} className="h-9 rounded-xl bg-[#0f1a33] border border-white/15 px-3 text-sm">
          {countries.map(c=> <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={unit} onChange={e=>setUnit(e.target.value)} className="h-9 rounded-xl bg-[#0f1a33] border border-white/15 px-3 text-sm">
          <option value="All">All Units</option>
          {businessUnits.map(u=> <option key={u} value={u}>{u}</option>)}
        </select>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5 text-[10px]">
        {counts.map(([c,n])=> (
          <span key={c} onClick={()=>setUnit(c)} className={`cursor-pointer px-2 py-1 rounded-full border ${unit===c? "bg-[#d4a843] text-[#0a0f1e] border-[#d4a843]":"bg-white/10 text-white/70 border-white/10"}`}>{c} {n}</span>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-auto pr-1">
        {filtered.map(o => (
          <div key={o.id} className="rounded-xl bg-[#0f1a33]/60 border border-white/10 p-3 flex gap-3 hover:border-[#d4a843]/30 transition">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#d4a843]/30 to-[#3dd5d6]/30 grid place-items-center text-[10px] font-bold">{o.id.split("-")[1]?.slice(0,4)}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{o.city} <span className="text-white/50 font-normal">• {o.country} / {o.state}</span></div>
              <div className="text-[11px] text-white/40 truncate">{o.address} • <span className="text-[#d4a843]">{o.unit}</span></div>
              <div className="text-[11px] text-white/60" suppressHydrationWarning>{o.headcount.toLocaleString('en-US')} people • {o.projects} projects</div>
              <div className="text-xs mt-1 text-emerald-200/90 truncate">› {o.pulse}</div>
            </div>
            <div className="w-2 h-2 mt-2 bg-emerald-400 rounded-full animate-pulse flex-shrink-0" />
          </div>
        ))}
        {filtered.length===0 && <div className="col-span-2 text-sm text-white/50 py-8 text-center">No offices match — try All units/countries or switch to CEO view</div>}
      </div>
    </div>
  );
}
