using Microsoft.EntityFrameworkCore;
using ProjectTasksManager.Data;
using ProjectTasksManager.Models;

namespace ProjectTasksManager.Repositories;

public interface ITaskRepository
{
    Task<IEnumerable<ProjectTask>> GetProjectTasksAsync(int projectId);
    Task<ProjectTask?> GetByIdAsync(int taskId);
    Task<ProjectTask?> GetTaskWithProjectAsync(int taskId, int projectId, int userId);
    Task AddAsync(ProjectTask task);
    void Remove(ProjectTask task);
    Task SaveChangesAsync();
}

public class TaskRepository(AppDbContext context) : ITaskRepository
{
    public async Task<IEnumerable<ProjectTask>> GetProjectTasksAsync(int projectId)
    {
        return await context.Tasks
            .Where(t => t.ProjectId == projectId)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<ProjectTask?> GetByIdAsync(int taskId)
    {
        return await context.Tasks.FindAsync(taskId);
    }

    public async Task<ProjectTask?> GetTaskWithProjectAsync(int taskId, int projectId, int userId)
    {
        return await context.Tasks
            .Include(t => t.Project)
            .FirstOrDefaultAsync(t =>
                t.Id == taskId &&
                t.ProjectId == projectId &&
                t.Project.UserId == userId);
    }

    public async Task AddAsync(ProjectTask task)
    {
        await context.Tasks.AddAsync(task);
    }

    public void Remove(ProjectTask task)
    {
        context.Tasks.Remove(task);
    }

    public async Task SaveChangesAsync()
    {
        await context.SaveChangesAsync();
    }
}
