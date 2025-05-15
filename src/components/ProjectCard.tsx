
import React from "react";
import { FolderPlus } from "lucide-react";

type ProjectCardProps = {
  title: string;
  description: string;
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ title, description }) => (
  <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col gap-2 hover:scale-105 transition-transform duration-200 border border-purple-100 min-h-[120px]">
    <div className="flex items-center gap-2">
      <FolderPlus className="text-purple-300" size={28} />
      <div>
        <div className="font-bold text-lg text-purple-700">{title}</div>
        <div className="text-sm text-gray-500">{description}</div>
      </div>
    </div>
    {/* Placeholder: Next versions will show progress bars, categories, etc. */}
  </div>
);
