"use client";

import { useState } from "react";
import { classifyMessage, explainVerdict } from "./lib/api";
import { EXAMPLES } from "./lib/constants";
import VerdictCard from "./components/VerdictCard";
import Simulator from "./components/Simulator";

export default function Home() {
  const [message, setMessage] = useState("");
  const [scanning, setScanning] = useState(false);
  const [classification, setClassification] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [error, setError] = useState(null);

  async function handleScan() {
    if (!message.trim()) return;
    setScanning(true);
    setError(null);
    setClassification(null);
    setExplanation(null);

    try {
      const cls = await classifyMessage(message);
      setClassification(cls);

      const exp = await explainVerdict(message, cls.is_scam, cls.confidence);
      setExplanation(exp);
    } catch (err) {
      setError(err.message);
    } finally {
      setScanning(false);
    }
  }

  function handleReset() {
    setMessage("");
    setClassification(null);
    setExplanation(null);
    setError(null);
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* ─── Header ─── */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛡️</span>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">
                RecruitCheck
              </h1>
              <p className="text-[11px] text-muted">
                AI-Powered Recruiter Scam Detection
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-accent/25 bg-accent-soft px-3 py-1.5">
            <span
              className="h-1.5 w-1.5 rounded-full bg-accent"
              style={{ animation: "pulse-ring 1.6s infinite" }}
            />
            <span className="text-[11px] font-medium text-accent">
              DistilBERT + Llama 3.1
            </span>
          </div>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8 space-y-8">
        {/* Input Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Input */}
          <div className="rounded-2xl border border-border bg-surface p-6 space-y-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Paste Recruiter Message
              </h2>
              <p className="mt-1 text-xs text-muted">
                Paste any recruiter email, LinkedIn DM, SMS, or job posting
                below.
              </p>
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi! We found your resume online and would like to offer you a remote position as a Data Optimization Specialist paying $50/hr..."
              className="h-52 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20"
            />

            {/* Quick Examples */}
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => setMessage(ex.message)}
                  className="group flex items-center gap-1.5 rounded-lg border border-border bg-surface-elevated/50 px-2.5 py-1.5 text-[11px] font-medium text-muted hover:border-border-hover hover:text-foreground"
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      ex.tag === "SCAM" ? "bg-danger" : "bg-success"
                    }`}
                  />
                  {ex.label}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={handleScan}
                disabled={!message.trim() || scanning}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/20 hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {scanning ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  "Run Security Scan"
                )}
              </button>

              {classification && (
                <button
                  onClick={handleReset}
                  className="rounded-xl border border-border px-4 py-3 text-sm font-medium text-muted hover:bg-surface-elevated hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>

            {error && (
              <p className="rounded-lg bg-danger-soft/50 border border-danger/20 px-3 py-2 text-xs text-danger">
                {error}
              </p>
            )}
          </div>

          {/* Right: Results */}
          <div className="rounded-2xl border border-border bg-surface p-6">
            {!classification && !scanning && (
              <div className="flex h-full flex-col items-center justify-center text-center py-12">
                <span className="text-5xl mb-5 opacity-60">🔍</span>
                <h3 className="text-sm font-semibold text-foreground">
                  Waiting for Input
                </h3>
                <p className="mt-1.5 max-w-[260px] text-xs text-muted">
                  Paste a recruiter message and click &quot;Run Security
                  Scan&quot; to analyze it.
                </p>
              </div>
            )}

            {scanning && (
              <div className="flex h-full flex-col items-center justify-center text-center py-12">
                <svg
                  className="h-10 w-10 animate-spin text-accent mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                <p className="text-sm font-medium text-foreground">
                  Running classifier &amp; explanation models…
                </p>
                <p className="mt-1 text-xs text-muted">
                  This usually takes 2–4 seconds.
                </p>
              </div>
            )}

            {classification && explanation && (
              <VerdictCard
                classification={classification}
                explanation={explanation}
              />
            )}
          </div>
        </section>

        {/* Simulator Section */}
        <Simulator
          message={classification ? message : null}
          isScam={classification?.is_scam}
        />
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <p className="text-center text-[11px] text-muted">
            RecruitCheck · Hackathon Demo · Fine-tuned DistilBERT + Llama 3.1 ·
            For educational use only
          </p>
        </div>
      </footer>
    </div>
  );
}
