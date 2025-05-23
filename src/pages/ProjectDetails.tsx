
import React, { useState, useEffect } from "react";
import { ArrowLeft, ListCheck, Pencil, Plus } from "lucide-react";
import { TaskList } from "../components/TaskList";
import { Button } from "@/components/ui/button";
import { AddTaskModal } from "../components/AddTaskModal";
import { EditTaskModal } from "../components/EditTaskModal";
import { useNavigate, useLocation } from "react-router-dom";
import ContributionGraph from "../components/ContributionGraph";
import { useToast } from "@/hooks/use-toast";

export default function ProjectDetails() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { toast } = useToast();

  // Get all projects from localStorage, fallback to state if needed
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    const stored = localStorage.getItem("lovable-projects");
    setProjects(stored ? JSON.parse(stored) : []);
  }, []);

  // Get current project id and find in projects array
  const projectId = state?.project?.id || window.location.pathname.split("/").slice(-1)[0];
  const [project, setProject] = useState(state?.project);

  // Sync local project when projects array loads or id changes
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

  // Make sure logs and tasks always in sync with the project object
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [editTaskModalOpen, setEditTaskModalOpen] = useState(false);
  const [currentEditTask, setCurrentEditTask] = useState(null);
  const [tasks, setTasks] = useState(project.tasks || []);
  const [logs, setLogs] = useState(project.logs || []);

  // --- NEW: Sync logs and tasks to project when project changes (fixes stale/incorrect state if user navigates to a new project)
  useEffect(() => {
    setTasks(project.tasks || []);
    setLogs(project.logs || []);
  }, [project]);

  // Keep tasks/logs in sync with current project and update projects array
  useEffect(() => {
    // Update the current project object
    const updatedProject = { ...project, tasks, logs };
    setProject(updatedProject);

    // Update projects array with updated project
    setProjects((curr) =>
      curr.map((p) => (p.id === project.id ? updatedProject : p))
    );
  // Only run when tasks/logs change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, logs]);

  // Persist projects array to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("lovable-projects", JSON.stringify(projects));
  }, [projects]);

  // ---- Progress stats
  const completed = tasks.filter((t) => t.completed).length;
  const percent = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  // ---- Add task handler (add to current project's tasks array)
  function handleAddTask(task) {
    setTasks((prev) => [...prev, { ...task, id: Date.now(), completed: false }]);
    setAddTaskModalOpen(false);
    toast({
      title: "Task added",
      description: "Your new task has been added to the project."
    });
  }

  // ---- Edit task handler
  function handleEditTask(task) {
    setCurrentEditTask(task);
    setEditTaskModalOpen(true);
  }

  // ---- Save edited task
  function handleSaveTask(updatedTask) {
    setTasks(prev => 
      prev.map(task => task.id === updatedTask.id ? updatedTask : task)
    );
    setEditTaskModalOpen(false);
    toast({
      title: "Task updated",
      description: "Your task has been updated successfully."
    });
  }

  // ---- Delete task handler
  function handleDeleteTask(taskId) {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    toast({
      title: "Task deleted",
      description: "Your task has been removed from the project."
    });
  }

  // ---- Toggle task completion and record the date
  function handleToggleTask(id) {
    const today = new Date().toISOString().slice(0, 10);
    
    setTasks(prev => 
      prev.map(task => {
        if (task.id === id) {
          // If completing the task, add today's date
          if (!task.completed) {
            return { ...task, completed: true, completedDate: today };
          } 
          // If uncompleting the task, remove the completion date
          else {
            const { completedDate, ...rest } = task;
            return { ...rest, completed: false };
          }
        }
        return task;
      })
    );
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

  // ------ Render
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
        {/* Contribution graph visual - now with tasks passed to it */}
        <div className="mt-2">
          <ContributionGraph logs={logs} tasks={tasks} />
        </div>
      </div>

      {/* Task / Milestone list */}
      <div className="flex-1 px-3 pb-32">
        <TaskList 
          tasks={tasks} 
          setTasks={setTasks} 
          onToggleTask={handleToggleTask} 
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
        />
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

      {/* Floating add task button (black styled) */}
      <button
        className="fixed bottom-28 right-6 bg-black text-white rounded-full p-5 shadow-xl hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center"
        onClick={() => setAddTaskModalOpen(true)}
      >
        <Plus size={28} />
      </button>
      
      {/* Task Modals */}
      <AddTaskModal 
        open={addTaskModalOpen} 
        onOpenChange={setAddTaskModalOpen} 
        onSubmit={handleAddTask} 
        categories={["Urgent", "Routine", "Important", "Personal", "Work-related"]} 
      />
      
      <EditTaskModal 
        open={editTaskModalOpen}
        onOpenChange={setEditTaskModalOpen}
        onSubmit={handleSaveTask}
        task={currentEditTask}
        categories={["Urgent", "Routine", "Important", "Personal", "Work-related"]}
      />
    </div>
  );
}
