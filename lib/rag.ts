import { workLogs } from "./dummyData";

// Tiny in-memory hybrid search simulation
export function ragQuery(q: string) {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  const scored = workLogs.map(w => {
    const text = (w.summary + " " + w.author + " " + w.project + " " + w.tags.join(" ")).toLowerCase();
    let score = 0;
    terms.forEach(t => { if (text.includes(t)) score += 1; });
    // boost recent
    return { ...w, score };
  }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);
  if (scored.length===0) return workLogs.slice(0,2).map(w=>({ ...w, score: 0.1 }));
  return scored;
}
