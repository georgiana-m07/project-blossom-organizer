
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AddTaskModal({ open, onOpenChange, onSubmit, categories }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(categories[0] || "");
  const [priority, setPriority] = useState("Medium");
  const [due, setDue] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name, category, priority, due });
    setName(""); setCategory(categories[0] || ""); setPriority("Medium"); setDue("");
  }

  React.useEffect(() => { if (!open) setName(""); }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-xl px-3 py-8 gap-3">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h2 className="font-bold text-lg text-purple-800">Add New Task</h2>
          <div>
            <Label>Task Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="E.g. Order supplies" maxLength={60} required autoFocus />
          </div>
          <div className="flex gap-2">
            <div className="w-1/2">
              <Label>Category</Label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="mt-1 w-full rounded border p-2">
                {categories.map(cat => <option key={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="w-1/2">
              <Label>Priority</Label>
              <select value={priority} onChange={e => setPriority(e.target.value)} className="mt-1 w-full rounded border p-2">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>
          <div>
            <Label>Due Date</Label>
            <Input type="date" value={due} onChange={e => setDue(e.target.value)} />
          </div>
          <Button type="submit" className="w-full bg-purple-500 text-white">Add Task</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
