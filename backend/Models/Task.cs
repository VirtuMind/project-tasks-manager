namespace ProjectTasksManager.Models;

public class ProjectTask
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public DateTime? DueDate { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }

    public int ProjectId { get; set; }
    public Project Project { get; set; } = null!;
}
