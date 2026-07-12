"use client";

import { useState } from "react";
import { simulateStage } from "../lib/api";
import { PLAYBOOK_STAGES } from "../lib/constants";

/* ─── Typing indicator ─── */
function TypingDots() {
  return (
    <div className="flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <ScammerAvatar />
      <div className="rounded-xl rounded-bl-sm bg-surface-elevated border border-border px-4 py-3 flex gap-1.5 items-center">
        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-muted" />
        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-muted" />
        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-muted" />
      </div>
    </div>
  );
}

/* ─── Scammer avatar – SVG person silhouette ─── */
function ScammerAvatar() {
  return (
    <div className="w-7 h-7 rounded-full bg-danger/15 ring-1 ring-danger/25 flex items-center justify-center flex-shrink-0">
      <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4 text-danger/70" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="5" r="2.5" />
        <path d="M3 14c0-2.8 2.2-5 5-5s5 2.2 5 5" />
      </svg>
    </div>
  );
}

/* ─── Chat bubble ─── */
function ChatBubble({ sender, content, type, playbookFocus }) {
  if (type === "system") {
    return (
      <div className="mx-auto max-w-[85%] rounded-lg border border-dashed border-border bg-surface/50 px-4 py-3 text-center text-xs text-muted italic animate-in fade-in duration-300">
        {content}
      </div>
    );
  }

  if (type === "user") {
    return (
      <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="max-w-[75%] rounded-xl rounded-br-sm bg-accent px-4 py-3 text-sm text-white shadow-md shadow-accent/20">
          {content}
        </div>
      </div>
    );
  }

  // Scammer message
  return (
    <div className="flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <ScammerAvatar />
      <div className="max-w-[80%] space-y-2">
        <div className="rounded-xl rounded-bl-sm border border-danger/15 bg-danger-soft/25 px-4 py-3">
          <p className="text-[11px] font-semibold text-danger/80 mb-1.5 uppercase tracking-wide">{sender}</p>
          <p className="text-sm leading-relaxed text-foreground/90">{content}</p>
        </div>
        {playbookFocus && (
          <p className="flex items-start gap-1.5 text-[11px] text-danger/65 pl-1">
            <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 mt-px flex-shrink-0 text-danger/60" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 2L2.5 4.5v4C2.5 11.7 5 14 8 14.5 11 14 13.5 11.7 13.5 8.5v-4L8 2z" />
              <path d="M8 6v3M8 10.5v.5" />
            </svg>
            <span className="font-medium">{playbookFocus}</span>
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── Main Simulator component ─── */
export default function Simulator({ message, isScam }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [activeStage, setActiveStage] = useState(null);

  const isActive = isScam && message;

  async function handleStageClick(stageInfo) {
    if (!isActive || loading) return;
    setActiveStage(stageInfo.stage);
    setMessages((prev) => [...prev, { type: "user", content: stageInfo.userPrompt }]);
    setLoading(true);

    try {
      const data = await simulateStage(message, stageInfo.stage);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            type: "scammer",
            sender: data.sender,
            content: data.content,
            playbookFocus: data.playbook_focus,
          },
        ]);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setMessages((prev) => [...prev, { type: "system", content: `Error: ${err.message}` }]);
      setLoading(false);
    }
  }

  function handleReset() {
    setMessages([]);
    setActiveStage(null);
  }

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-xl shadow-black/20">

      {/* Section header with description */}
      <div className="px-6 py-5 border-b border-border bg-surface-elevated/40">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-foreground">
              Scam Escalation Simulator
            </h2>
            <p className="mt-1.5 text-xs text-muted leading-relaxed max-w-lg">
              Scammers follow a predictable playbook. They build trust, move the conversation
              off-platform, then extract money. Select a stage below to generate an AI-simulated
              scammer response so you know exactly how each tactic sounds before it happens to you.
            </p>
          </div>
          {/* Status pill */}
          <div className={`flex-shrink-0 flex items-center gap-2 self-start rounded-full px-3 py-1.5 border text-[11px] font-medium ${
            isActive
              ? "border-success/30 bg-success-soft/40 text-success"
              : "border-border bg-surface-elevated/60 text-muted"
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-success" : "bg-muted/50"}`} />
            {isActive ? "Simulator Active" : "Scan a scam message to activate"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-0">

        {/* ── Chat window ── */}
        <div className="flex flex-col min-h-[380px] border-r border-border">
          {/* Chat title bar */}
          <div className="flex items-center gap-3 border-b border-border px-5 py-3 bg-background/40">
            <div className="w-7 h-7 rounded-full bg-danger/10 ring-1 ring-danger/20 flex items-center justify-center">
              <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 text-danger/60" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="5" r="2.5" />
                <path d="M3 14c0-2.8 2.2-5 5-5s5 2.2 5 5" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Simulated Scammer</p>
              <p className="text-[10px] text-muted">AI-generated — for educational awareness only</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {!isActive && messages.length === 0 && (
              <ChatBubble
                type="system"
                content="Run a security scan first. If the message is flagged as a scam, the simulator will activate and let you explore each stage of the scammer's playbook."
              />
            )}
            {isActive && messages.length === 0 && (
              <ChatBubble
                type="system"
                content="Scam detected — simulator is ready. Select a playbook stage on the right to generate a realistic scammer response for that tactic."
              />
            )}
            {messages.map((msg, i) => (
              <ChatBubble key={i} {...msg} />
            ))}
            {loading && <TypingDots />}
          </div>
        </div>

        {/* ── Playbook stages ── */}
        <div className="p-5 space-y-3 bg-background/20">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted/70">
            Playbook Stages
          </p>

          {PLAYBOOK_STAGES.map((s) => (
            <button
              key={s.stage}
              disabled={!isActive || loading}
              onClick={() => handleStageClick(s)}
              className={`group w-full text-left rounded-xl border p-3.5 transition-all duration-200 ${
                activeStage === s.stage
                  ? "border-accent/40 bg-accent-soft shadow-sm shadow-accent/10"
                  : "border-border bg-surface-elevated/40 hover:border-border-hover hover:bg-surface-elevated"
              } disabled:opacity-30 disabled:cursor-not-allowed`}
            >
              <div className="flex items-start gap-3">
                <span className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                  activeStage === s.stage
                    ? "bg-accent text-white"
                    : "bg-surface-elevated text-muted ring-1 ring-border group-hover:ring-border-hover"
                }`}>
                  {s.stage}
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">{s.title}</p>
                  <p className="text-[11px] text-muted leading-snug mt-0.5">{s.description}</p>
                </div>
              </div>
            </button>
          ))}

          <button
            disabled={!isActive || messages.length === 0}
            onClick={handleReset}
            className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-xs font-medium text-muted hover:bg-surface-elevated hover:text-foreground disabled:opacity-25 disabled:cursor-not-allowed"
          >
            Reset Chat
          </button>
        </div>
      </div>
    </div>
  );
}
