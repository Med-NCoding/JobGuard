const API_BASE = "http://localhost:8000";

export async function classifyMessage(message) {
  const res = await fetch(`${API_BASE}/api/classify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error(`Classification failed: ${res.statusText}`);
  return res.json();
}

export async function explainVerdict(message, is_scam, confidence) {
  const res = await fetch(`${API_BASE}/api/explain`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, is_scam, confidence }),
  });
  if (!res.ok) throw new Error(`Explanation failed: ${res.statusText}`);
  return res.json();
}

export async function simulateStage(message, stage) {
  const res = await fetch(`${API_BASE}/api/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, stage }),
  });
  if (!res.ok) throw new Error(`Simulation failed: ${res.statusText}`);
  return res.json();
}
