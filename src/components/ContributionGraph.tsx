
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

// Define the number of tasks needed for a full square
const TASKS_FOR_FULL_SQUARE = 3;

// Visual GitHub-style contribution grid with partial fill
export default function ContributionGraph({ logs, tasks }: { logs: { date: string, text: string }[], tasks: { id: string, completed: boolean, completedDate?: string }[] }) {
  const past30 = getPastDays(30);
  
  // Count tasks completed by date
  const tasksByDate = tasks
    .filter(t => t.completed && t.completedDate)
    .reduce((acc, task) => {
      const date = task.completedDate;
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
  // Add log dates as at least 1 task
  logs.forEach(log => {
    tasksByDate[log.date] = Math.max(tasksByDate[log.date] || 0, 1);
  });
  
  // Get the fill percentage for each day
  const getFillPercentage = (date: string) => {
    const count = tasksByDate[date] || 0;
    // Cap at 100% even if more than TASKS_FOR_FULL_SQUARE tasks
    return Math.min(100, (count / TASKS_FOR_FULL_SQUARE) * 100);
  };

  // Get color based on fill percentage - more intense color for higher completion
  const getColorClass = (fillPercent: number) => {
    if (fillPercent === 0) return "bg-purple-100";
    if (fillPercent < 33) return "bg-purple-200";
    if (fillPercent < 67) return "bg-purple-300";
    if (fillPercent < 100) return "bg-purple-400";
    return "bg-purple-500";
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row gap-1">
        {past30.map((date) => {
          const fillPercent = getFillPercentage(date);
          const hasActivity = fillPercent > 0;
          const taskCount = tasksByDate[date] || 0;
          
          return (
            <div
              key={date}
              className="w-3 h-3 rounded-sm relative border border-purple-100 overflow-hidden"
              title={`${date}${hasActivity ? ` — ${taskCount}/${TASKS_FOR_FULL_SQUARE} tasks (${fillPercent.toFixed(0)}%)` : ""}`}
            >
              {/* Background */}
              <div className="absolute inset-0 bg-purple-50"></div>
              
              {/* Foreground fill based on activity percentage */}
              {hasActivity && (
                <div 
                  className={`absolute bottom-0 left-0 right-0 transition-all ${getColorClass(fillPercent)}`}
                  style={{ height: `${fillPercent}%` }}
                ></div>
              )}
            </div>
          );
        })}
      </div>
      <div className="text-[10px] text-gray-400 mt-1">Last 30 days (3 tasks = full square)</div>
    </div>
  );
}
