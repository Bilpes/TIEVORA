import { agentDefs } from "@/lib/agents";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const word = searchParams.get("word") || "Hello Tievora";

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
      };

      // Wake all
      for (const a of agentDefs) {
        send({ type: "agent", id: a.id, status: "waking", progress: 12, insight: "", logs: [`[${a.office}] Wake word "${word}" detected`] });
      }
      await sleep(350);
      for (let i=0;i<agentDefs.length;i++) {
        const a = agentDefs[i];
        send({ type: "agent", id: a.id, status: "thinking", progress: 48, insight: "", logs: [`Scanning ${a.office} — projects, P&L, resources…`] });
        if (i % 3 === 2) await sleep(120);
      }
      await sleep(500);
      for (let i=0;i<agentDefs.length;i++) {
        const a = agentDefs[i];
        send({ type: "agent", id: a.id, status: "streaming", progress: 84, insight: "", logs: [`Synthesizing CEO insight…`] });
        if (i % 4 === 3) await sleep(100);
      }
      await sleep(600);
      for (let i=0;i<agentDefs.length;i++) {
        const a = agentDefs[i];
        send({ type: "agent", id: a.id, status: "done", progress: 100, insight: a.insight(), logs: ["✓ Delivered to CEO"] });
        await sleep(90);
      }
      send({ type: "done" });
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
    }
  });
}

function sleep(ms: number) { return new Promise(r=>setTimeout(r, ms)); }
