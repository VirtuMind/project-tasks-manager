import { useState, useEffect } from "react";
import { Task } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Edit } from "lucide-react";
import { format } from "date-fns";

interface EditTaskDialogProps {
  task: Task;
  onSubmit: (taskId: string, data: Partial<Task>) => Promise<void>;
  isLoading?: boolean;
}

const EditTaskDialog: React.FC<EditTaskDialogProps> = ({
  task,
  onSubmit,
  isLoading,
}) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [dueDate, setDueDate] = useState<string>("");

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setTitle(task.title);
      setDescription(task.description || "");
      if (task.dueDate) {
        setDueDate(format(task.dueDate, "yyyy-MM-dd"));
      } else {
        setDueDate("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(task.id, {
      title,
      description: description || undefined,
      dueDate: dueDate || null,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 border-2 border-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
        >
          <Edit className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="border-4 border-foreground bg-card shadow-lg sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold uppercase tracking-wide">
            Edit Task
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label
              htmlFor="task-title"
              className="text-sm font-bold uppercase tracking-wide"
            >
              Title *
            </Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task name"
              required
              className="border-4 border-foreground bg-background h-12 text-lg font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="task-description"
              className="text-sm font-bold uppercase tracking-wide"
            >
              Description (optional)
            </Label>
            <Textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the task..."
              className="border-4 border-foreground bg-background min-h-24 font-mono resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="due-date"
              className="text-sm font-bold uppercase tracking-wide"
            >
              Due Date (optional)
            </Label>
            <Input
              id="due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border-4 border-foreground bg-background h-12 text-lg font-mono"
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 h-12 font-bold uppercase tracking-wide border-4 border-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !title.trim()}
              className="flex-1 h-12 font-bold uppercase tracking-wide border-4 border-foreground bg-primary text-primary-foreground hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-md transition-all"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskDialog;
