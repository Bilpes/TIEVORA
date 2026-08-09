"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { offices, projects, resources, kpis } from "@/lib/dummyData";
import { agentDefs } from "@/lib/agents";
import { useTievoraStore } from "@/lib/store";
import WakeBar from "@/components/WakeBar";
import AgentGrid from "@/components/AgentGrid";
import GlobalOfficesPanel from "@/components/GlobalOfficesPanel";
import ProjectTimeline from "@/components/ProjectTimeline";
import FinancePanel from "@/components/FinancePanel";
import ResourcePanel from "@/components/ResourcePanel";
import RAGPanel from "@/components/RAGPanel";
import WorkLogPanel from "@/components/WorkLogPanel";

export default function Page() {
  const { awakened, globalThinking } = useTievoraStore();
  const [dummyMode, setDummyMode] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);

  // Auto awaken in dummy mode for demo after 1s
  useEffect(() => {
    const t = setTimeout(() => {
      if (!awakened && dummyMode) {
        // do not auto-wake, wait for user but show hint
      }
    }, 1000);
    return ()=>clearTimeout(t);
  }, [awakened, dummyMode]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f1e] via-[#0e1430] to-[#0a0f1e]">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0a0f1e]/70 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#d4a843] to-[#a67c2a] flex items-center justify-center font-black text-[#0a0f1e]">T</div>
            <div>
              <div className="font-bold tracking-wide">TIEVORA</div>
              <div className="text-[10px] tracking-[0.2em] text-white/60 -mt-1">CEO COMMAND CENTER</div>
            </div>
            <span className="hidden md:inline-flex ml-3 text-xs px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">● LIVE • 12 Agents</span>
          </div>
          <nav className="hidden lg:flex items-center gap-6 text-sm text-white/70">
            <a href="#agents" className="hover:text-white">Agents</a>
            <a href="#offices" className="hover:text-white">Offices</a>
            <a href="#projects" className="hover:text-white">Projects</a>
            <a href="#resources" className="hover:text-white">Resources</a>
            <a href="#rag" className="hover:text-white">RAG</a>
          </nav>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-white/60">Dummy Mode</span>
            <button onClick={()=>setDummyMode(v=>!v)} className={`w-11 h-6 rounded-full p-1 transition ${dummyMode?"bg-emerald-500":"bg-white/20"}`}>
              <div className={`w-4 h-4 bg-white rounded-full transition ${dummyMode?"translate-x-5":""}`} />
            </button>
            <button onClick={()=>setMobileMenu(!mobileMenu)} className="lg:hidden ml-2 w-9 h-9 rounded-lg bg-white/10 grid place-items-center">≡</button>
          </div>
        </div>
        {mobileMenu && (
          <div className="lg:hidden border-t border-white/10 px-4 py-3 flex flex-col gap-3 text-sm bg-[#0a0f1e]">
            <a href="#agents">Agents</a><a href="#offices">Offices</a><a href="#projects">Projects</a><a href="#resources">Resources</a><a href="#rag">RAG</a>
          </div>
        )}
      </header>

      {/* Hero / Wake */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-6 pt-6 md:pt-8">
        <div className="glass rounded-[24px] p-4 md:p-6 lg:p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#d4a843]/10 via-transparent to-[#3dd5d6]/10 pointer-events-none" />
          <div className="relative grid lg:grid-cols-[1.4fr_0.8fr] gap-6 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-xs tracking-widest text-[#d4a843]">● TIEVORA ORCHESTRATOR • SAY THE WORD</div>
              <h1 className="text-[28px] md:text-[40px] lg:text-[48px] font-black leading-none mt-2">
                Say <span className="text-[#d4a843]">Hello Tievora</span> <span className="text-white/60">or</span> <span className="text-[#3dd5d6]">Hi Tievora</span>
              </h1>
              <p className="text-white/70 mt-3 text-sm md:text-base max-w-[640px]">All 12 agents wake up in parallel — scanning every office in every country & state, streaming live insights to the CEO in under 2 seconds. Works on mobile, tablet & laptop.</p>
              <div className="mt-5"><WakeBar /></div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">🎙️ Voice Wake</span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">⚡ Parallel • 12 Agents</span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">🌍 12 Offices • 8 Countries</span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">🧠 RAG Knowledge</span>
              </div>
            </div>
            <div className="glass rounded-2xl p-4 grid grid-cols-3 gap-3">
              <KPI label="MTD Revenue" value={`$${(kpis.revenueMTD/1000000).toFixed(2)}M`} sub="+8.4% vs last" />
              <KPI label="Profit MTD" value={`$${(kpis.profitMTD/1000).toFixed(0)}K`} sub="Margin 14.5%" />
              <KPI label="On-Time" value={`${kpis.deadlineAdherence}%`} sub="2 at risk" />
              <KPI label="Bench" value={`${kpis.bench}%`} sub="Needs rebalance" />
              <KPI label="Backup Coverage" value="75%" sub="3 gaps" />
              <KPI label="Work Logs" value={`${((1 - kpis.missingLogs/12)*100).toFixed(0)}%`} sub="4 missing" />
              <div className="col-span-3 mt-1 text-[11px] text-white/50">Dummy data • Production connectors ready (swap lib/dummyData with API)</div>
            </div>
          </div>

          {/* Awakened banner */}
          <AnimatePresence>
            {awakened && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6 rounded-xl bg-gradient-to-r from-[#d4a843]/20 to-[#3dd5d6]/20 border border-[#d4a843]/30 p-3 flex flex-wrap items-center gap-3 text-sm">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="font-semibold">TIEVORA AWAKE •</span>
                <span className="text-white/80">Broadcasting to all state offices… 12 agents streaming insights — scroll to watch.</span>
                <span className="ml-auto text-xs px-2 py-1 rounded bg-black/30">Latency ~1.6s • Parallel</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Agents */}
      <section id="agents" className="max-w-[1440px] mx-auto px-4 md:px-6 mt-6">
        <AgentGrid />
      </section>

      {/* Offices + Projects + Finance */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-6 mt-6 grid lg:grid-cols-[1.25fr_0.75fr] gap-6">
        <div id="offices"><GlobalOfficesPanel /></div>
        <FinancePanel />
      </section>

      <section id="projects" className="max-w-[1440px] mx-auto px-4 md:px-6 mt-6">
        <ProjectTimeline />
      </section>

      <section id="resources" className="max-w-[1440px] mx-auto px-4 md:px-6 mt-6 grid lg:grid-cols-2 gap-6">
        <ResourcePanel />
        <WorkLogPanel />
      </section>

      <section id="rag" className="max-w-[1440px] mx-auto px-4 md:px-6 mt-6 mb-10">
        <RAGPanel />
      </section>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-white/50">
        TIEVORA © 2026 • Production Ready • Dummy Run: <code className="bg-white/10 px-2 py-1 rounded">npm run dummy:run</code> • Deploy: <code className="bg-white/10 px-2 py-1 rounded">docker compose up --build</code> • Mobile • Tablet • Laptop • PWA
      </footer>
    </div>
  );
}

function KPI({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl bg-[#0f1a33]/70 border border-white/10 p-3">
      <div className="text-[10px] tracking-widest text-white/50">{label}</div>
      <div className="text-lg font-black">{value}</div>
      <div className="text-[11px] text-emerald-300">{sub}</div>
    </div>
  );
}
