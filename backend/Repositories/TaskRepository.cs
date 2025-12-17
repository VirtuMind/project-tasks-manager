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

public class TaskRepository(AppDbContext _context) : ITaskRepository
{
    public async Task<IEnumerable<ProjectTask>> GetProjectTasksAsync(int projectId)
    {
        return await _context.Tasks
            .Where(t => t.ProjectId == projectId)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<ProjectTask?> GetByIdAsync(int taskId)
    {
        return await _context.Tasks.FindAsync(taskId);
    }

    public async Task<ProjectTask?> GetTaskWithProjectAsync(int taskId, int projectId, int userId)
    {
        return await _context.Tasks
            .Include(t => t.Project)
            .FirstOrDefaultAsync(t =>
                t.Id == taskId &&
                t.ProjectId == projectId &&
                t.Project.UserId == userId);
    }

    public async Task AddAsync(ProjectTask task)
    {
        await _context.Tasks.AddAsync(task);
    }

    public void Remove(ProjectTask task)
    {
        _context.Tasks.Remove(task);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
