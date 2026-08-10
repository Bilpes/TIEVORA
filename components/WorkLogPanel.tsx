"use client";
import { useEffect, useState } from "react";
import { resources as dummy } from "@/lib/dummyData";

export default function WorkLogPanel() {
  const [author, setAuthor] = useState("Aarav Mehta");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState("RAG, nextjs");
  const [toast, setToast] = useState("");
  const [resources, setResources] = useState<any[]>(dummy as any);

  useEffect(()=> {
    fetch("/api/resources?limit=100").then(r=>r.json()).then(j=> { if (j.resources?.length) setResources(j.resources); }).catch(()=>{});
  },[]);

  const selected = resources.find((r:any)=> r.name===author) as any;
  const isMandatory = selected?.isKnowledgeOwner;

  const submit = async () => {
    if (!summary.trim()) { setToast("Please add work info"); setTimeout(()=>setToast(""),2000); return; }
    await fetch("/api/work-log", { method: "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify({ author, summary, tags }) });
    setToast(isMandatory ? "✓ Mandatory log indexed — RAG knows it! You’re a Knowledge Owner (<200)." : "✓ Optional log saved — thanks! Your team’s auto-summary already covers you.");
    setSummary("");
    setTimeout(()=>setToast(""),3000);
  };

  return (
    <div className="glass rounded-2xl p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold">📝 Work Log • Hybrid &lt;200</h3>
        <span className={`text-[10px] px-2 py-1 rounded-full border ${isMandatory ? "bg-[#d4a843] text-[#0a0f1e] border-[#d4a843] font-bold" : "bg-white/10 text-white/60 border-white/10"}`}>
          {isMandatory ? "🔴 MANDATORY (Owner)" : "🟢 AUTO (Git/Jira)"}
        </span>
      </div>
      <p className="text-xs text-white/60 mt-1">
        <b className="text-white">Hybrid:</b> Only <b className="text-[#d4a843]">Knowledge Owners (~180)</b> must log daily. Rest auto-captured from Git/Jira/PRs → 20 digests/day. Scales to 5k without spam.
      </p>

      <div className="mt-4 grid gap-3">
        <label className="text-xs text-white/60">Employee — {resources.filter((r:any)=> r.isKnowledgeOwner).length} mandatory / {resources.length} in view
          <select value={author} onChange={e=>setAuthor(e.target.value)} className="mt-1 w-full h-10 rounded-xl bg-[#0f1a33] border border-white/15 px-3 text-sm">
            {resources.map((r:any)=> (
              <option key={r.id} value={r.name}>{r.name} — {r.role} {r.isKnowledgeOwner ? "● MANDATORY" : "○ auto"}</option>
            ))}
          </select>
        </label>

        {isMandatory ? (
          <div className="rounded-lg bg-[#d4a843]/10 border border-[#d4a843]/20 p-2 text-xs">
            <b className="text-[#d4a843]">You are a Knowledge Owner.</b> <span className="text-white/70">Daily log is <b>mandatory</b> — 48h nudge if missed. Your log is primary RAG source for 5k colleagues.</span>
          </div>
        ) : (
          <div className="rounded-lg bg-white/5 border border-white/10 p-2 text-xs">
            <b className="text-white">You are auto-captured.</b> <span className="text-white/60">Your Git commits & Jira tickets are auto-summarized. Manual log is <b>optional</b> — only if you have a key decision to share.</span>
          </div>
        )}

        <label className="text-xs text-white/60">What did you do today? (RAG will chunk & embed)
          <textarea value={summary} onChange={e=>setSummary(e.target.value)} placeholder={isMandatory ? "e.g., Fixed hybrid search reranker, latency 180ms → 92ms, added eval set 200 Qs — mandatory log" : "Optional: e.g., Warmed up Bharat Forge intro — only if not in Jira"} rows={3} className="mt-1 w-full rounded-xl bg-[#0f1a33] border border-white/15 p-3 text-sm placeholder:text-white/40" />
        </label>
        <label className="text-xs text-white/60">Tags
          <input value={tags} onChange={e=>setTags(e.target.value)} placeholder="RAG, pgvector" className="mt-1 w-full h-10 rounded-xl bg-[#0f1a33] border border-white/15 px-3 text-sm" />
        </label>
        <button onClick={submit} className={`h-11 rounded-xl font-black ${isMandatory ? "bg-gradient-to-r from-[#d4a843] to-[#c08a1e] text-[#0a0f1e]" : "bg-white/10 border border-white/15 text-white/80"}`}>
          {isMandatory ? "Update RAG → Mandatory" : "Add Optional Insight → RAG"}
        </button>

        <div className="rounded-xl bg-[#0f1a33]/60 border border-white/10 p-3 text-xs leading-relaxed">
          <b className="text-[#d4a843]">How RAG stays sharp at 5k:</b> <span className="text-white/70">180 mandatory logs + 20 auto team digests/day → 200 docs/day → 73k/year (not 1.25M). Chunks 512, pgvector, 92ms. Old logs summarized monthly, not deleted.</span>
        </div>
        {toast && <div className="rounded-xl bg-emerald-500/15 border border-emerald-500/20 p-3 text-sm text-emerald-200">{toast}</div>}
        <div className="text-[11px] text-white/40">API: POST /api/work-log • isKnowledgeOwner flag in DB • See lib/speech.ts + db/schema.sql</div>
      </div>
    </div>
  );
}
