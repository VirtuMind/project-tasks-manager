import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Task,
  ProjectProgress,
  ProjectDetails,
  NewTask,
  TaskStatus,
} from "@/types";
import { projectsApi, tasksApi } from "@/lib/api";
import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";
import TaskItem from "@/components/TaskItem";
import CreateTaskDialog from "@/components/CreateTaskDialog";
import EditProjectDialog from "@/components/EditProjectDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft, ListTodo, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus>("all");

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
      toast.error("Failed to load project");
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
      toast.success("Project updated successfully");
    } catch (error) {
      toast.error("Failed to update project");
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
      toast.success("Task created successfully");
    } catch (error) {
      toast.error("Failed to create task");
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
      toast.success("Task updated successfully");
    } catch (error) {
      toast.error("Failed to update task");
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
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await tasksApi.delete(project.id, taskId);
      const updatedTasks = project!.tasks.filter((t) => t.id !== taskId);
      setProject({ ...project!, tasks: updatedTasks });
      updateProgress(updatedTasks);
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const handleDeleteProject = async () => {
    try {
      setIsDeletingProject(true);
      await projectsApi.delete(id!);
      toast.success("Project deleted successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to delete project");
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

  // Filter tasks
  const filteredTasks = project.tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "pending" && !t.isCompleted) ||
      (statusFilter === "completed" && t.isCompleted);
    return matchesSearch && matchesStatus;
  });

  const pendingTasks = filteredTasks.filter((t) => !t.isCompleted);
  const completedTasks = filteredTasks.filter((t) => t.isCompleted);

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
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h3 className="text-2xl font-bold uppercase tracking-wide">Tasks</h3>
          <CreateTaskDialog
            onSubmit={handleCreateTask}
            isLoading={isCreatingTask}
          />
        </div>

        {/* Tasks List */}
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8">
            <ListTodo className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h4 className="text-xl font-bold uppercase tracking-wide mb-2">
              {project.tasks.length === 0
                ? "No tasks yet"
                : "No matching tasks"}
            </h4>
            <p className="text-muted-foreground font-mono">
              {project.tasks.length === 0
                ? "Add your first task to get started"
                : "Try a different search or filter"}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Search & Filter */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 border-2 border-foreground"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(v: TaskStatus) => setStatusFilter(v)}
              >
                <SelectTrigger className="w-36 border-2 border-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
