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
      <header className="border-b border-border/60 backdrop-blur-md sticky top-0 z-50 bg-background/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

          {/* Logo mark */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/15 ring-1 ring-accent/35 shadow-lg shadow-accent/10">
              <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4 text-accent" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 1.5 2.5 4.2v4.3C2.5 11.8 5 14 8 14.5 11 14 13.5 11.8 13.5 8.5V4.2L8 1.5z" />
                <path d="M5.8 8.1l1.4 1.5L10.2 6.5" strokeWidth="1.5" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-foreground leading-none">
                RecruiterCheck
              </h1>
              <p className="text-[10px] text-muted mt-0.5 tracking-wide">
                AI · Scam Detection
              </p>
            </div>
          </div>

          {/* Model badge */}
          <div className="flex items-center gap-2 rounded-full border border-accent/20 bg-accent-soft px-3.5 py-1.5">
            <span
              className="h-1.5 w-1.5 rounded-full bg-accent"
              style={{ animation: "pulse-ring 1.6s infinite" }}
            />
            <span className="text-[11px] font-medium text-accent tracking-wide">
              DistilBERT + Llama 3.1
            </span>
          </div>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className="mx-auto w-full max-w-6xl px-6 pt-12 pb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent/70 mb-4">
          AI-Powered Job Scam Detection
        </p>
        <h2 className="logo-text text-5xl font-extrabold tracking-tight leading-none mb-4 sm:text-6xl">
          RECRUITER CHECK
        </h2>
        <p className="mx-auto max-w-xl text-sm text-muted leading-relaxed">
          Paste any recruiter email, LinkedIn DM, or job offer below. Our fine-tuned
          classifier and LLM reasoning engine analyze it in seconds — surfacing red
          flags before you respond.
        </p>
      </section>

      {/* ─── Main Content ─── */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-10 space-y-6">

        {/* Input / Results grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Left: Input panel */}
          <div className="rounded-2xl border border-border bg-surface p-6 space-y-4 shadow-xl shadow-black/20">
            <div>
              <h3 className="text-[13px] font-semibold text-foreground uppercase tracking-wider">
                Paste Recruiter Message
              </h3>
              <p className="mt-1 text-xs text-muted">
                Email · LinkedIn DM · SMS · Job posting
              </p>
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Hi! We found your resume online and would like to offer you a remote position as a Data Optimization Specialist paying $50/hr…`}
              className="h-52 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/40 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20"
            />

            {/* Quick example chips */}
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => setMessage(ex.message)}
                  className="group flex items-center gap-1.5 rounded-lg border border-border bg-surface-elevated/60 px-2.5 py-1.5 text-[11px] font-medium text-muted hover:border-border-hover hover:text-foreground"
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
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {scanning ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Analyzing…
                  </>
                ) : (
                  "Run Security Scan"
                )}
              </button>

              {classification && (
                <button
                  onClick={handleReset}
                  className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted hover:bg-surface-elevated hover:text-foreground"
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

          {/* Right: Results panel */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-xl shadow-black/20">
            {!classification && !scanning && (
              <div className="flex h-full flex-col items-center justify-center text-center py-12">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-elevated ring-1 ring-border">
                  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-accent/50" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-foreground">Awaiting Analysis</h3>
                <p className="mt-2 max-w-[230px] text-xs text-muted leading-relaxed">
                  Paste a recruiter message and run the security scan to see a detailed verdict.
                </p>
              </div>
            )}

            {scanning && (
              <div className="flex h-full flex-col items-center justify-center text-center py-12 gap-4">
                <svg className="h-9 w-9 animate-spin text-accent" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-foreground">Running classifier & LLM…</p>
                  <p className="mt-1 text-xs text-muted">Usually 2–4 seconds</p>
                </div>
              </div>
            )}

            {classification && explanation && (
              <VerdictCard classification={classification} explanation={explanation} />
            )}
          </div>
        </section>

        {/* Simulator */}
        <Simulator message={classification ? message : null} isScam={classification?.is_scam} />
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border/50">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <p className="text-center text-[11px] text-muted">
            RecruiterCheck · Fine-tuned DistilBERT + Llama 3.1 · For educational use only
          </p>
        </div>
      </footer>
    </div>
  );
}
