import { Task } from '@/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Calendar } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  const dueDate = new Date(task.dueDate);
  const isOverdue = isPast(dueDate) && !isToday(dueDate) && !task.completed;
  const isDueToday = isToday(dueDate);

  const getDueDateColor = () => {
    if (task.completed) return 'text-muted-foreground';
    if (isOverdue) return 'text-destructive';
    if (isDueToday) return 'text-warning-foreground bg-warning px-2 py-1 border-2 border-foreground';
    return 'text-muted-foreground';
  };

  return (
    <div 
      className={`border-4 border-foreground bg-card p-4 shadow-sm transition-all ${
        task.completed ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
          className="mt-1 h-6 w-6 border-4 border-foreground data-[state=checked]:bg-success data-[state=checked]:border-success"
        />
        
        <div className="flex-1 min-w-0">
          <h4 className={`font-bold text-lg ${task.completed ? 'line-through' : ''}`}>
            {task.title}
          </h4>
          {task.description && (
            <p className={`text-muted-foreground mt-1 ${task.completed ? 'line-through' : ''}`}>
              {task.description}
            </p>
          )}
          <div className={`flex items-center gap-2 mt-2 font-mono text-sm ${getDueDateColor()}`}>
            <Calendar className="h-4 w-4" />
            <span>
              {isOverdue && 'Overdue: '}
              {isDueToday && 'Due Today: '}
              {format(dueDate, 'MMM d, yyyy')}
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(task.id)}
          className="h-10 w-10 border-2 border-foreground hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default TaskItem;
