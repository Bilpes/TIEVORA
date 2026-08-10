"use client";
import { useEffect, useState } from "react";
import { Volume2, VolumeX, Play, Square, Mic } from "lucide-react";
import { useTiaraStore } from "@/lib/store";
import { agentDefs } from "@/lib/agents";
import { isSpeechSupported, speakBriefing, stopSpeaking, clearAbort } from "@/lib/speech";

export default function SpeakBar() {
  const { awakened, agents, speakEnabled, setSpeakEnabled, speakingId, setSpeakingId, briefingActive, setBriefingActive, autoBriefingDone, setAutoBriefingDone } = useTiaraStore();
  const [mounted, setMounted] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(()=> {
    setMounted(true);
    setSupported(isSpeechSupported());
  }, []);

  useEffect(()=> {
    if (!speakEnabled || !awakened || briefingActive || autoBriefingDone) return;
    const allDone = agentDefs.every(a=> agents[a.id]?.status==="done" && agents[a.id]?.insight);
    if (!allDone) return;
    const list = agentDefs.map(a=> ({ id:a.id, name:a.name, office:a.office, insight: agents[a.id].insight || a.insight() }));
    clearAbort();
    setBriefingActive(true);
    setAutoBriefingDone(true);
    speakBriefing(list, "all", (idx,total,id)=> setSpeakingId(id)).finally(()=> {
      setSpeakingId(null);
      setBriefingActive(false);
    });
  }, [agents, awakened, speakEnabled, briefingActive, autoBriefingDone, setSpeakingId, setBriefingActive, setAutoBriefingDone]);

  const playCEO = async () => {
    clearAbort();
    const list = agentDefs.map(a=> ({ id:a.id, name:a.name, office:a.office, insight: agents[a.id]?.insight || a.insight() }));
    setBriefingActive(true);
    setAutoBriefingDone(true);
    await speakBriefing(list, "ceo", (idx,total,id)=> setSpeakingId(id));
    setSpeakingId(null);
    setBriefingActive(false);
  };
  const playAll = async () => {
    clearAbort();
    const list = agentDefs.map(a=> ({ id:a.id, name:a.name, office:a.office, insight: agents[a.id]?.insight || a.insight() }));
    setBriefingActive(true);
    setAutoBriefingDone(true);
    await speakBriefing(list, "all", (idx,total,id)=> setSpeakingId(id));
    setSpeakingId(null);
    setBriefingActive(false);
  };
  const stop = () => { stopSpeaking(); setSpeakingId(null); setBriefingActive(false); };

  // Hydration fix: server renders fallback (window undefined -> not supported)
  // Client initial render must match server, then after mount we switch to real UI
  if (!mounted) {
    return <div className="text-[11px] text-white/40">🔇 Voice not supported in this browser — use Chrome/Edge for speaking agents</div>;
  }
  if (!supported) {
    return <div className="text-[11px] text-white/40">🔇 Voice not supported in this browser — use Chrome/Edge for speaking agents</div>;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button onClick={()=> setSpeakEnabled(!speakEnabled)} className={`h-8 px-3 rounded-full border text-xs flex items-center gap-2 ${speakEnabled ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" : "bg-white/10 text-white/60 border-white/10"}`}>
        {speakEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        {speakEnabled ? "Voice ON" : "Voice OFF"}
      </button>
      <button onClick={playCEO} disabled={briefingActive} className="h-8 px-3 rounded-full bg-[#d4a843] text-[#0a0f1e] text-xs font-bold flex items-center gap-1.5 disabled:opacity-50">
        <Play className="w-3.5 h-3.5" /> CEO Brief (1 voice, 20s)
      </button>
      <button onClick={playAll} disabled={briefingActive} className="h-8 px-3 rounded-full bg-white text-[#0a0f1e] text-xs font-bold flex items-center gap-1.5 disabled:opacity-50">
        <Mic className="w-3.5 h-3.5" /> Play 13 Agents (~60s)
      </button>
      {briefingActive && (
        <button onClick={stop} className="h-8 px-3 rounded-full bg-red-500 text-white text-xs font-bold flex items-center gap-1.5">
          <Square className="w-3.5 h-3.5" /> Stop
        </button>
      )}
      {briefingActive && speakingId && (
        <span className="text-xs text-white/60">Speaking: <b className="text-white">{agentDefs.find(a=>a.id===speakingId)?.name}</b> ({agentDefs.find(a=>a.id===speakingId)?.office}) • {agentDefs.findIndex(a=>a.id===speakingId)+1}/13</span>
      )}
      {!briefingActive && awakened && speakEnabled && <span className="text-[11px] text-white/40">Auto-briefing ON — agents will speak when streaming completes</span>}
    </div>
  );
}
