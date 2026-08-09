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
};

export type Resource = {
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
  lat: number; lng: number;
  headcount: number;
  projects: number;
  pulse: string;
};

export const offices: Office[] = [
  { id: "BLR", city: "Bengaluru", country: "India", state: "Karnataka", lat: 12.97, lng: 77.59, headcount: 124, projects: 8, pulse: "Sprint demos today, 2 releases green" },
  { id: "HYD", city: "Hyderabad", country: "India", state: "Telangana", lat: 17.38, lng: 78.48, headcount: 87, projects: 6, pulse: "Hiring surge for Data Pods" },
  { id: "MUM", city: "Mumbai", country: "India", state: "Maharashtra", lat: 19.07, lng: 72.87, headcount: 64, projects: 5, pulse: "Client workshop, finance UAT" },
  { id: "DEL", city: "New Delhi", country: "India", state: "Delhi", lat: 28.61, lng: 77.20, headcount: 42, projects: 3, pulse: "Gov project audit passed" },
  { id: "DXB", city: "Dubai", country: "UAE", state: "Dubai", lat: 25.2, lng: 55.27, headcount: 31, projects: 4, pulse: "New logo: logistics AAA" },
  { id: "SIN", city: "Singapore", country: "Singapore", state: "Central", lat: 1.35, lng: 103.81, headcount: 28, projects: 3, pulse: "Fintech pilot live" },
  { id: "LON", city: "London", country: "UK", state: "England", lat: 51.5, lng: -0.12, headcount: 36, projects: 4, pulse: "ESG reporting module review" },
  { id: "BER", city: "Berlin", country: "Germany", state: "Berlin", lat: 52.52, lng: 13.40, headcount: 22, projects: 2, pulse: "AI compliance workshop" },
  { id: "NYC", city: "New York", country: "USA", state: "New York", lat: 40.71, lng: -74.0, headcount: 54, projects: 5, pulse: "Retail client QBR today" },
  { id: "SFO", city: "San Francisco", country: "USA", state: "California", lat: 37.77, lng: -122.41, headcount: 38, projects: 3, pulse: "GenAI hackathon winners" },
  { id: "TOR", city: "Toronto", country: "Canada", state: "Ontario", lat: 43.65, lng: -79.38, headcount: 18, projects: 2, pulse: "Resource bench 12%" },
  { id: "SYD", city: "Sydney", country: "Australia", state: "NSW", lat: -33.86, lng: 151.2, headcount: 21, projects: 2, pulse: "Mining analytics go-live" },
];

export const projects: Project[] = [
  { id: "P01", name: "TIEVORA Core Platform", client: "Internal", region: "Global", office: "Bengaluru", status: "On Track", progress: 72, deadline: "2026-09-30", budget: 450000, spent: 298000, profit: 87000, team: 18, risk: "Low" },
  { id: "P02", name: "NeoBank Ledger", client: "FinServe SG", region: "APAC", office: "Singapore", status: "At Risk", progress: 48, deadline: "2026-08-22", budget: 320000, spent: 210000, profit: 34000, team: 12, risk: "Medium - 2 leaves" },
  { id: "P03", name: "Retail Insight 360", client: "US Retail Co", region: "USA", office: "New York", status: "On Track", progress: 61, deadline: "2026-10-15", budget: 520000, spent: 310000, profit: 112000, team: 15, risk: "Low" },
  { id: "P04", name: "Logistics Twin", client: "Emirates Logi", region: "MEA", office: "Dubai", status: "Delayed", progress: 34, deadline: "2026-08-18", budget: 280000, spent: 205000, profit: -12000, team: 9, risk: "High - vendor delay" },
  { id: "P05", name: "Health Stack FHIR", client: "NHS Partner", region: "UK", office: "London", status: "On Track", progress: 80, deadline: "2026-09-05", budget: 610000, spent: 420000, profit: 98000, team: 22, risk: "Low" },
  { id: "P06", name: "Telco 5G OSS", client: "Airtel", region: "India", office: "Hyderabad", status: "At Risk", progress: 55, deadline: "2026-08-30", budget: 400000, spent: 265000, profit: 41000, team: 14, risk: "Medium" },
  { id: "P07", name: "Mining Vision AI", client: "BHP", region: "ANZ", office: "Sydney", status: "Completed", progress: 100, deadline: "2026-07-28", budget: 190000, spent: 165000, profit: 25000, team: 7, risk: "None" },
  { id: "P08", name: "ESG Auto-Reporter", client: "Daimler", region: "EU", office: "Berlin", status: "On Track", progress: 66, deadline: "2026-09-18", budget: 350000, spent: 190000, profit: 76000, team: 11, risk: "Low" },
];

export const resources: Resource[] = [
  { id: "R01", name: "Aarav Mehta", role: "Tech Lead", office: "Bengaluru", country: "India", state: "Karnataka", utilization: 92, leavingRisk: "Low", backup: "Sneha R.", skills: ["Next.js","RAG","VectorDB"], lastLog: "Shipped RAG incremental sync + eval harness 2d ago" },
  { id: "R02", name: "Sneha Rao", role: "Sr Engineer", office: "Bengaluru", country: "India", state: "Karnataka", utilization: 88, leavingRisk: "Medium", backup: null, skills: ["Python","FastAPI"], lastLog: "API for work-log ingestion done" },
  { id: "R03", name: "Vikram Singh", role: "PM", office: "Hyderabad", country: "India", state: "Telangana", utilization: 76, leavingRisk: "Low", backup: "Ananya K.", skills: ["Agile","Risk"], lastLog: "Updated RAID log for Telco OSS" },
  { id: "R04", name: "Fatima Al Zahra", role: "Data Scientist", office: "Dubai", country: "UAE", state: "Dubai", utilization: 81, leavingRisk: "High", backup: null, skills: ["LLM","Eval"], lastLog: "Left for sick leave - no handover doc!" },
  { id: "R05", name: "James Carter", role: "Product Owner", office: "New York", country: "USA", state: "New York", utilization: 68, leavingRisk: "Low", backup: "Maya L.", skills: ["Discovery"], lastLog: "QBR deck ready" },
  { id: "R06", name: "Priya Nair", role: "QA Lead", office: "Mumbai", country: "India", state: "Maharashtra", utilization: 95, leavingRisk: "High", backup: null, skills: ["Playwright"], lastLog: "Test plan overdue 4 days" },
  { id: "R07", name: "Chen Wei", role: "ML Eng", office: "Singapore", country: "Singapore", state: "Central", utilization: 84, leavingRisk: "Medium", backup: "Arjun P.", skills: ["Pytorch","RAG"], lastLog: "Daily work log: chunking strategy + hybrid search" },
  { id: "R08", name: "Emily Stone", role: "UX Lead", office: "London", country: "UK", state: "England", utilization: 73, leavingRisk: "Low", backup: "Noah B.", skills: ["Figma","Research"], lastLog: "Design system tokens published" },
  { id: "R09", name: "Hans Müller", role: "Compliance", office: "Berlin", country: "Germany", state: "Berlin", utilization: 64, leavingRisk: "Low", backup: "Lena K.", skills: ["GDPR","ISO"], lastLog: "DPIA draft v0.8" },
  { id: "R10", name: "Alex Rivera", role: "DevOps", office: "San Francisco", country: "USA", state: "California", utilization: 90, leavingRisk: "Medium", backup: null, skills: ["K8s","Terraform"], lastLog: "No work log for 6 days - NUDGE" },
  { id: "R11", name: "Olivia Brown", role: "Finance Analyst", office: "Toronto", country: "Canada", state: "Ontario", utilization: 71, leavingRisk: "Low", backup: "Samir D.", skills: ["FP&A"], lastLog: "Margin calc updated" },
  { id: "R12", name: "Liam O'Connor", role: "Support Eng", office: "Sydney", country: "Australia", state: "NSW", utilization: 77, leavingRisk: "Low", backup: "Zoe M.", skills: ["SRE"], lastLog: "Runbook for Mining AI updated" },
];

export const workLogs = [
  { id: "W1", author: "Aarav Mehta", project: "TIEVORA Core", date: "2026-08-08", summary: "Implemented vector store with pgvector, chunk size 512, hybrid search 0.72 recall", tags: ["RAG","pgvector"] },
  { id: "W2", author: "Chen Wei", project: "NeoBank Ledger", date: "2026-08-08", summary: "Fine-tuned reranker, latency down 180ms -> 92ms p95", tags: ["RAG","perf"] },
  { id: "W3", author: "Sneha Rao", project: "TIEVORA Core", date: "2026-08-07", summary: "Auth + RBAC for work-log API, row-level security", tags: ["auth"] },
  { id: "W4", author: "Priya Nair", project: "Retail Insight", date: "2026-08-06", summary: "E2E tests for executive dashboard, 42 cases", tags: ["qa"] },
  { id: "W5", author: "Hans Müller", project: "ESG Auto-Reporter", date: "2026-08-05", summary: "Mapped GDPR Art 35 for RAG logs, retention 90d", tags: ["compliance"] },
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
