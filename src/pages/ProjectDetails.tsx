
import React, { useState, useEffect } from "react";
import { ArrowLeft, ListCheck, Pencil, Plus } from "lucide-react";
import { TaskList } from "../components/TaskList";
import { Button } from "@/components/ui/button";
import { AddTaskModal } from "../components/AddTaskModal";
import { useNavigate, useLocation } from "react-router-dom";
import ContributionGraph from "../components/ContributionGraph";

export default function ProjectDetails() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Pull all projects from localStorage, fallback to project in state if coming directly here
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    const stored = localStorage.getItem("lovable-projects");
    setProjects(stored ? JSON.parse(stored) : []);
  }, []);

  // Find the project being shown
  const projectId = state?.project?.id || window.location.pathname.split("/").slice(-1)[0];
  const [project, setProject] = useState(state?.project);

  useEffect(() => {
    if (!state?.project && projects.length) {
      const found = projects.find((p) => p.id === projectId);
      setProject(found);
    }
  }, [state, projects, projectId]);

  // If project not found, show error
  if (!project) {
    return (
      <div className="p-8 text-center text-lg text-red-600">
        Project not found. <Button variant="link" onClick={() => navigate("/")}>Go Home</Button>
      </div>
    );
  }

  const [modalOpen, setModalOpen] = useState(false);
  const [tasks, setTasks] = useState(project.tasks || []);
  const [logs, setLogs] = useState(project.logs || []); // {date: 'YYYY-MM-DD', text: '...'}

  // Update project data in localStorage when tasks/logs change
  useEffect(() => {
    setProject((p) => p && { ...p, tasks, logs });
    setProjects((curr) =>
      curr.map((p) =>
        p.id === project.id ? { ...p, tasks, logs } : p
      )
    );
  }, [tasks, logs]);

  useEffect(() => {
    localStorage.setItem(
      "lovable-projects",
      JSON.stringify(
        projects.map((p) =>
          p.id === project.id ? { ...p, tasks, logs } : p
        )
      )
    );
  }, [projects, tasks, logs, project.id]);

  const completed = tasks.filter((t) => t.completed).length;
  const percent = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  function handleAddTask(task) {
    setTasks([...tasks, { ...task, id: Date.now(), completed: false }]);
    setModalOpen(false);
  }

  // --- Daily Log state and log handler
  const [logTextarea, setLogTextarea] = useState("");
  function handleLogProgress() {
    const today = new Date().toISOString().slice(0, 10);
    if (!logTextarea.trim()) return;
    // Prevent multiple logs for the same day
    if (!logs.some((l) => l.date === today)) {
      setLogs([...logs, { date: today, text: logTextarea.trim() }]);
    }
    setLogTextarea("");
  }

  return (
    <div className="min-h-screen font-poppins bg-gradient-to-br from-purple-50 to-blue-100 flex flex-col">
      <header className="flex items-center p-4 gap-3 bg-white/80 shadow-sm sticky top-0 z-10">
        <Button size="icon" variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </Button>
        <span className="font-playfair text-xl font-bold text-purple-900">{project.title}</span>
        <Button size="icon" variant="ghost" className="ml-auto">
          <Pencil size={18} />
        </Button>
      </header>

      {/* Progress */}
      <div className="flex flex-col items-center my-4">
        <span className="text-center text-base">{completed} of {tasks.length} tasks done</span>
        <div className="h-3 w-4/5 rounded-lg bg-purple-100 mt-2">
          <div className="h-3 rounded-lg bg-purple-500 transition-all" style={{ width: `${percent}%` }} />
        </div>
        <span className="text-xs mt-1 text-gray-500">{percent}% done</span>
        {/* Contribution graph visual */}
        <div className="mt-2">
          <ContributionGraph logs={logs} />
        </div>
      </div>

      {/* Task / Milestone list */}
      <div className="flex-1 px-3 pb-32">
        <TaskList tasks={tasks} setTasks={setTasks} />
      </div>

      {/* Daily Progress Log */}
      <div className="bg-white/70 backdrop-blur-lg rounded-t-3xl p-4 shadow fixed left-0 bottom-0 w-full max-w-xl mx-auto">
        <div className="flex gap-2 items-center mb-2">
          <ListCheck size={20} className="text-purple-400" />
          <b className="font-playfair">Daily Reflection</b>
        </div>
        <textarea
          placeholder="What did you achieve today?"
          rows={2}
          className="w-full rounded p-2 border border-purple-200 focus:ring-2 focus:ring-purple-400"
          value={logTextarea}
          onChange={(e) => setLogTextarea(e.target.value)}
        />
        <Button variant="secondary" className="w-full mt-2" onClick={handleLogProgress}>
          Log Today's Progress
        </Button>
        {/* Log history preview */}
        {logs.length > 0 && (
          <div className="mt-3 max-h-32 overflow-y-auto text-xs bg-purple-50 rounded p-2">
            <b className="text-purple-600">Your reflections:</b>
            <ul className="mt-1 space-y-1">
              {logs.slice(-5).reverse().map((l, i) => (
                <li key={l.date + i}>
                  <span className="text-gray-500">{l.date}:</span> {l.text}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Floating add task button */}
      <Button className="fixed bottom-28 right-6 bg-purple-600 rounded-full h-14 w-14 shadow-lg text-white text-lg flex items-center justify-center"
        onClick={() => setModalOpen(true)}>
        <Plus />
      </Button>
      <AddTaskModal open={modalOpen} onOpenChange={setModalOpen} onSubmit={handleAddTask} categories={["Urgent", "Routine", "Important", "Personal", "Work-related"]} />
    </div>
  );
}
