"use client";
import { agentDefs } from "@/lib/agents";
import { useTievoraStore } from "@/lib/store";
import AgentCard from "./AgentCard";
import SpeakBar from "./SpeakBar";

export default function AgentGrid() {
  const { awakened, agents } = useTievoraStore();
  return (
    <div>
      <div className="flex flex-col gap-2 mb-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-lg md:text-xl font-bold">12 Agents • Parallel Execution • Speaking</h2>
            <p className="text-xs md:text-sm text-white/60">Each agent is pinned to an office/state. They wake together, stream AND speak CEO insights.</p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs">
            <span className={`px-3 py-1 rounded-full border ${awakened ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" : "bg-white/10 text-white/60 border-white/10"}`}>
              {awakened ? "● STREAMING" : "○ IDLE"}
            </span>
            <span className="text-white/40">{agentDefs.length} agents</span>
          </div>
        </div>
        <SpeakBar />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {agentDefs.map(a => (
          <AgentCard key={a.id} def={a} state={agents[a.id]} awakened={awakened} />
        ))}
      </div>
      <p className="text-[11px] text-white/40 mt-2">Tip: Tap 🔊 on any card to hear that agent alone. Or use “CEO Brief” / “Play 12 Agents” above. Agents auto-speak when Voice ON and streaming completes.</p>
    </div>
  );
}
