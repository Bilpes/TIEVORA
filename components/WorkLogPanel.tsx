"use client";
import { useState } from "react";

export default function WorkLogPanel() {
  const [author, setAuthor] = useState("Aarav Mehta");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState("RAG, nextjs");
  const [toast, setToast] = useState("");

  const submit = async () => {
    if (!summary.trim()) { setToast("Please add work info"); setTimeout(()=>setToast(""),2000); return; }
    await fetch("/api/work-log", { method: "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify({ author, summary, tags }) });
    setToast("✓ Work log indexed — RAG knows it! New hires will ramp faster.");
    setSummary("");
    setTimeout(()=>setToast(""),3000);
  };

  return (
    <div className="glass rounded-2xl p-4 md:p-6">
      <h3 className="font-bold">📝 Mandatory Work Log • RAG Knowledge</h3>
      <p className="text-xs text-white/60 mt-1">Every employee must update daily work info. RAG ingests it instantly so a new resource ramps in &lt;1 day.</p>
      <div className="mt-4 grid gap-3">
        <label className="text-xs text-white/60">Employee
          <select value={author} onChange={e=>setAuthor(e.target.value)} className="mt-1 w-full h-10 rounded-xl bg-[#0f1a33] border border-white/15 px-3 text-sm">
            <option>Aarav Mehta</option><option>Sneha Rao</option><option>Chen Wei</option><option>Alex Rivera</option><option>Priya Nair</option>
          </select>
        </label>
        <label className="text-xs text-white/60">What did you do today? (RAG will chunk & embed)
          <textarea value={summary} onChange={e=>setSummary(e.target.value)} placeholder="e.g., Fixed hybrid search reranker, latency 180ms → 92ms, added eval set 200 Qs" rows={4} className="mt-1 w-full rounded-xl bg-[#0f1a33] border border-white/15 p-3 text-sm placeholder:text-white/40" />
        </label>
        <label className="text-xs text-white/60">Tags
          <input value={tags} onChange={e=>setTags(e.target.value)} placeholder="RAG, pgvector" className="mt-1 w-full h-10 rounded-xl bg-[#0f1a33] border border-white/15 px-3 text-sm" />
        </label>
        <button onClick={submit} className="h-11 rounded-xl bg-gradient-to-r from-[#7c5cfc] to-[#3dd5d6] text-[#0a0f1e] font-black">Update RAG → Notify Onboarding</button>
        <div className="rounded-xl bg-[#0f1a33]/60 border border-white/10 p-3 text-xs leading-relaxed">
          <b className="text-[#d4a843]">How RAG helps:</b> <span className="text-white/80">Logs are chunked (512), embedded, and stored. A new hire asking “how to deploy TIEVORA” gets Aarav’s log + runbook in 92ms. Nudge emails fire if no log in 48h. Daily digest to leads.</span>
        </div>
        {toast && <div className="rounded-xl bg-emerald-500/15 border border-emerald-500/20 p-3 text-sm text-emerald-200">{toast}</div>}
        <div className="text-[11px] text-white/40">API: POST /api/work-log • Stored in lib/dummyData (swap to Postgres+pgvector in prod) • See lib/rag.ts</div>
      </div>
    </div>
  );
}
