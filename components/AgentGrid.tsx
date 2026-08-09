"use client";
import { agentDefs } from "@/lib/agents";
import { useTievoraStore } from "@/lib/store";
import AgentCard from "./AgentCard";

export default function AgentGrid() {
  const { awakened, agents } = useTievoraStore();
  return (
    <div>
      <div className="flex items-end justify-between mb-3">
        <div>
          <h2 className="text-lg md:text-xl font-bold">12 Agents • Parallel Execution</h2>
          <p className="text-xs md:text-sm text-white/60">Each agent is pinned to an office/state. They wake together and stream CEO insights.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs">
          <span className={`px-3 py-1 rounded-full border ${awakened ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" : "bg-white/10 text-white/60 border-white/10"}`}>
            {awakened ? "● STREAMING" : "○ IDLE"}
          </span>
          <span className="text-white/40">{agentDefs.length} agents</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {agentDefs.map(a => (
          <AgentCard key={a.id} def={a} state={agents[a.id]} awakened={awakened} />
        ))}
      </div>
    </div>
  );
}
