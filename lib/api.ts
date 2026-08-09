"use client";
import { config } from "./config";

async function fetchJSON(path: string, init?: RequestInit) {
  const base = config.apiBase;
  const url = path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
  // If dummyMode or no base, hit local Next API which already serves dummy with real shape
  const res = await fetch(url, { cache: "no-store", ...init, headers: { "Content-Type": "application/json", ...(init?.headers||{}) } });
  if (!res.ok) throw new Error(`API ${path} failed ${res.status}`);
  return res.json();
}

export const api = {
  offices: () => fetchJSON("/api/offices"),
  projects: () => fetchJSON("/api/projects"),
  resources: () => fetchJSON("/api/resources"),
  workLogs: () => fetchJSON("/api/work-log"),
  nudges: () => fetchJSON("/api/nudges"),
  sendNudges: (channel: "slack"|"email") => fetchJSON("/api/nudges", { method: "POST", body: JSON.stringify({ channel }) }),
  postWorkLog: (payload: any) => fetchJSON("/api/work-log", { method: "POST", body: JSON.stringify(payload) }),
};
