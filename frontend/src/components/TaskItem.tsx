import { Task } from "@/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Calendar } from "lucide-react";
import { format, isPast, isToday } from "date-fns";
import EditTaskDialog from "./EditTaskDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onUpdate: (taskId: string, data: Partial<Task>) => Promise<void>;
  isUpdating?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onDelete,
  onUpdate,
  isUpdating,
}) => {
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDate && isPast(dueDate) && !task.isCompleted;
  const isDueToday = dueDate && isToday(dueDate);

  const getDueDateColor = () => {
    if (task.isCompleted) return "text-muted-foreground";
    if (isOverdue) return "text-destructive";
    if (isDueToday)
      return "text-warning-foreground bg-warning px-2 py-1 border-2 border-foreground";
    return "text-muted-foreground";
  };

  return (
    <div
      className={`border-4 border-foreground bg-card p-4 shadow-sm transition-all ${
        task.isCompleted ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        <Checkbox
          checked={task.isCompleted}
          onCheckedChange={() => onToggle(task.id)}
          className="mt-1 h-6 w-6 border-4 border-foreground data-[state=checked]:bg-success data-[state=checked]:border-success"
        />

        <div className="flex-1 min-w-0">
          <h4
            className={`font-bold text-lg ${
              task.isCompleted ? "line-through" : ""
            }`}
          >
            {task.title}
          </h4>
          {task.description && (
            <p
              className={`text-muted-foreground mt-1 ${
                task.isCompleted ? "line-through" : ""
              }`}
            >
              {task.description}
            </p>
          )}
          {dueDate && (
            <div
              className={`flex items-center gap-2 mt-2 font-mono text-sm ${getDueDateColor()}`}
            >
              <Calendar className="h-4 w-4" />
              <span>
                {isOverdue && "Overdue: "}
                {isDueToday && "Due Today: "}
                {format(dueDate, "MMM d, yyyy")}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <EditTaskDialog
            task={task}
            onSubmit={onUpdate}
            isLoading={isUpdating}
          />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 border-2 border-foreground hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-4 border-foreground bg-card shadow-lg">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-bold uppercase tracking-wide">
                  Delete Task?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground">
                  This will permanently delete "{task.title}". This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="gap-4">
                <AlertDialogCancel className="h-12 font-bold uppercase tracking-wide border-4 border-foreground">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(task.id)}
                  className="h-12 font-bold uppercase tracking-wide border-4 border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
