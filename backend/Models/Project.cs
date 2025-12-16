namespace ProjectTasksManager.Models;

public class Project
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public ICollection<ProjectTask> Tasks { get; set; } = [];
}
