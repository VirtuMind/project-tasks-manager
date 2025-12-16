using Microsoft.EntityFrameworkCore;
using ProjectTasksManager.Data;
using ProjectTasksManager.Models;

namespace ProjectTasksManager.Repositories;

public interface IProjectRepository
{
    Task<List<Project>> GetUserProjectsWithTasksAsync(int userId);
    Task<Project?> GetByIdAsync(int projectId);
    Task<Project?> GetUserProjectByIdAsync(int projectId, int userId);
    Task<Project?> GetUserProjectWithTasksAsync(int projectId);
    Task<bool> UserProjectExistsAsync(int projectId, int userId);
    Task AddAsync(Project project);
    void Remove(Project project);
    Task<bool> SaveChangesAsync();
}

public class ProjectRepository(AppDbContext context) : IProjectRepository
{
    public async Task<List<Project>> GetUserProjectsWithTasksAsync(int userId)
    {
        return await context.Projects
            .Where(p => p.UserId == userId)
            .Include(p => p.Tasks)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<Project?> GetByIdAsync(int projectId)
    {
        return await context.Projects.FindAsync(projectId);
    }

    public async Task<Project?> GetUserProjectByIdAsync(int projectId, int userId)
    {
        return await context.Projects
            .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);
    }

    public async Task<Project?> GetUserProjectWithTasksAsync(int projectId)
    {
        return await context.Projects
            .Include(p => p.Tasks)
            .FirstOrDefaultAsync(p => p.Id == projectId);
    }

    public async Task<bool> UserProjectExistsAsync(int projectId, int userId)
    {
        return await context.Projects
            .AnyAsync(p => p.Id == projectId && p.UserId == userId);
    }

    public async Task AddAsync(Project project)
    {
        await context.Projects.AddAsync(project);
    }

    public void Remove(Project project)
    {
        context.Projects.Remove(project);
    }

    public async Task<bool> SaveChangesAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
