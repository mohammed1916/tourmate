export interface GemmaMessage {
  role: "system" | "user";
  content: { type: "text" | "image"; text?: string; url?: string }[];
}

export async function fetchGemmaResult(messages: GemmaMessage[]) {
  const res = await fetch("http://localhost:8000/api/gemma", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  const data = await res.json();
  return data.result as string;
}
