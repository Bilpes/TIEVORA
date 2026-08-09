"use client";
import { projects, kpis } from "@/lib/dummyData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function FinancePanel() {
  const data = projects.map(p=>({ name: p.id, profit: p.profit, budget: p.budget, spent: p.spent }));
  return (
    <div className="glass rounded-2xl p-4 md:p-6">
      <h3 className="font-bold">💰 Profit / Loss Intelligence</h3>
      <p className="text-xs text-white/60">Ledger Agent watches every project P&L and forecasts.</p>
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3">
          <div className="text-[10px] tracking-widest text-white/50">FORECAST PROFIT</div>
          <div className="text-xl font-black text-emerald-300">+{(kpis.forecastProfit*100).toFixed(0)}%</div>
          <div className="text-xs text-white/60">If 2 at-risk rescued</div>
        </div>
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3">
          <div className="text-[10px] tracking-widest text-white/50">LOSS MAKING</div>
          <div className="text-xl font-black text-red-300">1 project</div>
          <div className="text-xs text-white/60">Logistics Twin -$12K</div>
        </div>
      </div>
      <div className="h-[220px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
            <YAxis stroke="#6b7280" fontSize={11} />
            <Tooltip contentStyle={{ background:"#0a0f1e", border:"1px solid #ffffff20", borderRadius:12 }} />
            <Bar dataKey="profit" radius={[6,6,0,0]}>
              {data.map((e,i)=><Cell key={i} fill={e.profit<0?"#f87171":"#34d399"} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-xs text-white/50 mt-2">Burn Rate ${kpis.burnRate.toLocaleString()} / mo • Click profit bar to drill down (mock)</div>
    </div>
  );
}
