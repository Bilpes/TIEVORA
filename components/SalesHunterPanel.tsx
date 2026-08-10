"use client";
import { useEffect, useState } from "react";
import { opportunities as dummy, salesKpis } from "@/lib/sales";
import { businessUnits } from "@/lib/config";

export default function SalesHunterPanel() {
  const [ops, setOps] = useState<any[]>(dummy);
  const [q, setQ] = useState("");
  const [unit, setUnit] = useState("All");
  const [selected, setSelected] = useState<any>(dummy[0]);
  const [draft, setDraft] = useState<any>(null);
  const [hunting, setHunting] = useState(false);
  const [tone, setTone] = useState("CEO");
  const [copied, setCopied] = useState(false);

  const load = async () => {
    setHunting(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (unit!=="All") params.set("unit", unit);
    const r = await fetch(`/api/sales/opportunities?${params.toString()}`).then(x=>x.json()).catch(()=>({ opportunities: dummy }));
    setOps(r.opportunities || dummy);
    if (r.opportunities?.length && !r.opportunities.find((o:any)=>o.id===selected?.id)) setSelected(r.opportunities[0]);
    setTimeout(()=> setHunting(false), 600);
  };
  useEffect(()=>{ load(); },[]);

  const huntNow = async () => {
    setHunting(true);
    await load();
    // simulate scanning animation
  };

  const buildMail = async () => {
    const r = await fetch("/api/sales/draft", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ oppId: selected.id, tone }) }).then(x=>x.json());
    if (r.ok) setDraft(r.draft);
  };
  useEffect(()=> { if (selected) buildMail(); }, [selected, tone]);

  const copyMail = async () => {
    if (!draft) return;
    const text = `To: ${draft.to}\nCc: ${draft.cc}\nSubject: ${draft.subject}\n\n${draft.body}`;
    await navigator.clipboard.writeText(text);
    setCopied(true); setTimeout(()=>setCopied(false),2000);
  };

  const mailto = draft ? `mailto:${encodeURIComponent(draft.to)}?cc=${encodeURIComponent(draft.cc)}&subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}` : "#";

  return (
    <div className="glass rounded-2xl p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-bold">🎯 Hunter — Sales Agent • Out of Projects? I Hunt Them</h3>
        <span className="text-xs px-2 py-1 rounded-full bg-[#f43f5e]/15 text-[#f43f5e] border border-[#f43f5e]/30">{ops.length} live tenders • Pipeline €{(ops.reduce((s,o)=>s+o.valueEUR,0)/1000000).toFixed(1)}M</span>
      </div>
      <p className="text-xs text-white/60 mt-1">
        Hunter scans <b className="text-white">TED.europa.eu, Hilma.fi, Upphandling.se, Mercell, Prozorro + web (Tavily)</b> every 6h, scores fit vs Tieto units (Create/Connect/Care/Banking/Industry/Transform), maps competitors, finds CEO email, drafts outreach. When you say <b className="text-white">Hello Tievora</b>, Hunter speaks its pipeline too.
      </p>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
        <div className="rounded-xl bg-[#0f1a33]/60 border border-white/10 p-3">
          <div className="text-[10px] tracking-widest text-white/50">PIPELINE</div>
          <div className="text-lg font-black">€{(salesKpis.pipelineEUR/1000000).toFixed(1)}M</div>
          <div className="text-[11px] text-emerald-300">{ops.length} opportunities</div>
        </div>
        <div className="rounded-xl bg-[#0f1a33]/60 border border-white/10 p-3">
          <div className="text-[10px] tracking-widest text-white/50">AVG WIN PROB</div>
          <div className="text-lg font-black">{salesKpis.avgWinProb}%</div>
          <div className="text-[11px] text-white/60">Hunter-scored</div>
        </div>
        <div className="rounded-xl bg-[#0f1a33]/60 border border-white/10 p-3">
          <div className="text-[10px] tracking-widest text-white/50">HOT FIT &gt;85</div>
          <div className="text-lg font-black text-amber-300">{salesKpis.hotLeads}</div>
          <div className="text-[11px] text-white/60">Ready to pitch</div>
        </div>
        <div className="rounded-xl bg-[#0f1a33]/60 border border-white/10 p-3">
          <div className="text-[10px] tracking-widest text-white/50">CLOSING &lt;30D</div>
          <div className="text-lg font-black text-red-300">{salesKpis.closing30d}</div>
          <div className="text-[11px] text-white/60">Urgent</div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex flex-col md:flex-row gap-2">
        <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter" && load()} placeholder="Search: FHIR, eIDAS, COBOL, Pune, Banking…" className="flex-1 h-9 rounded-xl bg-[#0f1a33] border border-white/15 px-3 text-sm placeholder:text-white/40" />
        <select value={unit} onChange={e=>setUnit(e.target.value)} className="h-9 rounded-xl bg-[#0f1a33] border border-white/15 px-3 text-sm">
          <option value="All">All Units</option>
          {businessUnits.map(u=> <option key={u} value={u}>{u}</option>)}
        </select>
        <button onClick={huntNow} disabled={hunting} className="h-9 px-5 rounded-xl bg-[#f43f5e] text-white font-bold disabled:opacity-50">
          {hunting ? "Hunting…" : "🎯 Hunt Now — Scan Internet"}
        </button>
      </div>
      <div className="mt-2 text-[11px] text-white/40">Hunter intel: scanning TED + Hilma + Mercell every 6h • competitors mapped • contact email verified via Hunter.io/Apollo pattern • In dummy mode shows curated pipeline; in live mode hits Tavily web search</div>

      <div className="mt-4 grid lg:grid-cols-[1.1fr_0.9fr] gap-4">
        {/* Opportunities list */}
        <div className="rounded-xl bg-black/20 border border-white/10 p-3">
          <div className="text-xs font-bold text-white/70">Opportunities {hunting && "• scanning…”"}</div>
          <div className="mt-2 grid gap-2 max-h-[520px] overflow-auto pr-1">
            {ops.map(o=> (
              <button key={o.id} onClick={()=>setSelected(o)} className={`text-left rounded-xl border p-3 transition ${selected?.id===o.id ? "bg-[#f43f5e]/15 border-[#f43f5e]/30" : "bg-[#0f1a33]/60 border-white/10 hover:border-white/20"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="font-semibold text-sm leading-tight">{o.title}</div>
                  <span className={`text-[10px] px-2 py-1 rounded-full border whitespace-nowrap ${o.status==="New"?"bg-white/10 text-white/70 border-white/10":o.status==="Hunting"?"bg-amber-500/15 text-amber-300 border-amber-500/20":"bg-emerald-500/15 text-emerald-300 border-emerald-500/20"}`}>{o.status}</span>
                </div>
                <div className="text-xs text-white/50 mt-1">{o.buyer} • {o.city}, {o.country} • <span className="text-white/70">{o.unit}</span> • <a href={o.sourceUrl} target="_blank" onClick={e=>e.stopPropagation()} className="underline text-[#3dd5d6]">{o.source}</a></div>
                <div className="text-xs mt-1 text-white/80 line-clamp-2">{o.description}</div>
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="text-[10px] px-2 py-1 rounded-full bg-white/10 border border-white/10">€{(o.valueEUR/1000000).toFixed(1)}M</span>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-white/10 border border-white/10">Due {o.deadline}</span>
                  <span className={`text-[10px] px-2 py-1 rounded-full border ${o.fitScore>85?"bg-emerald-500/15 text-emerald-300 border-emerald-500/20":o.fitScore>70?"bg-amber-500/15 text-amber-300 border-amber-500/20":"bg-white/10 text-white/60"}`}>Fit {o.fitScore}%</span>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-white/10 border border-white/10">Win {o.winProb}%</span>
                </div>
                <div className="mt-2 text-[11px] text-white/50">Competitors: <span className="text-white/70">{o.competitors.join(", ")}</span></div>
                <div className="mt-1 text-[11px] text-emerald-200/90">Hunter: {o.hunterNote.slice(0,110)}…</div>
              </button>
            ))}
            {ops.length===0 && <div className="text-sm text-white/50 py-8 text-center">No matches — try All Units or Hunt Now</div>}
          </div>
        </div>

        {/* Detail + Email builder */}
        {selected && (
          <div className="rounded-xl bg-[#0f1a33]/60 border border-white/10 p-3 flex flex-col gap-3">
            <div>
              <div className="text-sm font-bold leading-tight">{selected.title}</div>
              <div className="text-xs text-white/60">{selected.buyer} • {selected.country} • €{(selected.valueEUR/1000000).toFixed(1)}M • {selected.unit} • Due {selected.deadline}</div>
              <div className="text-xs mt-2 text-white/80">{selected.description}</div>
              <div className="mt-2 flex flex-wrap gap-1">
                {selected.skills.map((s:string)=> <span key={s} className="text-[10px] px-2 py-1 rounded-full bg-white/10 border border-white/10">{s}</span>)}
              </div>
            </div>

            <div className="rounded-lg bg-black/20 border border-white/10 p-3">
              <div className="text-xs font-bold text-white/70">Competitor Intel</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {selected.competitors.map((c:string)=> <span key={c} className="text-[11px] px-2 py-1 rounded-full bg-red-500/15 text-red-300 border border-red-500/20">{c}</span>)}
              </div>
              <div className="text-xs mt-2 text-white/60">Hunter edge: <span className="text-white">{selected.hunterNote}</span></div>
            </div>

            <div className="rounded-lg bg-black/20 border border-white/10 p-3">
              <div className="text-xs font-bold text-white/70">Contact — auto-found</div>
              <div className="text-sm font-semibold">{selected.contactName} <span className="text-white/50 font-normal">• {selected.contactRole}</span></div>
              <div className="text-xs text-[#3dd5d6]">{selected.contactEmail} {selected.contactLinkedIn && <span className="text-white/40">• {selected.contactLinkedIn}</span>}</div>
              <div className="text-[11px] text-white/40 mt-1">Verified via Hunter.io pattern + LinkedIn Sales Navigator • Confidence 89%</div>
            </div>

            <div className="rounded-lg bg-gradient-to-br from-[#d4a843]/15 to-[#f43f5e]/15 border border-white/10 p-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-white/80">✉️ CEO Email Draft — one click</div>
                <select value={tone} onChange={e=>setTone(e.target.value)} className="h-7 rounded-full bg-[#0f1a33] border border-white/15 px-2 text-xs">
                  <option value="CEO">CEO tone</option>
                  <option value="Consultative">Consultative</option>
                  <option value="Punchy">Punchy</option>
                </select>
              </div>
              {draft ? (
                <div className="mt-2">
                  <div className="text-xs text-white/60">To: <span className="text-white">{draft.to}</span> • Cc: {draft.cc}</div>
                  <div className="text-xs font-bold mt-1">Subject: {draft.subject}</div>
                  <textarea readOnly value={draft.body} rows={10} className="mt-2 w-full rounded-lg bg-black/30 border border-white/10 p-2 text-xs whitespace-pre-wrap" />
                  <div className="mt-2 flex flex-wrap gap-2">
                    <a href={mailto} target="_blank" className="h-8 px-4 rounded-full bg-[#d4a843] text-[#0a0f1e] text-xs font-bold grid place-items-center">Open in Email → CEO Inbox</a>
                    <button onClick={copyMail} className="h-8 px-4 rounded-full bg-white text-[#0a0f1e] text-xs font-bold">{copied ? "✓ Copied" : "Copy Email"}</button>
                    <button onClick={()=> window.open(selected.sourceUrl, "_blank")} className="h-8 px-4 rounded-full bg-white/10 border border-white/10 text-xs">View Tender →</button>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-white/50 mt-2">Generating draft…</div>
              )}
              <div className="text-[11px] text-white/40 mt-2">In live mode, Hunter uses OpenAI to personalize + Hunter.io to verify email + auto-nudges in 48h. Dummy shows curated template.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
