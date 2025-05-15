
import React from "react";
import { FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function ProjectList({ projects }) {
  const navigate = useNavigate();

  return (
    <div className={`grid gap-4 sm:grid-cols-2 md:grid-cols-3 animate-fade-in`}>
      {projects.map((project) => (
        <div key={project.id}
          className="bg-white rounded-xl shadow-lg p-4 flex flex-col gap-2 border border-purple-100 min-h-[120px] cursor-pointer hover:scale-105 transition-transform"
          onClick={() =>
            navigate(`/projects/${project.id}`, { state: { project } })
          }
        >
          <div className="flex gap-2 items-center">
            <FolderPlus className="text-purple-300" size={28} />
            <div>
              <div className="font-bold text-lg text-purple-700">{project.title}</div>
              <div className="text-sm text-gray-500">{project.description}</div>
              <div className="w-full mt-2 bg-purple-100 rounded">
                <div
                  className="h-2 rounded bg-purple-400 transition-all"
                  style={{ width: `${project.prog || 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
