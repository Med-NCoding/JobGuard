"use client";

import { useState } from "react";
import { simulateStage } from "../lib/api";
import { PLAYBOOK_STAGES } from "../lib/constants";

function TypingDots() {
  return (
    <div className="flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="w-7 h-7 rounded-full bg-danger/20 flex items-center justify-center text-xs flex-shrink-0">
        🤖
      </div>
      <div className="rounded-xl rounded-bl-sm bg-surface-elevated border border-border px-4 py-3 flex gap-1.5">
        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-muted" />
        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-muted" />
        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-muted" />
      </div>
    </div>
  );
}

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
        <div className="max-w-[75%] rounded-xl rounded-br-sm bg-accent px-4 py-3 text-sm text-white">
          {content}
        </div>
      </div>
    );
  }

  // Scammer message
  return (
    <div className="flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="w-7 h-7 rounded-full bg-danger/20 flex items-center justify-center text-xs flex-shrink-0">
        🤖
      </div>
      <div className="max-w-[80%] space-y-2">
        <div className="rounded-xl rounded-bl-sm border border-danger/15 bg-danger-soft/30 px-4 py-3">
          <p className="text-xs font-medium text-danger/80 mb-1">{sender}</p>
          <p className="text-sm leading-relaxed text-foreground/90">{content}</p>
        </div>
        {playbookFocus && (
          <p className="flex items-start gap-1.5 text-[11px] text-danger/70 pl-1">
            <span>⚠️</span>
            <span className="font-medium">{playbookFocus}</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default function Simulator({ message, isScam }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeStage, setActiveStage] = useState(null);

  const isActive = isScam && message;

  async function handleStageClick(stageInfo) {
    if (!isActive || loading) return;
    setActiveStage(stageInfo.stage);

    // Add user message
    setMessages((prev) => [
      ...prev,
      { type: "user", content: stageInfo.userPrompt },
    ]);

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
      setMessages((prev) => [
        ...prev,
        { type: "system", content: `Error: ${err.message}` },
      ]);
      setLoading(false);
    }
  }

  function handleReset() {
    setMessages([]);
    setActiveStage(null);
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-foreground">
          Keep Talking Simulator
        </h2>
        <p className="mt-1 text-xs text-muted">
          See what the scammer would say next at each stage of the playbook.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
        {/* Chat Window */}
        <div className="rounded-xl border border-border bg-background overflow-hidden flex flex-col min-h-[380px]">
          {/* Chat Header */}
          <div className="flex items-center gap-3 border-b border-border px-4 py-3 bg-surface/50">
            <div className="w-8 h-8 rounded-full bg-danger/15 flex items-center justify-center text-sm">
              🤖
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Scam Simulator
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-muted">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActive ? "bg-success" : "bg-muted/50"
                  }`}
                />
                {isActive ? "Active" : "Inactive"}
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {!isActive && messages.length === 0 && (
              <ChatBubble
                type="system"
                content="Run a security scan on a message first. If flagged as a scam, the simulator will activate."
              />
            )}
            {isActive && messages.length === 0 && (
              <ChatBubble
                type="system"
                content="Scam detected — simulator ready. Click a playbook stage on the right to see what the scammer does next."
              />
            )}
            {messages.map((msg, i) => (
              <ChatBubble key={i} {...msg} />
            ))}
            {loading && <TypingDots />}
          </div>
        </div>

        {/* Stage Controls */}
        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            Playbook Stages
          </p>

          {PLAYBOOK_STAGES.map((s) => (
            <button
              key={s.stage}
              disabled={!isActive || loading}
              onClick={() => handleStageClick(s)}
              className={`group w-full text-left rounded-xl border p-3.5 transition-all duration-200 ${
                activeStage === s.stage
                  ? "border-accent/40 bg-accent-soft"
                  : "border-border bg-surface-elevated/50 hover:border-border-hover hover:bg-surface-elevated"
              } disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-surface-elevated/50 disabled:hover:border-border`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    activeStage === s.stage
                      ? "bg-accent text-white"
                      : "bg-border text-muted group-hover:bg-border-hover"
                  }`}
                >
                  {s.stage}
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {s.title}
                  </p>
                  <p className="text-[11px] text-muted leading-snug">
                    {s.description}
                  </p>
                </div>
              </div>
            </button>
          ))}

          <button
            disabled={!isActive || messages.length === 0}
            onClick={handleReset}
            className="mt-2 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-xs font-medium text-muted hover:bg-surface-elevated hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Reset Chat
          </button>
        </div>
      </div>
    </div>
  );
}
