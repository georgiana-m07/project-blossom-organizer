
import React from "react";
import { Check, Pencil, Trash2 } from "lucide-react";

const categoryColors = {
  "Urgent": "bg-red-200 text-red-700",
  "Routine": "bg-blue-100 text-blue-800",
  "Important": "bg-purple-100 text-purple-800",
  "Personal": "bg-pink-100 text-pink-600",
  "Work-related": "bg-orange-100 text-orange-700"
};

export function TaskList({ tasks, setTasks, onToggleTask, onDeleteTask, onEditTask }) {
  function toggleCompleted(id) {
    // Use the passed handler if available, otherwise fallback to direct state update
    if (onToggleTask) {
      onToggleTask(id);
    } else {
      setTasks(tasks.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ));
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {tasks.map(task => (
        <div key={task.id} className="flex items-center bg-white rounded-lg shadow px-3 py-2 gap-3">
          <button className={`rounded-full border-2 size-5 flex items-center justify-center mr-2 ${task.completed ? 'border-green-500 bg-green-100' : 'border-gray-300 bg-white'}`}
            onClick={() => toggleCompleted(task.id)}>
            {task.completed && <Check className="text-green-500" size={16} />}
          </button>
          <div className={`flex-1 ${task.completed ? "line-through text-gray-400" : ""}`}>
            <b>{task.name}</b>
            <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${categoryColors[task.category] || "bg-gray-100 text-gray-500"}`}>{task.category}</span>
            <span className={`ml-2 px-2 py-0.5 rounded text-xs border ${task.priority === "High" ? "border-red-400 text-red-600" : task.priority === "Medium" ? "border-yellow-300 text-yellow-500" : "border-green-300 text-green-600"}`}>{task.priority}</span>
            {task.due && <span className="ml-2 text-xs text-gray-500">Due: {task.due}</span>}
          </div>
          
          {/* Task action buttons */}
          <div className="flex gap-1 flex-shrink-0">
            <button 
              onClick={() => onEditTask(task)}
              className="text-gray-500 hover:text-blue-500 p-1 rounded hover:bg-gray-100 transition-colors"
              title="Edit task"
            >
              <Pencil size={16} />
            </button>
            <button 
              onClick={() => onDeleteTask(task.id)}
              className="text-gray-500 hover:text-red-500 p-1 rounded hover:bg-gray-100 transition-colors"
              title="Delete task"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
