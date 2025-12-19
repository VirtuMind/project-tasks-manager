import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Project, Task, ProjectProgress } from "@/types";
import { projectsApi, tasksApi } from "@/lib/api";
import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";
import TaskItem from "@/components/TaskItem";
import CreateTaskDialog from "@/components/CreateTaskDialog";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ListTodo, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [progress, setProgress] = useState<ProjectProgress>({
    totalTasks: 0,
    completedTasks: 0,
    progressPercentage: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isDeletingProject, setIsDeletingProject] = useState(false);

  useEffect(() => {
    if (id) {
      loadProjectData();
    }
  }, [id]);

  const loadProjectData = async () => {
    try {
      setIsLoading(true);
      const [projectData, tasksData, progressData] = await Promise.all([
        projectsApi.getById(id!),
        tasksApi.getByProject(id!),
        projectsApi.getProgress(id!),
      ]);
      setProject(projectData);
      setTasks(tasksData);
      setProgress(progressData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load project",
        variant: "destructive",
      });
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (data: {
    title: string;
    description: string;
    dueDate: string;
  }) => {
    try {
      setIsCreatingTask(true);
      const newTask = await tasksApi.create(id!, data);
      setTasks([...tasks, newTask]);
      updateProgress([...tasks, newTask]);
      toast({
        title: "Success",
        description: "Task created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    } finally {
      setIsCreatingTask(false);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      const updatedTask = await tasksApi.toggleComplete(taskId);
      const updatedTasks = tasks.map((t) =>
        t.id === taskId ? updatedTask : t
      );
      setTasks(updatedTasks);
      updateProgress(updatedTasks);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await tasksApi.delete(taskId);
      const updatedTasks = tasks.filter((t) => t.id !== taskId);
      setTasks(updatedTasks);
      updateProgress(updatedTasks);
      toast({
        title: "Success",
        description: "Task deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = async () => {
    try {
      setIsDeletingProject(true);
      await projectsApi.delete(id!);
      toast({
        title: "Success",
        description: "Project deleted",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    } finally {
      setIsDeletingProject(false);
    }
  };

  const updateProgress = (taskList: Task[]) => {
    const total = taskList.length;
    const completed = taskList.filter((t) => t.completed).length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    setProgress({
      totalTasks: total,
      completedTasks: completed,
      progressPercentage: percentage,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="border-4 border-foreground bg-card p-8 shadow-md flex items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="font-mono text-lg">Loading project...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-bold uppercase tracking-wide mb-6 hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Projects
        </Link>

        {/* Project Header */}
        <div className="border-4 border-foreground bg-card p-6 shadow-md mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wide mb-2">
                {project.title}
              </h2>
              {project.description && (
                <p className="text-muted-foreground text-lg mb-4">
                  {project.description}
                </p>
              )}
              <p className="text-sm text-muted-foreground font-mono">
                Created: {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="lg:w-72">
              <ProgressBar
                progress={progress.progressPercentage}
                total={progress.totalTasks}
                completed={progress.completedTasks}
                size="lg"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h3 className="text-2xl font-bold uppercase tracking-wide">Tasks</h3>
          <div className="flex items-center gap-4">
            <CreateTaskDialog
              onSubmit={handleCreateTask}
              isLoading={isCreatingTask}
            />

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-12 px-6 font-bold uppercase tracking-wide border-4 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                  <Trash2 className="mr-2 h-5 w-5" />
                  Delete Project
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border-4 border-foreground bg-card shadow-lg">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-2xl font-bold uppercase tracking-wide">
                    Delete Project?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground">
                    This will permanently delete the project and all its tasks.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-4">
                  <AlertDialogCancel className="h-12 font-bold uppercase tracking-wide border-4 border-foreground">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteProject}
                    disabled={isDeletingProject}
                    className="h-12 font-bold uppercase tracking-wide border-4 border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeletingProject ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Delete"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Tasks List */}
        {tasks.length === 0 ? (
          <div className="border-4 border-foreground bg-card p-12 shadow-md text-center">
            <ListTodo className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h4 className="text-xl font-bold uppercase tracking-wide mb-2">
              No tasks yet
            </h4>
            <p className="text-muted-foreground font-mono">
              Add your first task to get started
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Pending Tasks */}
            {pendingTasks.length > 0 && (
              <div>
                <h4 className="text-lg font-bold uppercase tracking-wide mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-warning border-2 border-foreground" />
                  Pending ({pendingTasks.length})
                </h4>
                <div className="space-y-4">
                  {pendingTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={handleToggleTask}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div>
                <h4 className="text-lg font-bold uppercase tracking-wide mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-success border-2 border-foreground" />
                  Completed ({completedTasks.length})
                </h4>
                <div className="space-y-4">
                  {completedTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={handleToggleTask}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProjectDetail;
