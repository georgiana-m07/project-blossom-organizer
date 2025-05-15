
import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ProjectModalProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (data: { title: string; description: string }) => void;
};

export const ProjectModal: React.FC<ProjectModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), description: description.trim() });
    setTitle("");
    setDescription("");
  };

  React.useEffect(() => {
    if (!open) {
      setTitle("");
      setDescription("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[350px] rounded-2xl px-4 py-8 font-poppins">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-purple-700">Create Project</h2>
          <div>
            <Label htmlFor="proj-title">Title</Label>
            <Input
              id="proj-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={60}
              required
              autoFocus
              placeholder="Project name"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="proj-desc">Description</Label>
            <Input
              id="proj-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={120}
              placeholder="(Optional) Brief description"
              className="mt-1"
            />
          </div>
          <Button type="submit" className="mt-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold">
            Add Project
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
