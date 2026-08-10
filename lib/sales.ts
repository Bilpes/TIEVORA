import type { BusinessUnit } from "./config";

export type Opportunity = {
  id: string;
  title: string;
  buyer: string;
  country: string;
  city: string;
  valueEUR: number;
  deadline: string;
  source: string; // TED, Hilma, Mercell, etc.
  sourceUrl: string;
  description: string;
  competitors: string[];
  winProb: number; // 0-100
  fitScore: number; // 0-100
  unit: BusinessUnit;
  skills: string[];
  contactName: string;
  contactRole: string;
  contactEmail: string;
  contactLinkedIn?: string;
  status: "New" | "Hunting" | "Contacted" | "Proposal";
  hunterNote: string; // why Tieto wins
};

// Dummy pipeline — when NEXT_PUBLIC_DUMMY_MODE=false, API replaces this with live web search (Tavily/SerpAPI + TED/Hilma parsers)
export const opportunities: Opportunity[] = [
  {
    id: "OPP-2026-001",
    title: "EU Digital Identity Wallet — Pilot for Banks",
    buyer: "European Commission DG CONNECT",
    country: "EU",
    city: "Brussels",
    valueEUR: 2300000,
    deadline: "2026-09-12",
    source: "TED.europa.eu",
    sourceUrl: "https://ted.europa.eu/en/notice/-/detail/2026-123456",
    description: "Build eIDAS 2.0 wallet pilot for banking onboarding, strong auth + NFC. 18-month pilot, 3 countries.",
    competitors: ["Accenture", "CGI", "Nets/Capgemini"],
    winProb: 62,
    fitScore: 89,
    unit: "Banking",
    skills: ["eIDAS", "KYC", "React Native", "HSM"],
    contactName: "Laura Virtanen",
    contactRole: "Head of Digital Trust, DG CONNECT",
    contactEmail: "laura.virtanen@ec.europa.eu",
    contactLinkedIn: "linkedin.com/in/laura-virtanen",
    status: "New",
    hunterNote: "Tieto Banking has eIDAS stack from Fornebu/Riga + NetBank 2024 case. Pitch: reusable wallet SDK + 50% less integration time. Pune pod can deliver 40% cost advantage.",
  },
  {
    id: "OPP-2026-002",
    title: "Finnish Tax Admin — Legacy Modernization (Mainframe → Cloud)",
    buyer: "Vero / Finnish Tax Administration",
    country: "Finland",
    city: "Helsinki",
    valueEUR: 4800000,
    deadline: "2026-08-30",
    source: "Hilma.fi",
    sourceUrl: "https://www.hankintailmoitukset.fi/en/notice/2026-7890",
    description: "Migrate 30-yr-old COBOL tax engine to Azure microservices. Requires Finnish security clearance.",
    competitors: ["Gofore", "Tietoevry competitor: Fujitsu", "Solita"],
    winProb: 71,
    fitScore: 94,
    unit: "Transform",
    skills: ["COBOL", "Azure", "Java", "Security Clearance"],
    contactName: "Mikko Salonen",
    contactRole: "Procurement Lead, Vero",
    contactEmail: "mikko.salonen@vero.fi",
    status: "Hunting",
    hunterNote: "Home turf advantage: Espoo HQ + Tampere/Oulu legacy labs. Reference: Vero 2019 modernization phase 1 — we won. Pitch Pune+Espoo hybrid at 2.1x speed.",
  },
  {
    id: "OPP-2026-003",
    title: "Swedish Public Health — FHIR Care Data Platform",
    buyer: "Region Stockholm",
    country: "Sweden",
    city: "Stockholm",
    valueEUR: 3100000,
    deadline: "2026-09-05",
    source: "Upphandling.se",
    sourceUrl: "https://www.upphandling.se/notice/2026-4567",
    description: "Unified FHIR R4 platform for 7 hospitals, Care Connect integration.",
    competitors: ["Evry (now Tieto rival)", "Cambio", "Cerner/Oracle"],
    winProb: 58,
    fitScore: 87,
    unit: "Care",
    skills: ["FHIR R4", "Interop", "GDPR"],
    contactName: "Dr. Emma Lindqvist",
    contactRole: "CMIO, Region Stockholm",
    contactEmail: "emma.lindqvist@regionstockholm.se",
    status: "New",
    hunterNote: "Care unit Stockholm/Kista has FHIR accelerators + Turku Care 360 reference. Pitch: 90-day POC from Malmo pod.",
  },
  {
    id: "OPP-2026-004",
    title: "Pune Automotive — Factory Digital Twin",
    buyer: "Bharat Forge",
    country: "India",
    city: "Pune",
    valueEUR: 900000,
    deadline: "2026-08-28",
    source: "Mercell India",
    sourceUrl: "https://mercell.in/tender/2026-BF-twin",
    description: "Digital twin for forging line, IoT + predictive maintenance. Needs Industry + India delivery.",
    competitors: ["TCS", "Infosys", "PWC India"],
    winProb: 66,
    fitScore: 91,
    unit: "Industry",
    skills: ["Digital Twin", "IoT", "Azure IoT"],
    contactName: "Aarav Mehta (internal warm)",
    contactRole: "CTO, Bharat Forge — known via Pune EON network",
    contactEmail: "aarav.mehta@bharatforge.co.in",
    status: "Contacted",
    hunterNote: "Warm intro via Pune EON! Bangalore Industry twin team ready. Win angle: Pune on-site + Szczecin support = 30% cheaper than TCS.",
  },
  {
    id: "OPP-2026-005",
    title: "Ukraine Energy — Grid SCADA Cloud Migration",
    buyer: "Ukrenergo",
    country: "Ukraine",
    city: "Kyiv",
    valueEUR: 1200000,
    deadline: "2026-09-20",
    source: "TED + Prozorro",
    sourceUrl: "https://prozorro.gov.ua/tender/UA-2026-1122",
    description: "Migrate SCADA to cloud with resilience for wartime operations. EU donor funded.",
    competitors: ["SoftServe", "EPAM", "GlobalLogic"],
    winProb: 54,
    fitScore: 76,
    unit: "Connect",
    skills: ["SCADA", "AWS", "Resilience"],
    contactName: "Olena Petrenko",
    contactRole: "Advisor, Ukrenergo (Kyiv)",
    contactEmail: "o.petrenko@ua.energy",
    status: "New",
    hunterNote: "Kyiv/Lviv Connect has SCADA + wartime delivery creds. Pitch: Kyiv on-ground + Fornebu energy domain. EU grant helps.",
  },
  {
    id: "OPP-2026-006",
    title: "German Insurer — Claims AI Automation",
    buyer: "Allianz Direct",
    country: "Germany",
    city: "Munich",
    valueEUR: 2700000,
    deadline: "2026-09-15",
    source: "TED.europa.eu",
    sourceUrl: "https://ted.europa.eu/en/notice/2026-9988",
    description: "Automate claims with GenAI + document understanding, 40% cost reduction target.",
    competitors: ["Accenture", "Deloitte", "BearingPoint"],
    winProb: 48,
    fitScore: 82,
    unit: "Create",
    skills: ["GenAI", "RAG", "IDP"],
    contactName: "Hans Müller",
    contactRole: "Head of Claims Ops, Allianz Direct",
    contactEmail: "hans.mueller@allianz.de",
    status: "New",
    hunterNote: "Create Pune+Kyiv GenAI pod has RAG + IDP from ESG/TIARA work. Pitch: 6-week pilot with live claims data, Srinivasa reference.",
  },
];

export const salesKpis = {
  pipelineEUR: opportunities.reduce((s,o)=> s+o.valueEUR, 0),
  avgWinProb: Math.round(opportunities.reduce((s,o)=>s+o.winProb,0)/opportunities.length),
  hotLeads: opportunities.filter(o=> o.fitScore>85).length,
  closing30d: opportunities.filter(o=> new Date(o.deadline).getTime() - Date.now() < 30*24*3600*1000).length,
};
