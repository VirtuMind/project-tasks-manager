import { Link } from 'react-router-dom';
import { Project, ProjectProgress } from '@/types';
import ProgressBar from './ProgressBar';
import { Folder, ArrowRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  progress?: ProjectProgress;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, progress }) => {
  return (
    <Link 
      to={`/projects/${project.id}`}
      className="block group"
    >
      <div className="border-4 border-foreground bg-card p-6 shadow-md hover:shadow-lg hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 border-4 border-foreground bg-primary flex items-center justify-center">
              <Folder className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-bold uppercase tracking-wide line-clamp-1">
                {project.title}
              </h3>
              <p className="text-sm text-muted-foreground font-mono">
                {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <ArrowRight className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {project.description && (
          <p className="text-muted-foreground mb-4 line-clamp-2">
            {project.description}
          </p>
        )}

        {progress && (
          <ProgressBar 
            progress={progress.progressPercentage}
            total={progress.totalTasks}
            completed={progress.completedTasks}
            size="sm"
          />
        )}
      </div>
    </Link>
  );
};

export default ProjectCard;
