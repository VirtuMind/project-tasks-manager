import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Project } from "@/types";
import { projectsApi } from "@/lib/api";
import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import CreateProjectDialog from "@/components/CreateProjectDialog";
import { Loader2, FolderOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Home = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const data = await projectsApi.getAll(page, limit);
      setProjects(data.items);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    } catch (error) {
      toast.error("Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const handleCreateProject = async (data: {
    title: string;
    description?: string;
  }) => {
    try {
      setIsCreating(true);
      await projectsApi.create(data);
      setPage(1); // Go to first page to see new project
      loadProjects();
      toast.success("Project created successfully");
    } catch (error) {
      toast.error("Failed to create project");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wide mb-2">
            Welcome, {user?.name}!
          </h2>
          <p className="text-muted-foreground font-mono text-lg">
            Manage your projects and tasks
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <h3 className="text-2xl font-bold uppercase tracking-wide">
            Your Projects
          </h3>
          <div className="flex items-center gap-3">
            <Select
              value={String(limit)}
              onValueChange={(v) => {
                setLimit(Number(v));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-24 border-2 border-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="9">9</SelectItem>
                <SelectItem value="12">12</SelectItem>
              </SelectContent>
            </Select>
            <CreateProjectDialog
              onSubmit={handleCreateProject}
              isLoading={isCreating}
            />
          </div>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="border-4 border-foreground bg-card p-8 shadow-md flex items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="font-mono text-lg">Loading projects...</span>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="border-4 border-foreground bg-card p-12 shadow-md text-center">
            <FolderOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h4 className="text-xl font-bold uppercase tracking-wide mb-2">
              No projects yet
            </h4>
            <p className="text-muted-foreground font-mono">
              Create your first project to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              onClick={() => setPage((p) => p - 1)}
              disabled={page <= 1}
              className="border-2 border-foreground"
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </Button>
            <span className="font-mono">
              Page {page} of {totalPages} ({totalCount} total)
            </span>
            <Button
              variant="outline"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages}
              className="border-2 border-foreground"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
