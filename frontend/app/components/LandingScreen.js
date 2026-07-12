"use client";

import { useState } from "react";

export default function LandingScreen({ onEnter }) {
  const [exiting, setExiting] = useState(false);

  function handleGetStarted() {
    setExiting(true);
    // Wait for exit animation to finish before showing the app
    setTimeout(() => onEnter(), 520);
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background ${
        exiting ? "anim-exit" : ""
      }`}
    >
      {/* Faint ambient blob — same as main app */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 65% 45% at 0% 0%, rgba(124,58,237,0.07) 0px, transparent 65%), radial-gradient(ellipse 50% 38% at 100% 100%, rgba(56,189,248,0.05) 0px, transparent 60%)",
        }}
      />

      <div className="relative flex flex-col items-center gap-8 px-6 text-center">

        {/* ── "RECRUITER CHECK" drops in first ── */}
        <div className="anim-title" style={{ animationDelay: "0.05s" }}>
          <h1
            className="logo-text select-none"
            style={{
              fontSize: "clamp(2.6rem, 8vw, 5.5rem)",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            RECRUITER CHECK
          </h1>
        </div>

        {/* ── Divider line grows in ── */}
        <div
          className="anim-line h-px w-40 bg-accent/25 origin-center"
          style={{ animationDelay: "0.55s" }}
        />

        {/* ── Split description: left slides from left, right from right ── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-0 sm:gap-1 max-w-2xl overflow-hidden">
          {/* Left phrase */}
          <span
            className="anim-left text-base sm:text-lg font-medium text-foreground"
            style={{ animationDelay: "0.65s" }}
          >
            Paste any recruiter message.
          </span>

          {/* Connector dot — fades in with button */}
          <span
            className="anim-btn hidden sm:inline-block mx-2 text-accent font-bold text-xl"
            style={{ animationDelay: "1.05s" }}
          >
            ·
          </span>

          {/* Right phrase */}
          <span
            className="anim-right text-base sm:text-lg font-medium text-muted"
            style={{ animationDelay: "0.65s" }}
          >
            Know if it&apos;s a scam in seconds.
          </span>
        </div>

        {/* ── Sub-description fades up ── */}
        <p
          className="anim-btn max-w-md text-sm text-muted/80 leading-relaxed"
          style={{ animationDelay: "0.9s" }}
        >
          Our fine-tuned AI classifier and LLM reasoning engine analyze recruiter
          outreach and surface every red flag before you respond.
        </p>

        {/* ── Get Started button ── */}
        <div
          className="anim-btn"
          style={{ animationDelay: "1.15s" }}
        >
          <button
            onClick={handleGetStarted}
            className="group relative overflow-hidden rounded-2xl bg-accent px-10 py-4 text-[15px] font-bold text-white shadow-xl shadow-accent/25 hover:shadow-accent/40 hover:scale-[1.03] active:scale-[0.98]"
            style={{ transition: "transform 0.15s ease, box-shadow 0.15s ease" }}
          >
            {/* Inner shimmer on hover */}
            <span
              className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                transition: "transform 0.55s ease",
              }}
            />
            <span className="relative flex items-center gap-2.5">
              Get Started
              <svg
                viewBox="0 0 20 20"
                fill="none"
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 10h12M11 4l6 6-6 6" />
              </svg>
            </span>
          </button>
        </div>

        {/* ── Tiny keyboard shortcut hint ── */}
        <p
          className="anim-btn text-[11px] text-muted/50"
          style={{ animationDelay: "1.35s" }}
        >
          Press <kbd className="rounded bg-border px-1.5 py-0.5 font-mono text-[10px] text-muted">Enter</kbd> to continue
        </p>
      </div>
    </div>
  );
}
