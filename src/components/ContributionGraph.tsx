
import React from "react";

// Utility: Get past N days as an array (newest last)
function getPastDays(n: number) {
  const arr = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    arr.push(d.toISOString().slice(0, 10));
  }
  return arr;
}

// Visual GitHub-style contribution grid
export default function ContributionGraph({ logs }: { logs: { date: string }[] }) {
  const past30 = getPastDays(30);
  const logDates = new Set(logs.map((l) => l.date));
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row gap-1">
        {past30.map((date) => (
          <div
            key={date}
            className={`w-3 h-3 rounded-sm transition-colors border border-purple-100
              ${logDates.has(date)
                ? "bg-purple-500"
                : "bg-purple-100"
              }
            `}
            title={date + (logDates.has(date) ? " — Reflection logged" : "")}
          />
        ))}
      </div>
      <div className="text-[10px] text-gray-400 mt-1">Last 30 days</div>
    </div>
  );
}
