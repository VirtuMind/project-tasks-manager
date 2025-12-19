import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Task, ProjectProgress, ProjectDetails, NewTask } from "@/types";
import { projectsApi, tasksApi } from "@/lib/api";
import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";
import TaskItem from "@/components/TaskItem";
import CreateTaskDialog from "@/components/CreateTaskDialog";
import EditProjectDialog from "@/components/EditProjectDialog";
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

  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [progress, setProgress] = useState<ProjectProgress>({
    totalTasks: 0,
    completedTasks: 0,
    progressPercentage: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isDeletingProject, setIsDeletingProject] = useState(false);
  const [isUpdatingProject, setIsUpdatingProject] = useState(false);
  const [isUpdatingTask, setIsUpdatingTask] = useState(false);

  useEffect(() => {
    if (id) {
      loadProjectData();
    }
  }, [id]);

  const loadProjectData = async () => {
    try {
      setIsLoading(true);
      const projectDetails = await projectsApi.getById(id!);
      setProject(projectDetails);
      setProgress(projectDetails.stats);
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

  const handleUpdateProject = async (data: {
    title: string;
    description?: string;
  }) => {
    try {
      setIsUpdatingProject(true);
      const response = await projectsApi.update(id!, data);
      setProject({ ...project!, ...response });
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingProject(false);
    }
  };

  const handleCreateTask = async (newTask: NewTask) => {
    try {
      setIsCreatingTask(true);
      const response = await tasksApi.create(id!, newTask);
      setProject({ ...project!, tasks: [...project!.tasks, response] });
      updateProgress([...project!.tasks, response]);
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

  const handleUpdateTask = async (taskId: string, data: Partial<Task>) => {
    try {
      setIsUpdatingTask(true);
      const updatedTask = await tasksApi.update(project.id, taskId, data);
      const updatedTasks = project!.tasks.map((t) =>
        t.id === taskId ? updatedTask : t
      );
      setProject({ ...project!, tasks: updatedTasks });
      updateProgress(updatedTasks);
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingTask(false);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      const updatedTask = await tasksApi.toggleComplete(project.id, taskId);
      const updatedTasks = project!.tasks.map((t) =>
        t.id === taskId ? updatedTask : t
      );
      setProject({ ...project!, tasks: updatedTasks });
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
      await tasksApi.delete(project.id, taskId);
      const updatedTasks = project!.tasks.filter((t) => t.id !== taskId);
      setProject({ ...project!, tasks: updatedTasks });
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
    const completed = taskList.filter((t) => t.isCompleted).length;
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

  const pendingTasks = project.tasks.filter((t) => !t.isCompleted);
  const completedTasks = project.tasks.filter((t) => t.isCompleted);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Back Link */}

        <div className="flex items-center justify-between mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-bold uppercase tracking-wide hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Projects
          </Link>

          <div className="flex items-center gap-4">
            <EditProjectDialog
              project={project}
              onSubmit={handleUpdateProject}
              isLoading={isUpdatingProject}
            />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-12 px-6 text-lg font-bold uppercase tracking-wide border-4 border-foreground bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-md transition-all"
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
          </div>
        </div>

        {/* Tasks List */}
        {project.tasks.length === 0 ? (
          <div className="text-center">
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
                      onUpdate={handleUpdateTask}
                      isUpdating={isUpdatingTask}
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
                      onUpdate={handleUpdateTask}
                      isUpdating={isUpdatingTask}
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
