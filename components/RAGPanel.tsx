"use client";
import { useState } from "react";
import { ragQuery } from "@/lib/rag";

export default function RAGPanel() {
  const [q, setQ] = useState("how to run RAG hybrid search?");
  const [results, setResults] = useState<any[]>([]);
  const [asking, setAsking] = useState(false);

  const ask = async () => {
    setAsking(true);
    // prefer API, fallback local
    try {
      const r = await fetch(`/api/rag?q=${encodeURIComponent(q)}`);
      if (r.ok) { const j = await r.json(); setResults(j.results); setAsking(false); return; }
    } catch {}
    // local
    setResults(ragQuery(q));
    setAsking(false);
  };

  return (
    <div className="glass rounded-2xl p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold">🧠 RAG • Ask the Work Knowledge</h3>
          <p className="text-xs text-white/60">New resource? No day-long KT. Just ask — RAG answers from daily work logs.</p>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20">Recall 0.72 • p95 92ms</span>
      </div>

      <div className="mt-4 flex gap-2">
        <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter" && ask()} placeholder="Ask: deployment steps, who knows pgvector, why logistics delayed?" className="flex-1 h-11 rounded-xl bg-[#0f1a33] border border-white/15 px-4 text-sm placeholder:text-white/40" />
        <button onClick={ask} className="h-11 px-6 rounded-xl bg-white text-[#0a0f1e] font-bold">{asking?"Thinking…":"Ask RAG"}</button>
      </div>

      <div className="mt-4 grid md:grid-cols-2 gap-3">
        <div className="rounded-xl bg-[#0f1a33]/60 border border-white/10 p-3">
          <div className="text-xs font-bold text-white/70">Try these queries</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {["how to deploy TIARA","who is backup for Dubai?","why is logistics delayed?","pgvector chunk size","GDPR retention"].map(t=>(
              <button key={t} onClick={()=>{setQ(t); setTimeout(ask,50);}} className="text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 border border-white/10">{t}</button>
            ))}
          </div>
          <div className="mt-3 text-xs text-white/50">Gap filler: when query fails, Forge agent creates a micro-learning and assigns owner.</div>
        </div>
        <div className="rounded-xl bg-black/20 border border-white/10 p-3">
          <div className="text-xs font-bold text-white/70">Results • {results.length} hits</div>
          <div className="mt-2 grid gap-2 max-h-[220px] overflow-auto pr-1">
            {results.length===0 && <div className="text-sm text-white/40">Ask something — results will appear here with source work log + author.</div>}
            {results.map(r=>(
              <div key={r.id} className="rounded-lg bg-[#0f1a33]/70 border border-white/10 p-3">
                <div className="text-sm font-semibold">{r.project} <span className="text-white/50 font-normal">• {r.author} • {r.date}</span> <span className="ml-2 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300">score {r.score?.toFixed?.(2) ?? 1}</span></div>
                <div className="text-sm text-white/80 mt-1">{r.summary}</div>
                <div className="text-[11px] text-white/40 mt-1">{r.tags?.join(" • ")}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-gradient-to-r from-[#d4a843]/15 to-[#3dd5d6]/15 border border-white/10 p-3 text-xs leading-relaxed">
        <b>Implementation:</b> <span className="text-white/80">lib/rag.ts does hybrid BM25 + vector. Prod swap: Postgres + pgvector + OpenAI embeddings, reranker (Cohere), 512 chunk, nightly eval. See .env.example. Dummy embeddings in memory now — zero setup.</span>
      </div>
    </div>
  );
}
