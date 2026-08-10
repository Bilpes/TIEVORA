import type { BusinessUnit } from "./config";
export type Project = {
  id: string;
  name: string;
  client: string;
  region: string;
  office: string;
  status: "On Track" | "At Risk" | "Delayed" | "Completed";
  progress: number;
  deadline: string;
  budget: number;
  spent: number;
  profit: number;
  team: number;
  risk: string;
  unit: BusinessUnit;
};

export type Resource = {
  isKnowledgeOwner: boolean;
  logSource: "manual" | "auto"; // hybrid: only <200 owners type manually, rest auto from Git/Jira

  id: string;
  name: string;
  role: string;
  office: string;
  country: string;
  state: string;
  utilization: number;
  leavingRisk: "Low" | "Medium" | "High";
  backup: string | null;
  skills: string[];
  lastLog: string;
};

export type Office = {
  id: string;
  city: string;
  country: string;
  state: string;
  address: string;
  lat: number; lng: number;
  headcount: number;
  projects: number;
  pulse: string;
  unit: BusinessUnit;
  source: string;
};

// Source: https://www.tieto.com/en/contact-us/locations/ — Tietoevry (now Tieto) global presence: 14,000 experts, 90+ countries
// Consolidated to city-level offices. Full addresses in Tieto page; here we keep city+country+state hierarchy for CEO pulse.
export const offices: Office[] = [
  // Finland — 8 cities
  { id: "FI-ESPOO", city: "Espoo (HQ)", country: "Finland", state: "Uusimaa", address: "Keilalahdentie 2-4, FI-02101 Espoo", lat: 60.17, lng: 24.83, headcount: 2100, projects: 24, pulse: "HQ pulse: Platform releases, board brief today", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "FI-TRE", city: "Tampere", country: "Finland", state: "Pirkanmaa", address: "Hatanpään valtatie 30, Tampere", lat: 61.49, lng: 23.78, headcount: 420, projects: 9, pulse: "Industrial IoT sprints — 2 demos green", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "FI-OULU", city: "Oulu", country: "Finland", state: "North Ostrobothnia", address: "Yrttipellontie 1 A, Oulu", lat: 65.01, lng: 25.46, headcount: 310, projects: 7, pulse: "5G / Telco stack — UAT passed", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "FI-TKU", city: "Turku", country: "Finland", state: "Southwest Finland", address: "Tykistökatu 4B, Turku", lat: 60.45, lng: 22.26, headcount: 180, projects: 4, pulse: "Health & Care module review", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "FI-JKL", city: "Jyväskylä", country: "Finland", state: "Central Finland", address: "Mattilanniemi 6-8, Jyväskylä", lat: 62.24, lng: 25.74, headcount: 150, projects: 3, pulse: "Education cloud rollout", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "FI-KUO", city: "Kuopio", country: "Finland", state: "North Savo", address: "Microkatu 1, Kuopio", lat: 62.89, lng: 27.67, headcount: 110, projects: 3, pulse: "Data & Analytics pod", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "FI-LPR", city: "Lappeenranta", country: "Finland", state: "South Karelia", address: "Teknologiapuistonkatu 10, Lappeenranta", lat: 61.06, lng: 28.18, headcount: 85, projects: 2, pulse: "Energy sector delivery", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "FI-VAN", city: "Vantaa", country: "Finland", state: "Uusimaa", address: "Koivuhaantie 2-4 B, Vantaa", lat: 60.29, lng: 25.03, headcount: 95, projects: 2, pulse: "Card Services — PCI audit", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },

  // Sweden — 17 cities
  { id: "SE-STO", city: "Stockholm (Solna)", country: "Sweden", state: "Stockholm", address: "Gustav III:s Blvd 130, Solna", lat: 59.36, lng: 18.0, headcount: 1800, projects: 22, pulse: "Banking & Fintech hub — 3 releases this week", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "SE-GOT", city: "Göteborg", country: "Sweden", state: "Västra Götaland", address: "Kämpegatan 3, Göteborg", lat: 57.70, lng: 11.97, headcount: 720, projects: 14, pulse: "Automotive & Industry — sprint review", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "SE-MAL", city: "Malmö", country: "Sweden", state: "Skåne", address: "Hallenborgs gata 1A, Malmö", lat: 55.60, lng: 13.0, headcount: 380, projects: 7, pulse: "Public sector digitization", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "SE-LUL", city: "Luleå", country: "Sweden", state: "Norrbotten", address: "Magasinsgatan 8, Luleå", lat: 65.58, lng: 22.15, headcount: 260, projects: 5, pulse: "Green steel / Arctic data", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "SE-UME", city: "Umeå", country: "Sweden", state: "Västerbotten", address: "Kuratorvägen 2B, Umeå", lat: 63.82, lng: 20.25, headcount: 210, projects: 4, pulse: "Research & AI lab", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "SE-LIN", city: "Linköping", country: "Sweden", state: "Östergötland", address: "Teknikringen 9, Linköping", lat: 58.40, lng: 15.62, headcount: 190, projects: 4, pulse: "Aerospace systems", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "SE-KAR", city: "Karlstad", country: "Sweden", state: "Värmland", address: "Tullhusgatan 1A, Karlstad", lat: 59.40, lng: 13.50, headcount: 140, projects: 3, pulse: "Fintech ops", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "SE-JKP", city: "Jönköping", country: "Sweden", state: "Jönköping", address: "Vallgatan 8, Jönköping", lat: 57.78, lng: 14.17, headcount: 95, projects: 2, pulse: "SME cloud migration", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "SE-KIS", city: "Kista", country: "Sweden", state: "Stockholm", address: "Färögatan 33, Kista", lat: 59.40, lng: 17.94, headcount: 160, projects: 3, pulse: "Telecom R&D", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "SE-UPS", city: "Uppsala", country: "Sweden", state: "Uppsala", address: "Storgatan 19, Uppsala", lat: 59.85, lng: 17.63, headcount: 110, projects: 2, pulse: "Medtech platform", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "SE-KALIX", city: "Kalix", country: "Sweden", state: "Norrbotten", address: "Gymnasiegatan 15, Kalix", lat: 65.85, lng: 23.13, headcount: 45, projects: 1, pulse: "Support services", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "SE-SKE", city: "Skellefteå", country: "Sweden", state: "Västerbotten", address: "Kyrkgränd 5, Skellefteå", lat: 64.75, lng: 21.07, headcount: 85, projects: 1, pulse: "Battery factory IT", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "SE-OSD", city: "Östersund", country: "Sweden", state: "Jämtland", address: "Hamngatan 19, Östersund", lat: 63.17, lng: 14.63, headcount: 65, projects: 1, pulse: "Gov services", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },

  // Norway — 9 cities
  { id: "NO-FOR", city: "Fornebu (Oslo)", country: "Norway", state: "Viken", address: "Snarøyveien 20, Fornebu", lat: 59.90, lng: 10.62, headcount: 950, projects: 16, pulse: "Norway HQ — Banking & Energy", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "NO-TRD", city: "Trondheim", country: "Norway", state: "Trøndelag", address: "Sluppenvegen 17A, Trondheim", lat: 63.43, lng: 10.39, headcount: 420, projects: 8, pulse: "Energy & Industry AI", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "NO-BER", city: "Bergen", country: "Norway", state: "Vestland", address: "Folke Bernadottes vei 40, Bergen", lat: 60.39, lng: 5.32, headcount: 280, projects: 6, pulse: "Maritime & Finance", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "NO-STA", city: "Stavanger", country: "Norway", state: "Rogaland", address: "Maskinveien 15, Stavanger", lat: 58.97, lng: 5.73, headcount: 220, projects: 5, pulse: "Oil & Gas digitization", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "NO-KRS", city: "Kristiansand", country: "Norway", state: "Agder", address: "Kjøita 6, Kristiansand", lat: 58.14, lng: 7.99, headcount: 90, projects: 2, pulse: "Public sector", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "NO-BOD", city: "Bodø", country: "Norway", state: "Nordland", address: "Sjøgt 40-42, Bodø", lat: 67.28, lng: 14.40, headcount: 70, projects: 1, pulse: "Arctic logistics", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },

  // Denmark & Baltics & Poland
  { id: "DK-CPH", city: "Copenhagen", country: "Denmark", state: "Capital Region", address: "Østbanegade 121-123, Copenhagen", lat: 55.70, lng: 12.59, headcount: 320, projects: 7, pulse: "Danish finance hub", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "EE-TLL", city: "Tallinn", country: "Estonia", state: "Harju", address: "A.H.Tammsaare tee 47, Tallinn", lat: 59.40, lng: 24.70, headcount: 210, projects: 5, pulse: "Banktech & E-gov", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "LV-RIX", city: "Riga", country: "Latvia", state: "Riga", address: "Roberta Hirša 1, Riga", lat: 56.94, lng: 24.10, headcount: 380, projects: 8, pulse: "Latvia hub — banking", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "LT-VNO", city: "Vilnius", country: "Lithuania", state: "Vilnius", address: "Lvivo g. 105A, Vilnius", lat: 54.69, lng: 25.27, headcount: 260, projects: 5, pulse: "Fintech & Cloud", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "PL-WAW", city: "Warsaw", country: "Poland", state: "Masovian", address: "Prosta 28, Warsaw", lat: 52.23, lng: 21.0, headcount: 620, projects: 13, pulse: "Poland HQ — Create & Banking", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "PL-SZC", city: "Szczecin", country: "Poland", state: "West Pomeranian", address: "Al. Piastow 30, Szczecin", lat: 53.42, lng: 14.55, headcount: 540, projects: 11, pulse: "Nearshore delivery center", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "PL-KRK", city: "Kraków", country: "Poland", state: "Lesser Poland", address: "ul. Wadowicka 7, Kraków", lat: 50.05, lng: 19.94, headcount: 310, projects: 6, pulse: "Support services", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "PL-WRO", city: "Wrocław", country: "Poland", state: "Lower Silesian", address: "Szczytnicka 11, Wrocław", lat: 51.10, lng: 17.03, headcount: 260, projects: 5, pulse: "Create Poland — cloud", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "CZ-OVA", city: "Ostrava", country: "Czech Republic", state: "Moravian-Silesian", address: "nám. Biskupa Bruna 3399/5, Ostrava", lat: 49.83, lng: 18.26, headcount: 290, projects: 6, pulse: "Czechia — product engineering", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "CZ-BRN", city: "Brno", country: "Czech Republic", state: "South Moravian", address: "Vlněna 5, Brno", lat: 49.19, lng: 16.60, headcount: 180, projects: 4, pulse: "Brno dev hub", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },

  // Central & Southern Europe
  { id: "AT-VIE", city: "Vienna", country: "Austria", state: "Vienna", address: "Handelskai 94-96, Vienna", lat: 48.23, lng: 16.38, headcount: 140, projects: 3, pulse: "Austria — fintech", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "DE-REG", city: "Regensburg", country: "Germany", state: "Bavaria", address: "Im Gewerbepark C15, Regensburg", lat: 49.01, lng: 12.09, headcount: 120, projects: 3, pulse: "Germany — industry", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "FR-PAR", city: "Paris", country: "France", state: "Île-de-France", address: "60 Av Charles de Gaulle, Neuilly-sur-Seine", lat: 48.88, lng: 2.27, headcount: 45, projects: 2, pulse: "France — sales & delivery", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "UK-LON", city: "London", country: "United Kingdom", state: "England", address: "75 King William St, London EC4N 7BE", lat: 51.51, lng: -0.08, headcount: 180, projects: 4, pulse: "UK — Financial Services", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "ES-MAD", city: "Madrid", country: "Spain", state: "Madrid", address: "Calle Santa Leonor 65, Madrid", lat: 40.43, lng: -3.63, headcount: 55, projects: 2, pulse: "Iberia", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },

  // India — 3 cities (Tietoevry India)
  { id: "IN-PNQ", city: "Pune", country: "India", state: "Maharashtra", address: "EON Free Zone, Kharadi, Pune 411014", lat: 18.56, lng: 73.95, headcount: 820, projects: 18, pulse: "India HQ — Product engineering, Connect & Care", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "IN-BLR", city: "Bangalore", country: "India", state: "Karnataka", address: "Sattva Global City, Mysore Road, Bangalore 560059", lat: 12.96, lng: 77.52, headcount: 950, projects: 20, pulse: "Largest India DC — Banking & Industry", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "IN-MOH", city: "Mohali", country: "India", state: "Punjab", address: "QuarkCity, Phase VIII, Mohali 160059", lat: 30.70, lng: 76.71, headcount: 380, projects: 7, pulse: "North India delivery", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },

  // Rest of world
  { id: "BG-SOF", city: "Sofia", country: "Bulgaria", state: "Sofia", address: "blvd Professor Tsvetan Lazarov 67, Sofia", lat: 42.69, lng: 23.32, headcount: 220, projects: 5, pulse: "Bulgaria — Create", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "RS-BEG", city: "Belgrade", country: "Serbia", state: "Belgrade", address: "Kneza Miloša 88-90, Belgrade", lat: 44.80, lng: 20.46, headcount: 95, projects: 2, pulse: "FinTech — Serbia", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "UA-KYV", city: "Kyiv", country: "Ukraine", state: "Kyiv", address: "Verkhnii Val 28/12, Kyiv", lat: 50.46, lng: 30.50, headcount: 340, projects: 7, pulse: "Ukraine — Create & Support", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "UA-LVI", city: "Lviv", country: "Ukraine", state: "Lviv", address: "BC Technopark, Heroiv UPA 72, Lviv", lat: 49.83, lng: 24.02, headcount: 210, projects: 5, pulse: "Lviv delivery", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "CN-BEI", city: "Beijing", country: "China", state: "Beijing", address: "Global Trade Centre, Beijing", lat: 39.96, lng: 116.40, headcount: 110, projects: 2, pulse: "China — Beijing", unit: "Connect" as BusinessUnit, source: "tieto.com/locations" },
  { id: "CN-CDU", city: "Chengdu", country: "China", state: "Sichuan", address: "Tianfu Software Park, Chengdu", lat: 30.53, lng: 104.07, headcount: 85, projects: 2, pulse: "Chengdu — nearshore", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "MY-KUL", city: "Kuala Lumpur", country: "Malaysia", state: "Selangor", address: "The Pinnacle, Bandar Sunway", lat: 3.06, lng: 101.60, headcount: 45, projects: 1, pulse: "Malaysia", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "SG-SIN", city: "Singapore", country: "Singapore", state: "Central", address: "20 Collyer Quay, Singapore", lat: 1.28, lng: 103.85, headcount: 35, projects: 1, pulse: "Eye-Share Singapore", unit: "Connect" as BusinessUnit, source: "tieto.com/locations" },
  { id: "US-MIN", city: "Minneapolis", country: "United States", state: "Minnesota", address: "1350 Lagoon Ave, Minneapolis, MN 55408", lat: 44.95, lng: -93.29, headcount: 160, projects: 4, pulse: "MentorMate — US HQ", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "US-NPB", city: "Newport Beach", country: "United States", state: "California", address: "5000 Birch St, Newport Beach, CA", lat: 33.61, lng: -117.87, headcount: 45, projects: 1, pulse: "California — virtual office", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "BR-RIO", city: "Rio de Janeiro", country: "Brazil", state: "Rio de Janeiro", address: "Av Rio Branco 89, Rio", lat: -22.90, lng: -43.17, headcount: 25, projects: 1, pulse: "Brazil — Create", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
  { id: "AR-BUE", city: "Buenos Aires", country: "Argentina", state: "Buenos Aires", address: "Cnel. Niceto Vega 4601, BA", lat: -34.58, lng: -58.43, headcount: 35, projects: 1, pulse: "Argentina — Create", unit: "Create" as BusinessUnit, source: "tieto.com/locations" },
];

export const projects: Project[] = [
  { id: "P01", name: "TIARA Core Platform", client: "Internal", region: "Global", office: "Espoo (HQ)", status: "On Track", progress: 72, deadline: "2026-09-30", budget: 450000, spent: 298000, profit: 87000, team: 18, risk: "Low", unit: "Transform" as BusinessUnit },
  { id: "P02", name: "NeoBank Ledger", client: "FinServe SG/SE", region: "Nordics+APAC", office: "Stockholm (Solna)", status: "At Risk", progress: 48, deadline: "2026-08-22", budget: 320000, spent: 210000, profit: 34000, team: 12, risk: "Medium - 2 leaves in Riga", unit: "Banking" as BusinessUnit },
  { id: "P03", name: "Care 360 FHIR", client: "Nordic Health", region: "Finland", office: "Espoo (HQ)", status: "On Track", progress: 80, deadline: "2026-09-05", budget: 610000, spent: 420000, profit: 98000, team: 22, risk: "Low", unit: "Transform" as BusinessUnit },
  { id: "P04", name: "Industry Twin", client: "Industrial SE/NO", region: "Nordics", office: "Göteborg", status: "Delayed", progress: 34, deadline: "2026-08-18", budget: 280000, spent: 205000, profit: -12000, team: 9, risk: "High - vendor delay Luleå", unit: "Industry" as BusinessUnit },
  { id: "P05", name: "BankTech Cards", client: "Banktech NO/FI", region: "Norway", office: "Fornebu (Oslo)", status: "On Track", progress: 66, deadline: "2026-09-18", budget: 520000, spent: 310000, profit: 112000, team: 15, risk: "Low", unit: "Transform" as BusinessUnit },
  { id: "P06", name: "Connect 5G OSS", client: "Telco FI", region: "Finland", office: "Oulu", status: "At Risk", progress: 55, deadline: "2026-08-30", budget: 400000, spent: 265000, profit: 41000, team: 14, risk: "Medium", unit: "Connect" as BusinessUnit },
  { id: "P07", name: "India Engineering Pod", client: "Cross-border", region: "India", office: "Bangalore", status: "On Track", progress: 88, deadline: "2026-09-12", budget: 350000, spent: 210000, profit: 76000, team: 24, risk: "Low", unit: "Transform" as BusinessUnit },
  { id: "P08", name: "Kyiv Create Accelerate", client: "Ukraine/EU", region: "Ukraine", office: "Kyiv", status: "On Track", progress: 61, deadline: "2026-10-15", budget: 190000, spent: 115000, profit: 38000, team: 18, risk: "Low", unit: "Transform" as BusinessUnit },
];

export const resources: Resource[] = [
  { id: "R01", isKnowledgeOwner: true, logSource: "manual", name: "Aarav Mehta", role: "Tech Lead", office: "Bangalore", country: "India", state: "Karnataka", utilization: 92, leavingRisk: "Low", backup: "Sneha R.", skills: ["Next.js","RAG","VectorDB"], lastLog: "Shipped RAG incremental sync + eval harness — Bangalore pod" },
  { id: "R02", isKnowledgeOwner: true, logSource: "manual", name: "Sneha Rao", role: "Sr Engineer", office: "Pune", country: "India", state: "Maharashtra", utilization: 88, leavingRisk: "Medium", backup: null, skills: ["Python","FastAPI"], lastLog: "API for work-log ingestion — Pune" },
  { id: "R03", isKnowledgeOwner: true, logSource: "manual", name: "Elias Virtanen", role: "PM", office: "Espoo (HQ)", country: "Finland", state: "Uusimaa", utilization: 76, leavingRisk: "Low", backup: "Ananya K.", skills: ["Agile","SAFe"], lastLog: "Updated RAID for Espoo HQ platform" },
  { id: "R04", isKnowledgeOwner: true, logSource: "manual", name: "Fatima Al Zahra", role: "Data Scientist", office: "Kyiv", country: "Ukraine", state: "Kyiv", utilization: 81, leavingRisk: "High", backup: null, skills: ["LLM","Eval"], lastLog: "No handover — attrition risk Kyiv" },
  { id: "R05", isKnowledgeOwner: true, logSource: "manual", name: "Lars Hansen", role: "Product Owner", office: "Fornebu (Oslo)", country: "Norway", state: "Viken", utilization: 68, leavingRisk: "Low", backup: "Maya L.", skills: ["Discovery"], lastLog: "QBR deck — Fornebu banking" },
  { id: "R06", isKnowledgeOwner: true, logSource: "manual", name: "Priya Nair", role: "QA Lead", office: "Warsaw", country: "Poland", state: "Masovian", utilization: 95, leavingRisk: "High", backup: null, skills: ["Playwright"], lastLog: "Test plan overdue 4 days — Szczecin support" },
  { id: "R07", isKnowledgeOwner: false, logSource: "auto", name: "Chen Wei", role: "ML Eng", office: "Singapore", country: "Singapore", state: "Central", utilization: 84, leavingRisk: "Medium", backup: "Arjun P.", skills: ["Pytorch","RAG"], lastLog: "Hybrid search chunk 512 — Singapore pilot" },
  { id: "R08", isKnowledgeOwner: false, logSource: "auto", name: "Emily Stone", role: "UX Lead", office: "London", country: "United Kingdom", state: "England", utilization: 73, leavingRisk: "Low", backup: "Noah B.", skills: ["Figma","Research"], lastLog: "Design tokens published — UK" },
  { id: "R09", isKnowledgeOwner: true, logSource: "manual", name: "Hans Müller", role: "Compliance", office: "Regensburg", country: "Germany", state: "Bavaria", utilization: 64, leavingRisk: "Low", backup: "Lena K.", skills: ["GDPR","ISO"], lastLog: "DPIA draft v0.8 — Regensburg" },
  { id: "R10", isKnowledgeOwner: false, logSource: "auto", name: "Mikael Lindqvist", role: "DevOps", office: "Stockholm (Solna)", country: "Sweden", state: "Stockholm", utilization: 90, leavingRisk: "Medium", backup: null, skills: ["K8s","Terraform"], lastLog: "No work log 6 days — Stockholm NUDGE" },
  { id: "R11", isKnowledgeOwner: false, logSource: "auto", name: "Katarzyna Nowak", role: "Finance Analyst", office: "Szczecin", country: "Poland", state: "West Pomeranian", utilization: 71, leavingRisk: "Low", backup: "Samir D.", skills: ["FP&A"], lastLog: "Margin calc — Poland DC" },
  { id: "R12", isKnowledgeOwner: false, logSource: "auto", name: "Olena Petrenko", role: "Support Eng", office: "Lviv", country: "Ukraine", state: "Lviv", utilization: 77, leavingRisk: "Low", backup: "Zoe M.", skills: ["SRE"], lastLog: "Runbook for Kyiv Create updated — Lviv" },
];

export const workLogs = [
  { id: "W1", author: "Aarav Mehta", project: "TIARA Core", date: "2026-08-08", summary: "Implemented vector store pgvector 512 chunk, hybrid search recall 0.72 — Bangalore DC", tags: ["RAG","pgvector","Bangalore"] },
  { id: "W2", author: "Chen Wei", project: "NeoBank Ledger", date: "2026-08-08", summary: "Reranker tuned p95 180ms → 92ms for Stockholm/Riga banking flows", tags: ["RAG","perf","Stockholm"] },
  { id: "W3", author: "Elias Virtanen", project: "TIARA Core", date: "2026-08-07", summary: "Auth + RBAC for work-log API (Espoo HQ) — row-level security per office", tags: ["auth","Espoo"] },
  { id: "W4", author: "Katarzyna Nowak", project: "Finance", date: "2026-08-06", summary: "E2E tests executive dashboard 42 cases — Szczecin/Warsaw", tags: ["qa","Poland"] },
  { id: "W5", author: "Hans Müller", project: "ESG Auto-Reporter", date: "2026-08-05", summary: "GDPR Art35 for RAG logs retention 90d — Germany/Finland", tags: ["compliance","Regensburg"] },
];

export const kpis = {
  revenueMTD: 2840000,
  profitMTD: 412000,
  burnRate: 860000,
  forecastProfit: 1.12,
  deadlineAdherence: 82,
  bench: 14,
  attritionRiskCount: 3,
  missingLogs: 4,
};
