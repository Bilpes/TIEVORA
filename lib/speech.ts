"use client";

// Web Speech API wrapper — each agent speaks its insight to CEO
let voicesCache: SpeechSynthesisVoice[] = [];
let _abort = false;
export function clearAbort() { _abort = false; }

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return Promise.resolve([]);
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    let voices = synth.getVoices();
    if (voices.length) { voicesCache = voices; resolve(voices); return; }
    const handler = () => {
      voices = synth.getVoices();
      voicesCache = voices;
      synth.removeEventListener("voiceschanged", handler);
      resolve(voices);
    };
    synth.addEventListener("voiceschanged", handler);
    setTimeout(() => {
      voices = synth.getVoices();
      voicesCache = voices;
      resolve(voices);
    }, 800);
  });
}

export function isSpeechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function stopSpeaking() {
  _abort = true;
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export function pickVoiceForAgent(agentId: string, voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices.length) return null;
  let h = 0;
  for (let i=0;i<agentId.length;i++) h = (h*31 + agentId.charCodeAt(i)) >>> 0;
  const en = voices.filter(v=> v.lang.startsWith("en"));
  const pool = en.length ? en : voices;
  return pool[h % pool.length] || voices[h % voices.length];
}

export async function speak(text: string, opts?: { agentId?: string; rate?: number; pitch?: number; volume?: number; onStart?:()=>void; onEnd?:()=>void; }): Promise<void> {
  if (!isSpeechSupported() || _abort) return;
  await loadVoices();
  if (_abort) return;
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    const voice = opts?.agentId ? pickVoiceForAgent(opts.agentId, voicesCache) : null;
    if (voice) { utter.voice = voice; utter.lang = voice.lang; }
    else utter.lang = "en-US";
    utter.rate = opts?.rate ?? 1.0;
    utter.pitch = opts?.pitch ?? 1.0;
    utter.volume = opts?.volume ?? 1.0;
    utter.onstart = () => opts?.onStart?.();
    utter.onend = () => { opts?.onEnd?.(); resolve(); };
    utter.onerror = () => { opts?.onEnd?.(); resolve(); };
    if (_abort) { resolve(); return; }
    synth.speak(utter);
  });
}

export async function speakBriefing(agents: { id:string; name:string; office:string; insight:string }[], mode: "ceo" | "all" = "all", onProgress?: (idx:number, total:number, id:string)=>void) {
  if (!isSpeechSupported()) return;
  _abort = false;
  stopSpeaking();
  // clear abort flag after cancel
  _abort = false;
  await loadVoices();
  if (_abort) return;
  await speak("Tiara awake. Thirteen agents reporting live to CEO.", { rate: 1.05 });
  if (_abort) return;
  if (mode === "ceo") {
    const oracle = agents.find(a=> a.id==="A12") || agents[agents.length-1];
    if (oracle && !_abort) {
      onProgress?.(0,1,oracle.id);
      await speak(`CEO Brief from ${oracle.name} at ${oracle.office}: ${oracle.insight}`, { agentId: oracle.id, rate: 1.0, pitch: 0.95 });
    }
    if (!_abort) await speak("Briefing complete. Scroll for details or say Hello Tiara again.", { rate: 1.0 });
    return;
  }
  for (let i=0;i<agents.length;i++) {
    if (_abort) break;
    const a = agents[i];
    onProgress?.(i, agents.length, a.id);
    let snippet = a.insight.split(".")[0];
    if (snippet.length > 180) snippet = snippet.slice(0,180);
    if (!snippet.endsWith(".")) snippet += ".";
    const text = `${a.name} from ${a.office}: ${snippet}`;
    const pitch = 0.92 + (i % 5) * 0.04;
    const rate = 1.06;
    await speak(text, { agentId: a.id, rate, pitch });
    if (_abort) break;
    await new Promise(r=> setTimeout(r, 220));
  }
  if (!_abort) await speak("All thirteen agents have reported. Full insights are on your dashboard.", { rate: 1.02 });
}

export async function speakOneAgent(agent: { id:string; name:string; office:string; insight:string }) {
  _abort = false;
  stopSpeaking();
  _abort = false;
  await speak(`${agent.name} from ${agent.office}: ${agent.insight}`, { agentId: agent.id, rate: 1.0 });
}
