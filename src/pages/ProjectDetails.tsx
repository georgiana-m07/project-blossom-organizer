
import React, { useState } from "react";
import { ArrowLeft, ListCheck, Pencil, Plus } from "lucide-react";
import { TaskList } from "../components/TaskList";
import { Button } from "@/components/ui/button";
import { AddTaskModal } from "../components/AddTaskModal";
import { useNavigate, useLocation } from "react-router-dom";

const dummyProject = {
  title: "Home Renovation",
  description: "Summer kitchen remodel: new cabinets and paint.",
  color: "bg-purple-100",
  tasks: [
    { id: 1, name: "Buy paint", completed: true, due: "2024-06-01", priority: "High", category: "Urgent" },
    { id: 2, name: "Order cabinets", completed: false, due: "2024-06-06", priority: "Medium", category: "Routine" },
    { id: 3, name: "Demo old cabinets", completed: false, due: "2024-06-10", priority: "High", category: "Work-related" },
  ],
};

export default function ProjectDetails() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const project = state?.project || dummyProject;

  const [modalOpen, setModalOpen] = useState(false);
  const [tasks, setTasks] = useState(project.tasks);

  const completed = tasks.filter((t) => t.completed).length;
  const percent = Math.round((completed / tasks.length) * 100);

  function handleAddTask(task) {
    setTasks([...tasks, { ...task, id: Date.now(), completed: false }]);
    setModalOpen(false);
  }

  return (
    <div className="min-h-screen font-poppins bg-gradient-to-br from-purple-50 to-blue-100 flex flex-col">
      <header className="flex items-center p-4 gap-3 bg-white/80 shadow-sm sticky top-0 z-10">
        <Button size="icon" variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </Button>
        <span className="font-playfair text-xl font-bold text-purple-900">{project.title}</span>
        <Button size="icon" variant="ghost" className="ml-auto"><Pencil size={18} /></Button>
      </header>

      {/* Progress */}
      <div className="flex flex-col items-center my-4">
        <span className="text-center text-base">{completed} of {tasks.length} tasks done</span>
        <div className="h-3 w-4/5 rounded-lg bg-purple-100 mt-2">
          <div className="h-3 rounded-lg bg-purple-500 transition-all" style={{ width: `${percent}%` }} />
        </div>
        <span className="text-xs mt-1 text-gray-500">{percent}% done</span>
      </div>

      {/* Task / Milestone list */}
      <div className="flex-1 px-3 pb-24">
        <TaskList tasks={tasks} setTasks={setTasks} />
      </div>

      {/* Daily Progress Log */}
      <div className="bg-white/70 backdrop-blur-lg rounded-t-3xl p-4 shadow fixed left-0 bottom-0 w-full max-w-xl mx-auto">
        <div className="flex gap-2 items-center mb-2">
          <ListCheck size={20} className="text-purple-400" />
          <b className="font-playfair">Daily Reflection</b>
        </div>
        <textarea placeholder="What did you achieve today?" rows={2} className="w-full rounded p-2 border border-purple-200 focus:ring-2 focus:ring-purple-400" />
        <Button variant="secondary" className="w-full mt-2">Log Today's Progress</Button>
      </div>

      {/* Floating add task button */}
      <Button className="fixed bottom-24 right-6 bg-purple-600 rounded-full h-14 w-14 shadow-lg text-white text-lg flex items-center justify-center"
        onClick={() => setModalOpen(true)}>
        <Plus />
      </Button>
      <AddTaskModal open={modalOpen} onOpenChange={setModalOpen} onSubmit={handleAddTask} categories={["Urgent", "Routine", "Important", "Personal", "Work-related"]} />
    </div>
  );
}
