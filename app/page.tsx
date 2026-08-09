"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { offices as dummyOffices, kpis } from "@/lib/dummyData";
import { useTievoraStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import WakeBar from "@/components/WakeBar";
import AgentGrid from "@/components/AgentGrid";
import GlobalOfficesPanel from "@/components/GlobalOfficesPanel";
import WorldMap from "@/components/WorldMap";
import ProjectTimeline from "@/components/ProjectTimeline";
import FinancePanel from "@/components/FinancePanel";
import ResourcePanel from "@/components/ResourcePanel";
import RAGPanel from "@/components/RAGPanel";
import WorkLogPanel from "@/components/WorkLogPanel";
import RoleSwitch from "@/components/RoleSwitch";
import NudgesPanel from "@/components/NudgesPanel";
import { config } from "@/lib/config";

export default function Page() {
  const { awakened } = useTievoraStore();
  const { user } = useAuth();
  const [dummyMode, setDummyMode] = useState(config.dummyMode);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState<any>(null);
  const [offices, setOffices] = useState<any[]>(dummyOffices);

  useEffect(()=> {
    // hydrate offices via real API (falls back to dummy in dummy mode)
    fetch("/api/offices").then(r=>r.json()).then(j=> { if (j.offices?.length) setOffices(j.offices); }).catch(()=>{});
  },[]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f1e] via-[#0e1430] to-[#0a0f1e]">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0a0f1e]/70 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#d4a843] to-[#a67c2a] flex items-center justify-center font-black text-[#0a0f1e]">T</div>
            <div>
              <div className="font-bold tracking-wide">TIEVORA</div>
              <div className="text-[10px] tracking-[0.2em] text-white/60 -mt-1">CEO COMMAND CENTER</div>
            </div>
            <span className="hidden md:inline-flex ml-3 text-xs px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">● LIVE • 12 Agents • 50+ offices</span>
          </div>
          <nav className="hidden lg:flex items-center gap-5 text-sm text-white/70">
            <a href="#agents" className="hover:text-white">Agents</a>
            <a href="#map" className="hover:text-white">Map</a>
            <a href="#offices" className="hover:text-white">Offices</a>
            <a href="#projects" className="hover:text-white">Projects</a>
            <a href="#resources" className="hover:text-white">Resources</a>
            <a href="#rag" className="hover:text-white">RAG</a>
          </nav>
          <div className="flex items-center gap-2">
            <RoleSwitch />
            <span className="hidden sm:inline text-xs text-white/50 ml-2">{dummyMode?"Dummy":"Live"}</span>
            <button onClick={()=>setDummyMode(v=>!v)} title="Toggle dummy/live — env NEXT_PUBLIC_DUMMY_MODE" className={`w-11 h-6 rounded-full p-1 transition ${dummyMode?"bg-emerald-500":"bg-white/20"}`}>
              <div className={`w-4 h-4 bg-white rounded-full transition ${dummyMode?"translate-x-5":""}`} />
            </button>
            <button onClick={()=>setMobileMenu(!mobileMenu)} className="lg:hidden ml-1 w-9 h-9 rounded-lg bg-white/10 grid place-items-center">≡</button>
          </div>
        </div>
        {mobileMenu && (
          <div className="lg:hidden border-t border-white/10 px-4 py-3 flex flex-col gap-3 text-sm bg-[#0a0f1e]">
            <a href="#agents">Agents</a><a href="#map">Map</a><a href="#offices">Offices</a><a href="#projects">Projects</a><a href="#resources">Resources</a><a href="#rag">RAG</a>
            <div className="text-xs text-white/40">Viewing as {user.name} • {user.role} {user.country? `(${user.country})`:""}</div>
          </div>
        )}
      </header>

      <section className="max-w-[1440px] mx-auto px-4 md:px-6 pt-6 md:pt-8">
        <div className="glass rounded-[24px] p-4 md:p-6 lg:p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#d4a843]/10 via-transparent to-[#3dd5d6]/10 pointer-events-none" />
          <div className="relative grid lg:grid-cols-[1.4fr_0.8fr] gap-6 items-start">
            <div>
              <div className="inline-flex items-center gap-2 text-xs tracking-widest text-[#d4a843]">● TIEVORA ORCHESTRATOR • SAY THE WORD • {user.role} VIEW</div>
              <h1 className="text-[28px] md:text-[40px] lg:text-[48px] font-black leading-none mt-2">
                Say <span className="text-[#d4a843]">Hello Tievora</span> <span className="text-white/60">or</span> <span className="text-[#3dd5d6]">Hi Tievora</span>
              </h1>
              <p className="text-white/70 mt-3 text-sm md:text-base max-w-[640px]">
                All 12 agents wake in parallel — scanning <b className="text-white">{offices.length} offices</b> in every Tietoevry country & state (Espoo HQ, Stockholm, Fornebu, Pune, Bangalore, Szczecin, Kyiv…), split by <b className="text-white">Create / Connect / Care / Banking / Industry / Transform</b>. Streams to CEO in 1.6s. {user.role==="Manager" ? `Manager view: filtered to ${user.country} only.` : "CEO sees everything."}
              </p>
              <div className="mt-5"><WakeBar /></div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">🎙️ Voice Wake</span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">⚡ Parallel • 12 Agents</span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">🌍 {offices.length} Offices • 27 Countries</span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">🧠 RAG Knowledge</span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">🏢 Create / Banking / Industry…</span>
                <a href="https://www.tieto.com/en/contact-us/locations/" target="_blank" className="px-3 py-1 rounded-full bg-[#d4a843]/15 border border-[#d4a843]/30 text-[#d4a843]">↗ tieto.com/locations</a>
              </div>
              <div className="mt-3 text-[11px] text-white/40">Env: NEXT_PUBLIC_DUMMY_MODE={dummyMode?"true":"false"} • API: /api/offices • /api/projects • /api/resources • /api/nudges • {dummyMode ? "Dummy — instant" : "Live — ERP/HR"}</div>
            </div>
            <div className="glass rounded-2xl p-4 grid grid-cols-3 gap-3">
              <KPI label="MTD Revenue" value={`$${(kpis.revenueMTD/1000000).toFixed(2)}M`} sub="+8.4% vs last" />
              <KPI label="Profit MTD" value={`$${(kpis.profitMTD/1000).toFixed(0)}K`} sub="Margin 14.5%" />
              <KPI label="On-Time" value={`${kpis.deadlineAdherence}%`} sub="2 at risk" />
              <KPI label="Bench" value={`${kpis.bench}%`} sub="Needs rebalance" />
              <KPI label="Backup Coverage" value="75%" sub="3 gaps" />
              <KPI label="Work Logs" value={`${((1 - kpis.missingLogs/12)*100).toFixed(0)}%`} sub="4 missing" />
              <div className="col-span-3 mt-1 text-[11px] text-white/50">Role: <b className="text-white">{user.role}</b> {user.country? `• ${user.country}`:"• Global"} • Units: Create/Connect/Care/Banking/Industry/Transform</div>
            </div>
          </div>

          <AnimatePresence>
            {awakened && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6 rounded-xl bg-gradient-to-r from-[#d4a843]/20 to-[#3dd5d6]/20 border border-[#d4a843]/30 p-3 flex flex-wrap items-center gap-3 text-sm">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="font-semibold">TIEVORA AWAKE •</span>
                <span className="text-white/80">Broadcasting to all {offices.length} offices… 12 agents streaming by business unit — scroll to map.</span>
                <span className="ml-auto text-xs px-2 py-1 rounded bg-black/30">Latency ~1.6s • Parallel • {user.role}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section id="agents" className="max-w-[1440px] mx-auto px-4 md:px-6 mt-6">
        <AgentGrid />
      </section>

      <section id="map" className="max-w-[1440px] mx-auto px-4 md:px-6 mt-6">
        <div className="glass rounded-2xl p-4 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-bold">🗺️ World Map — Clustered Pins (Leaflet) — Tap pin → office card</h3>
            <span className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/10">{offices.length} pins • clustered • filtered by role ({user.role})</span>
          </div>
          <p className="text-xs text-white/60 mt-1">Colors by business unit: Create (#d4a843) • Banking (#3dd5d6) • Industry (#7c5cfc) • Connect (#34d399) • Care (#f472b6) • Transform (#f59e0b). Cluster expands on zoom.</p>
          <div className="mt-4">
            <WorldMap offices={user.role==="CEO" ? offices : offices.filter(o=>o.country===user.country)} onSelect={setSelectedOffice} />
          </div>
          {selectedOffice && (
            <div className="mt-3 rounded-xl bg-[#0f1a33]/60 border border-[#d4a843]/30 p-3 flex gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#d4a843]/20 grid place-items-center text-xs font-bold">{selectedOffice.id.split("-")[1]}</div>
              <div className="flex-1">
                <div className="text-sm font-bold">{selectedOffice.city} <span className="text-white/50 font-normal">• {selectedOffice.country} / {selectedOffice.state} • {selectedOffice.unit}</span></div>
                <div className="text-xs text-white/50">{selectedOffice.address}</div>
                <div className="text-xs mt-1 text-emerald-200">› {selectedOffice.pulse}</div>
              </div>
              <button onClick={()=>setSelectedOffice(null)} className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/10 h-fit">Close</button>
            </div>
          )}
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-4 md:px-6 mt-6 grid lg:grid-cols-[1.25fr_0.75fr] gap-6">
        <div id="offices"><GlobalOfficesPanel /></div>
        <FinancePanel />
      </section>

      <section id="projects" className="max-w-[1440px] mx-auto px-4 md:px-6 mt-6">
        <ProjectTimeline />
      </section>

      <section id="resources" className="max-w-[1440px] mx-auto px-4 md:px-6 mt-6 grid lg:grid-cols-2 gap-6">
        <ResourcePanel />
        <div className="grid gap-6">
          <WorkLogPanel />
          <NudgesPanel />
        </div>
      </section>

      <section id="rag" className="max-w-[1440px] mx-auto px-4 md:px-6 mt-6 mb-10">
        <RAGPanel />
      </section>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-white/50">
        TIEVORA © 2026 • <b className="text-white">Real API</b>: /api/offices?unit=Create etc • <b className="text-white">Vercel</b>: vercel.json • <b className="text-white">Docker</b>: docker compose up --build • Env: NEXT_PUBLIC_DUMMY_MODE • Mobile/Tablet/Laptop • PWA
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
