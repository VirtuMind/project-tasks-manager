import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface CreateTaskDialogProps {
  onSubmit: (data: { title: string; description: string; dueDate: string }) => Promise<void>;
  isLoading?: boolean;
}

const CreateTaskDialog: React.FC<CreateTaskDialogProps> = ({ onSubmit, isLoading }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ title, description, dueDate });
    setTitle('');
    setDescription('');
    setDueDate(format(new Date(), 'yyyy-MM-dd'));
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-12 px-6 text-lg font-bold uppercase tracking-wide border-4 border-foreground bg-accent text-accent-foreground hover:bg-accent/80 hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-md transition-all">
          <Plus className="mr-2 h-5 w-5" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="border-4 border-foreground bg-card shadow-lg sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold uppercase tracking-wide">
            Create Task
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="task-title" className="text-sm font-bold uppercase tracking-wide">
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
            <Label htmlFor="task-description" className="text-sm font-bold uppercase tracking-wide">
              Description *
            </Label>
            <Textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the task..."
              required
              className="border-4 border-foreground bg-background min-h-24 font-mono resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="due-date" className="text-sm font-bold uppercase tracking-wide">
              Due Date *
            </Label>
            <Input
              id="due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
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
              disabled={isLoading || !title.trim() || !description.trim()}
              className="flex-1 h-12 font-bold uppercase tracking-wide border-4 border-foreground bg-primary text-primary-foreground hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-md transition-all"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Create'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
