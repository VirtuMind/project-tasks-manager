using System.ComponentModel.DataAnnotations;

namespace ProjectTasksManager.DTOs;

public record CreateProjectRequest(
    [Required, MaxLength(200)] string Title,
    [MaxLength(1000)] string? Description
);

public record UpdateProjectRequest(
    [Required, MaxLength(200)] string Title,
    [MaxLength(1000)] string? Description
);

public record ProjectDto
{
    public int Id { get; init; }
    public string Title { get; init; } = null!;
    public string? Description { get; init; }
    public DateTime CreatedAt { get; init; }
    public ProjectProgressDto Stats { get; init; } = null!;
};

public record ProjectDetailsDto : ProjectDto
{
    public List<TaskDto> Tasks { get; init; } = [];
}

public record ProjectProgressDto
{
    public int TotalTasks { get; init; }
    public int CompletedTasks { get; init; }
    public double ProgressPercentage { get; init; }
}


