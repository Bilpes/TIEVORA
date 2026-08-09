"use client";
import { create } from "zustand";
import { agentDefs } from "./agents";

export type AgentState = {
  id: string;
  status: "idle" | "waking" | "thinking" | "streaming" | "done";
  progress: number;
  insight: string;
  logs: string[];
};

type Store = {
  awakened: boolean;
  wakeWord: string | null;
  agents: Record<string, AgentState>;
  globalThinking: boolean;
  triggerAwaken: (word: string) => void;
  reset: () => void;
  updateAgent: (id: string, patch: Partial<AgentState>) => void;
};

function initialAgents(): Record<string, AgentState> {
  const m: Record<string, AgentState> = {};
  agentDefs.forEach(a => m[a.id] = { id: a.id, status: "idle", progress: 0, insight: "", logs: [] });
  return m;
}

export const useTievoraStore = create<Store>((set) => ({
  awakened: false,
  wakeWord: null,
  agents: initialAgents(),
  globalThinking: false,
  triggerAwaken: (word) => set({ awakened: true, wakeWord: word, globalThinking: true }),
  reset: () => set({ awakened: false, wakeWord: null, globalThinking: false, agents: initialAgents() }),
  updateAgent: (id, patch) => set(s => ({ agents: { ...s.agents, [id]: { ...s.agents[id], ...patch } } })),
}));
