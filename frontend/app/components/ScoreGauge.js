"use client";

import { useEffect, useState } from "react";

export default function ScoreGauge({ score, isScam }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let current = 0;
    const target = Math.round(score * 100);
    const step = Math.max(1, Math.floor(target / 40));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      setAnimatedScore(current);
    }, 18);
    return () => clearInterval(timer);
  }, [score]);

  const strokeColor = isScam
    ? animatedScore > 80
      ? "stroke-danger"
      : "stroke-warning"
    : "stroke-success";

  return (
    <div className="w-20 h-20 flex-shrink-0">
      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
        <path
          className="fill-none stroke-border"
          strokeWidth="2.8"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className={`score-circle fill-none ${strokeColor}`}
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeDasharray={`${animatedScore}, 100`}
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <div className="relative -mt-[52px] flex items-center justify-center">
        <span className="text-lg font-bold tracking-tight text-foreground">
          {animatedScore}%
        </span>
      </div>
    </div>
  );
}
