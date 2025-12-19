import { useState, useEffect } from "react";
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

interface EditProjectDialogProps {
  project: {
    title: string;
    description?: string;
  };
  onSubmit: (data: { title: string; description?: string }) => Promise<void>;
  isLoading?: boolean;
}

const EditProjectDialog: React.FC<EditProjectDialogProps> = ({
  project,
  onSubmit,
  isLoading,
}) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description || "");

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setTitle(project.title);
      setDescription(project.description || "");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      title,
      description: description || undefined,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="h-12 px-6 text-lg font-bold uppercase tracking-wide border-4 border-foreground bg-primary text-primary-foreground hover:bg-primary/80 hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-md transition-all">
          <Edit className="mr-2 h-5 w-5" />
          Edit Project
        </Button>
      </DialogTrigger>
      <DialogContent className="border-4 border-foreground bg-card shadow-lg sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold uppercase tracking-wide">
            Edit Project
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label
              htmlFor="project-title"
              className="text-sm font-bold uppercase tracking-wide"
            >
              Title *
            </Label>
            <Input
              id="project-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Project name"
              required
              className="border-4 border-foreground bg-background h-12 text-lg font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="project-description"
              className="text-sm font-bold uppercase tracking-wide"
            >
              Description (optional)
            </Label>
            <Textarea
              id="project-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project..."
              className="border-4 border-foreground bg-background min-h-24 font-mono resize-none"
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

export default EditProjectDialog;
