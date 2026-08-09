import OpenAI from "openai";

// Generates embeddings for RAG — uses OpenAI if key present, else deterministic dummy vector
let client: OpenAI | null = null;
function getClient() {
  const key = process.env.OPENAI_API_KEY;
  if (!key || key === "dummy" || key.startsWith("sk-xxx")) return null;
  if (!client) client = new OpenAI({ apiKey: key });
  return client;
}

// Dummy 1536-dim vector from text hash (for offline / dummy mode)
export function dummyEmbedding(text: string, dims = 1536): number[] {
  const vec = new Array(dims).fill(0);
  let h = 2166136261;
  for (let i=0;i<text.length;i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  // fill with pseudo-normal
  for (let i=0;i<dims;i++) {
    const x = Math.sin(h + i * 9999) * 10000;
    vec[i] = (x - Math.floor(x)) * 2 - 1;
  }
  // L2 normalize
  const norm = Math.sqrt(vec.reduce((s,v)=> s+v*v, 0));
  return vec.map(v=> v/norm);
}

export async function embed(text: string): Promise<number[]> {
  const c = getClient();
  if (!c) return dummyEmbedding(text);
  const res = await c.embeddings.create({ model: "text-embedding-3-small", input: text, dimensions: 1536 } as any);
  return res.data[0].embedding as unknown as number[];
}

export async function embedMany(texts: string[]): Promise<number[][]> {
  const c = getClient();
  if (!c) return texts.map(dummyEmbedding);
  const res = await c.embeddings.create({ model: "text-embedding-3-small", input: texts, dimensions: 1536 } as any);
  return res.data.map(d=> d.embedding as unknown as number[]);
}

export function toVectorLiteral(vec: number[]): string {
  return `[${vec.join(",")}]`;
}

// chunk 512 tokens approx = ~380 words; simple char split for now
export function chunkText(text: string, chunkSize = 512, overlap = 50): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  for (let i=0; i<words.length; i+= chunkSize - overlap) {
    const chunk = words.slice(i, i+chunkSize).join(" ");
    if (chunk.trim()) chunks.push(chunk);
    if (i+chunkSize >= words.length) break;
  }
  return chunks.length ? chunks : [text];
}
