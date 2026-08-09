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
    office: "Bengaluru", country: "India",
    insight: () => {
      const atRisk = projects.filter(p=>p.status!=="On Track").length;
      return `Bengaluru HQ: ${projects.length} active projects • ${atRisk} need attention. TIEVORA Core at ${projects[0].progress}% — on track. NeoBank at risk due to 2 pending handovers.`;
    }
  },
  {
    id: "A02", name: "Chrono", role: "Deadline & Milestone Agent", icon: "⏳", color: "#3dd5d6",
    office: "Hyderabad", country: "India",
    insight: () => `Hyderabad: Next deadline Aug 18 (Logistics Twin) 9 days — RED. Telco OSS Aug 30 — YELLOW. 2 deadlines breached risk if vendor not cleared. Auto-escalation triggered.`
  },
  {
    id: "A03", name: "Ledger", role: "Profit/Loss & Finance Agent", icon: "💰", color: "#4ade80",
    office: "Toronto", country: "Canada",
    insight: () => `Finance Pulse: MTD Revenue $${(kpis.revenueMTD/1000000).toFixed(2)}M • Profit $${(kpis.profitMTD/1000).toFixed(0)}K • Margin 14.5%. Logistics Twin loss -$12K flagged. Forecast +12% if Berlin & London close on time.`
  },
  {
    id: "A04", name: "Grid", role: "Resource Allocation Agent", icon: "🧩", color: "#7c5cfc",
    office: "Mumbai", country: "India",
    insight: () => `Mumbai: Avg utilization 82%. Priya Nair 95% overloaded → rebalance to Delhi bench (14% free). 3 high-util (>90%) need relief this week.`
  },
  {
    id: "A05", name: "Watchtower", role: "Attrition Risk & Backup Agent", icon: "🛡️", color: "#f87171",
    office: "Dubai", country: "UAE",
    insight: () => `Attrition Scan: 3 HIGH risks (Fatima, Priya, Alex) — 2 with NO backup! Fatima (Dubai) left without handover. Auto backup: assign Chen Wei + Arjun P. Backup coverage now 75% → target 100% by EOD.`
  },
  {
    id: "A06", name: "Beacon", role: "Onboarding & KT Agent", icon: "🎓", color: "#facc15",
    office: "Singapore", country: "Singapore",
    insight: () => `Onboarding: New hires get Day-1 Concept in <90 mins via RAG. Work-log coverage 83% — 4 missing logs block fast ramp. Generated 5 micro-learnings from Aarav + Chen logs.`
  },
  {
    id: "A07", name: "Mnemos", role: "RAG Work Log Agent", icon: "🧠", color: "#a78bfa",
    office: "San Francisco", country: "USA",
    insight: () => {
      return `RAG Status: 5 recent work logs indexed • pgvector + hybrid search (recall 0.72). Mandatory update enforced: nudge sent to 4 delinquents. Query "deployment steps" returns Aarav's pgvector chunk in 92ms.`;
    }
  },
  {
    id: "A08", name: "Horizon", role: "Global Office Pulse Agent", icon: "🌍", color: "#38bdf8",
    office: "London", country: "UK",
    insight: () => `Global Pulse: 12 offices online. APAC fintech live (SG), EMEA ESG review (LON), NA QBR (NYC). No office dark. Total headcount 525, 47 projects.`
  },
  {
    id: "A09", name: "Sentinel", role: "Risk & Compliance Agent", icon: "⚖️", color: "#fb923c",
    office: "Berlin", country: "Germany",
    insight: () => `Compliance: GDPR retention 90d enforced on work logs. DPIA v0.8 ready. Logistics delay triggers penalty clause $18K — legal notified.`
  },
  {
    id: "A10", name: "Pulse", role: "Client Satisfaction Agent", icon: "💬", color: "#f472b6",
    office: "New York", country: "USA",
    insight: () => `Client Health: US Retail NPS 8.2 (↑), FinServe SG 6.4 (↓ due delays). QBR today NYC will address. Health Stack NHS 9.1 — testimonial ready.`
  },
  {
    id: "A11", name: "Forge", role: "Innovation & Gap-Filler Agent", icon: "🔧", color: "#34d399",
    office: "Sydney", country: "Australia",
    insight: () => `Gaps Filled: Added auto backup detection, missing-log nudger, RAG onboarding bot, profit loss early-warning. Suggests: cross-office skill mesh + daily CEO brief.`
  },
  {
    id: "A12", name: "Oracle", role: "CEO Executive Summary Agent", icon: "👑", color: "#d4a843",
    office: "Bengaluru", country: "India",
    insight: () => `CEO Brief: Business ON TRACK but 2 projects at risk. Profit OK, 1 loss making. Act now: assign backups for 3 attrition risks, rescue logistics deadline, enforce work-log compliance. Full drill-down below.`
  },
];

export function simulateAgentStream() {
  // used in API route to stream
}
