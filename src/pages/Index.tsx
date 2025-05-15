
import * as React from "react";
import { Plus, FolderPlus } from "lucide-react";
import { ProjectModal } from "../components/ProjectModal";
import { ProjectList } from "../components/ProjectList";

const initialProjects = [
  {
    id: "1",
    title: "Home Renovation",
    description: "Summer kitchen remodel.",
    prog: 60,
    tasks: [],
  },
  {
    id: "2",
    title: "Running Challenge",
    description: "30-day fitness goal.",
    prog: 20,
    tasks: [],
  }
];

const Index = () => {
  const [projects, setProjects] = React.useState(initialProjects);
  const [modalOpen, setModalOpen] = React.useState(false);

  function handleAddProject(project) {
    setProjects((prev) => [
      ...prev,
      { ...project, id: `${Date.now()}-${Math.random()}`, tasks: [], prog: 0 },
    ]);
    setModalOpen(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-50 flex flex-col font-poppins">
      {/* Header */}
      <header className="pb-2 pt-7 px-4 flex flex-col gap-2 bg-gradient-to-b from-purple-200 to-transparent">
        <span className="font-playfair font-bold text-3xl text-purple-800 tracking-tight">Your Projects</span>
        <p className="text-sm text-gray-600">Plan, track, and complete your personal projects with ease.</p>
      </header>

      <main className="flex-1 flex flex-col">
        <div className={`px-3 py-4 flex-1 ${projects.length === 0 ? "flex items-center justify-center" : ""}`}>
          {projects.length === 0 ? (
            <div className="text-center opacity-80 animate-fade-in">
              <FolderPlus className="mx-auto mb-4 text-purple-400" size={44} />
              <h2 className="text-lg font-semibold mb-1">No projects yet</h2>
              <p className="text-sm text-gray-500 mb-6">Tap the "+" button to create your first project!</p>
            </div>
          ) : (
            <ProjectList projects={projects} />
          )}
        </div>
      </main>

      {/* Floating Add Project Button */}
      <button
        className="fixed bottom-6 right-6 bg-purple-500 text-white rounded-full p-5 shadow-xl hover:bg-purple-600 transition-colors duration-200 flex items-center gap-2"
        onClick={() => setModalOpen(true)}
        aria-label="Add new project"
      >
        <Plus size={28} />
      </button>

      {/* Project Creation Modal */}
      <ProjectModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleAddProject}
      />
    </div>
  );
};

export default Index;
