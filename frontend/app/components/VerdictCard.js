"use client";

import ScoreGauge from "./ScoreGauge";

function getBadgeStyle(isScam, tier) {
  if (isScam) return "bg-danger-soft text-danger";
  return "bg-success-soft text-success";
}

export default function VerdictCard({ classification, explanation }) {
  if (!classification) return null;

  const { is_scam, confidence, verdict_tier, source } = classification;
  const { red_flags, verdict_reasoning } = explanation || {};

  return (
    <div className="space-y-5">
      {/* Verdict Banner */}
      <div
        className={`flex items-center gap-5 rounded-xl p-5 border ${
          is_scam
            ? "border-danger/20 bg-danger-soft/40"
            : "border-success/20 bg-success-soft/40"
        }`}
      >
        <ScoreGauge score={confidence} isScam={is_scam} />

        <div className="space-y-1">
          <span
            className={`inline-block rounded px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${getBadgeStyle(
              is_scam,
              verdict_tier
            )}`}
          >
            {verdict_tier.replace(/_/g, " ")}
          </span>
          <h3 className="text-lg font-semibold text-foreground">
            {is_scam ? "Potential Scam Detected" : "Appears Legitimate"}
          </h3>
          <p className="text-xs text-muted">
            Analyzed by{" "}
            <span className="font-medium text-foreground/80">
              {source === "model" ? "DistilBERT Classifier" : "LLM Fallback"}
            </span>
          </p>
        </div>
      </div>

      {/* Reasoning */}
      {verdict_reasoning && (
        <div className="rounded-xl border border-border bg-surface-elevated/50 p-4">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
            Analysis Summary
          </h4>
          <p className="text-sm leading-relaxed text-foreground/80">
            {verdict_reasoning}
          </p>
        </div>
      )}

      {/* Flags */}
      {red_flags && red_flags.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
            {is_scam ? "Red Flags Identified" : "Green Flags"}
          </h4>
          <ul className="space-y-1.5">
            {red_flags.map((flag, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm text-foreground/80"
              >
                <span className="mt-0.5 flex-shrink-0 text-xs">
                  {is_scam ? "🚨" : "✅"}
                </span>
                {flag}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
