interface ProgressBarProps {
  progress: number;
  total: number;
  completed: number;
  size?: "sm" | "md" | "lg";
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  total,
  completed,
  size = "md",
}) => {
  const heights = {
    sm: "h-4",
    md: "h-6",
    lg: "h-8",
  };

  const getProgressColor = () => {
    if (progress > 0) return "bg-success";
    return "bg-muted";
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center font-mono text-sm">
        <span className="font-bold">
          {completed}/{total} tasks
        </span>
        <span className="font-bold">{Math.round(progress)}%</span>
      </div>
      <div
        className={`w-full ${heights[size]} border-4 border-foreground bg-background overflow-hidden`}
      >
        <div
          className={`h-full ${getProgressColor()} transition-all duration-500 ease-out`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
