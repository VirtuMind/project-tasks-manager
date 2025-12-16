using System.ComponentModel.DataAnnotations;

namespace ProjectTasksManager.DTOs;

public record CreateTaskRequest(
    [Required, MaxLength(200)] string Title,
    [MaxLength(1000)] string? Description,
    DateTime? DueDate
);

public record UpdateTaskRequest(
    [Required, MaxLength(200)] string Title,
    [MaxLength(1000)] string? Description,
    DateTime? DueDate
);

public record TaskDto(
    int Id,
    string Title,
    string? Description,
    DateTime? DueDate,
    bool IsCompleted,
    DateTime CreatedAt,
    DateTime? CompletedAt
);
