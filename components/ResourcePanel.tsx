"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";

export default function ResourcePanel() {
  const { user } = useAuth();
  const [resources, setResources] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [q, setQ] = useState("");
  const [mandatoryOnly, setMandatoryOnly] = useState(false);
  const [meta, setMeta] = useState<any>(null);
  const totalPages = Math.max(1, Math.ceil(total/limit));

  const fetchPage = async (p:number, query:string, mandatory:boolean) => {
    const params = new URLSearchParams({ page: String(p), limit: String(limit) });
    if (query) params.set("q", query);
    if (mandatory) params.set("mandatory","true");
    const r = await fetch(`/api/resources?${params.toString()}`).then(x=>x.json()).catch(()=>({ resources: [] }));
    let list = r.resources || [];
    // role filter client-side (CEO sees all)
    if (user.role!=="CEO") list = list.filter((rr:any)=> rr.country===user.country);
    setResources(list);
    setTotal(r.total ?? list.length);
    setMeta(r);
  };

  useEffect(()=> { fetchPage(page, q, mandatoryOnly); }, [page, q, mandatoryOnly, user.country, user.role]);
  useEffect(()=> { setPage(1); }, [q, mandatoryOnly]);

  const filtered = resources; // already filtered server + role

  return (
    <div className="glass rounded-2xl p-4 md:p-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-bold">🧩 Resources • Hybrid &lt;200</h3>
        <span className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/10">{total} total • {meta?.mandatoryCount ?? 7} mandatory / {meta?.autoCount ?? 5} auto • p{page}/{totalPages}</span>
      </div>
      <p className="text-xs text-white/60 mt-1">
        <b className="text-white">Hybrid:</b> Only <b className="text-[#d4a843]">~180 Knowledge Owners</b> (CEO/Country Heads/Leads) log manually daily. Rest 5k auto-captured from Git/Jira/PRs → summarized, not nagged. Scales without explosion.
      </p>

      <div className="mt-3 flex flex-col sm:flex-row gap-2">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search name, role, office, skill…" className="flex-1 h-8 rounded-full bg-[#0f1a33] border border-white/15 px-3 text-xs" />
        <button onClick={()=> setMandatoryOnly(v=>!v)} className={`h-8 px-3 rounded-full border text-xs whitespace-nowrap ${mandatoryOnly ? "bg-[#d4a843] text-[#0a0f1e] border-[#d4a843] font-bold" : "bg-white/10 text-white/60 border-white/10"}`}>
          {mandatoryOnly ? "● Mandatory only (<200)" : "Show: All (mandatory + auto)"}
        </button>
      </div>
      <div className="mt-2 text-[11px] text-white/40">CEO sees all; Manager sees {user.country || "own country"} only • Paginated (8/page) — no 5k load on startup</div>

      <div className="mt-4 grid gap-3 max-h-[420px] overflow-auto pr-1">
        {filtered.map((r:any)=>(
          <div key={r.id} className={`rounded-xl border p-3 flex gap-3 ${r.leavingRisk==="High"?"bg-red-500/10 border-red-500/20":"bg-[#0f1a33]/60 border-white/10"}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/15 to-white/5 grid place-items-center font-bold text-sm shrink-0">{r.name.split(" ").map((s:string)=>s[0]).join("")}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold flex flex-wrap items-center gap-1">
                {r.name} <span className="text-white/50 font-normal">• {r.role}</span>
                {r.isKnowledgeOwner ? <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#d4a843] text-[#0a0f1e] font-black">MANDATORY</span> : <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/60 border border-white/10">AUTO</span>}
              </div>
              <div className="text-xs text-white/50">{r.office} • {r.country}/{r.state} • {r.utilization}% util • <span className={r.logSource==="manual" ? "text-[#d4a843]" : "text-white/40"}>{r.logSource==="manual" ? "✍️ manual" : "🤖 auto Git/Jira"}</span></div>
              <div className="text-xs mt-1 text-white/80 line-clamp-2">› {r.lastLog}</div>
              <div className="flex flex-wrap gap-1 mt-2">
                {r.skills.map((s:string)=><span key={s} className="text-[10px] px-2 py-1 rounded-full bg-white/10 border border-white/10">{s}</span>)}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className={`text-[10px] px-2 py-1 rounded-full border ${r.leavingRisk==="High"?"bg-red-500/20 text-red-300 border-red-500/30":r.leavingRisk==="Medium"?"bg-amber-500/20 text-amber-300 border-amber-500/30":"bg-emerald-500/15 text-emerald-300 border-emerald-500/20"}`}>{r.leavingRisk} RISK</span>
              <span className={`text-[11px] ${r.backup?"text-emerald-300":"text-red-300 font-bold"}`}>{r.backup?`Backup: ${r.backup}`:"⚠ NO BACKUP"}</span>
            </div>
          </div>
        ))}
        {filtered.length===0 && <div className="text-sm text-white/50 py-8 text-center">No resources — try clear filter</div>}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <button disabled={page<=1} onClick={()=> setPage(p=> Math.max(1,p-1))} className="h-7 px-3 rounded-full bg-white/10 border border-white/10 text-xs disabled:opacity-40">← Prev</button>
        <span className="text-xs text-white/50">Page {page} / {totalPages} • {total} resources • <b className="text-[#d4a843]">{meta?.mandatoryCount ?? 7} mandatory</b> owners scale to 5k</span>
        <button disabled={page>=totalPages} onClick={()=> setPage(p=> p+1)} className="h-7 px-3 rounded-full bg-white/10 border border-white/10 text-xs disabled:opacity-40">Next →</button>
      </div>

      <div className="mt-3 rounded-lg bg-[#d4a843]/10 border border-[#d4a843]/20 p-2 text-[11px] leading-relaxed">
        <b className="text-[#d4a843]">Why &lt;200?</b> <span className="text-white/70">180 owners generate 180 logs/day → 65k/year → RAG stays sharp. 5k auto-summarized → 20 team digests/day. No explosion, no spam, GDPR-friendly.</span>
      </div>
    </div>
  );
}
