import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Project, ProjectProgress } from "@/types";
import { projectsApi } from "@/lib/api";
import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import CreateProjectDialog from "@/components/CreateProjectDialog";
import { Loader2, FolderOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Home = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const data = await projectsApi.getAll();
      setProjects(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (data: {
    title: string;
    description?: string;
  }) => {
    try {
      setIsCreating(true);
      const response = await projectsApi.create(data);

      if (response?.statusCode === 201) {
        await loadProjects();
      }

      toast({
        title: "Success",
        description: "Project created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
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
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold uppercase tracking-wide">
            Your Projects
          </h3>
          <CreateProjectDialog
            onSubmit={handleCreateProject}
            isLoading={isCreating}
          />
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
      </main>
    </div>
  );
};

export default Home;
