import { offices, projects, resources, kpis } from "./dummyData";

export type AgentDef = {
  id: string;
  name: string;
  role: string;
  icon: string;
  color: string;
  office: string;
  country: string;
  insight: () => string;
};

export const agentDefs: AgentDef[] = [
  {
    id: "A01", name: "Atlas", role: "Project Health Agent", icon: "📊", color: "#d4a843",
    office: "Espoo (HQ)", country: "Finland",
    insight: () => {
      const atRisk = projects.filter(p=>p.status!=="On Track").length;
      return `Espoo HQ: ${projects.length} active • ${atRisk} at risk. TIEVORA Core ${projects[0].progress}% — on track. NeoBank (Stockholm/Riga) at risk — 2 handovers pending.`;
    }
  },
  {
    id: "A02", name: "Chrono", role: "Deadline & Milestone Agent", icon: "⏳", color: "#3dd5d6",
    office: "Stockholm (Solna)", country: "Sweden",
    insight: () => `Stockholm hub: Next deadline Aug 18 Industry Twin — RED (Göteborg/Luleå). Connect 5G Oulu Aug 30 — YELLOW. Auto-escalation to Tampere & Trondheim leads.`
  },
  {
    id: "A03", name: "Ledger", role: "Profit/Loss & Finance Agent", icon: "💰", color: "#4ade80",
    office: "Szczecin", country: "Poland",
    insight: () => `Finance Pulse (Szczecin/Warsaw): MTD Revenue $${(kpis.revenueMTD/1000000).toFixed(2)}M • Profit $${(kpis.profitMTD/1000).toFixed(0)}K • Margin 14.5%. Industry Twin loss -$12K flagged. Forecast +12% if Espoo & Fornebu close on time.`
  },
  {
    id: "A04", name: "Grid", role: "Resource Allocation Agent", icon: "🧩", color: "#7c5cfc",
    office: "Bangalore", country: "India",
    insight: () => `Bangalore/Pune/Mohali: Avg util 82%. Warsaw QA 95% overloaded → rebalance to Oulu & Umeå bench (14% free). 3 >90% need relief this week.`
  },
  {
    id: "A05", name: "Watchtower", role: "Attrition Risk & Backup Agent", icon: "🛡️", color: "#f87171",
    office: "Kyiv", country: "Ukraine",
    insight: () => `Attrition Scan: 3 HIGH (Kyiv, Warsaw, Stockholm) — 2 NO backup! Kyiv no-handover — auto backup Lviv. Coverage 75% → 100% by EOD target.`
  },
  {
    id: "A06", name: "Beacon", role: "Onboarding & KT Agent", icon: "🎓", color: "#facc15",
    office: "Fornebu (Oslo)", country: "Norway",
    insight: () => `Onboarding: New hires Day-1 Concept <90 mins via RAG (Fornebu/Trondheim/Bergen mesh). Coverage 83% — 4 missing logs block ramp. 5 micro-learnings from Bangalore+Elias logs.`
  },
  {
    id: "A07", name: "Mnemos", role: "RAG Work Log Agent", icon: "🧠", color: "#a78bfa",
    office: "Minneapolis", country: "United States",
    insight: () => `RAG: 5 logs indexed • pgvector hybrid recall 0.72 p95 92ms. Nudge to 4 delinquents. “deployment steps” → Bangalore pgvector chunk instantly.`
  },
  {
    id: "A08", name: "Horizon", role: "Global Office Pulse Agent", icon: "🌍", color: "#38bdf8",
    office: "London", country: "United Kingdom",
    insight: () => `Global Pulse: ${offices.length} offices (Finland 8, Sweden 13, Norway 6, Poland 4, India 3 + Baltics/CEE/NA/APAC). 14k experts, 90+ countries. No office dark. Total headcount ~9,200 synced.`
  },
  {
    id: "A09", name: "Sentinel", role: "Risk & Compliance Agent", icon: "⚖️", color: "#fb923c",
    office: "Regensburg", country: "Germany",
    insight: () => `Compliance: GDPR 90d retention on work logs (FI/SE/DE). DPIA v0.8 ready. Industry delay triggers penalty €18K — legal notified (Paris/London).`
  },
  {
    id: "A10", name: "Pulse", role: "Client Satisfaction Agent", icon: "💬", color: "#f472b6",
    office: "Riga", country: "Latvia",
    insight: () => `Client Health: Nordics NPS 8.2↑, Banking SE 6.4↓ (Riga delays). QBR today Fornebu/Stockholm. Health FHIR 9.1 testimonial ready.`
  },
  {
    id: "A11", name: "Forge", role: "Innovation & Gap-Filler Agent", icon: "🔧", color: "#34d399",
    office: "Ostrava", country: "Czech Republic",
    insight: () => `Gaps Filled: auto backup detection, missing-log nudger, RAG bot, P&L early-warning, cross-border skill mesh (Pune↔Szczecin↔Kyiv). Suggests daily CEO brief 08:00 EET.`
  },
  {
    id: "A12", name: "Oracle", role: "CEO Executive Summary Agent", icon: "👑", color: "#d4a843",
    office: "Espoo (HQ)", country: "Finland",
    insight: () => `CEO Brief (Espoo HQ): ON TRACK but 2 at risk. Profit OK, 1 loss. Act now: backups for Kyiv/Warsaw/Stockholm, rescue Aug 18 deadline, enforce work-log compliance. Full drill-down below — all countries/states reporting.`
  },
];
