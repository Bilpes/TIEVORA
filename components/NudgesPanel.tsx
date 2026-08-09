"use client";
import { useEffect, useState } from "react";

export default function NudgesPanel() {
  const [nudges, setNudges] = useState<any[]>([]);
  const [sending, setSending] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  const load = async () => {
    const r = await fetch("/api/nudges").then(x=>x.json()).catch(()=>({ nudges:[] }));
    setNudges(r.nudges||[]);
  };
  useEffect(()=>{ load(); },[]);

  const send = async (channel: "slack"|"email") => {
    setSending(channel);
    const r = await fetch("/api/nudges", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ channel }) }).then(x=>x.json()).catch(()=>({ ok:false }));
    setToast(r.message || `Nudges sent via ${channel}`);
    setSending(null);
    setTimeout(()=>setToast(""), 3000);
    load();
  };

  return (
    <div className="glass rounded-2xl p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold">🔔 Missing Work Logs • Slack / Email Nudges</h3>
        <span className="text-xs px-2 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/20">{nudges.length} delinquents</span>
      </div>
      <p className="text-xs text-white/60 mt-1">Manager view: only your country. CEO sees all. Nudges fire if no log in 48h. Role-based, audited.</p>

      <div className="mt-4 grid gap-2 max-h-[260px] overflow-auto pr-1">
        {nudges.length===0 && <div className="text-sm text-white/50 py-6 text-center">All caught up — no missing logs 🎉</div>}
        {nudges.map(n=> (
          <div key={n.id} className="rounded-xl bg-[#0f1a33]/60 border border-white/10 p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 grid place-items-center text-xs font-bold">{n.name.split(" ").map((s:string)=>s[0]).join("")}</div>
            <div className="flex-1">
              <div className="text-sm font-semibold">{n.name} <span className="text-white/50 font-normal">• {n.office} ({n.country})</span></div>
              <div className="text-xs text-white/50">{n.hoursSinceLog}h since last log • {n.slack} • {n.email}</div>
            </div>
            <span className={`text-[10px] px-2 py-1 rounded-full border ${n.risk==="High"?"bg-red-500/15 text-red-300 border-red-500/20":"bg-amber-500/15 text-amber-300 border-amber-500/20"}`}>{n.risk} RISK</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={()=>send("slack")} disabled={!!sending} className="h-10 px-5 rounded-xl bg-[#5a32ff] text-white font-bold flex items-center gap-2 disabled:opacity-50">
          {sending==="slack"?"Sending…":"Send Slack nudge → #work-logs"}
        </button>
        <button onClick={()=>send("email")} disabled={!!sending} className="h-10 px-5 rounded-xl bg-white text-[#0a0f1e] font-bold flex items-center gap-2 disabled:opacity-50">
          {sending==="email"?"Sending…":"Send Email nudge"}
        </button>
        <span className="text-[11px] text-white/40 self-center">Webhook: SLACK_WEBHOOK_URL / SMTP env — mock in dummy mode</span>
      </div>
      {toast && <div className="mt-3 rounded-xl bg-emerald-500/15 border border-emerald-500/20 p-3 text-sm text-emerald-200">{toast}</div>}
      <div className="mt-3 text-[11px] text-white/30">API: GET/POST /api/nudges • Respects NEXT_PUBLIC_DUMMY_MODE toggle</div>
    </div>
  );
}
