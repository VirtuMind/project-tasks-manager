using Microsoft.EntityFrameworkCore;
using ProjectTasksManager.Data;
using ProjectTasksManager.Models;

namespace ProjectTasksManager.Repositories;

public interface IProjectRepository
{
    Task<List<Project>> GetUserProjectsWithTasksAsync(int userId);
    Task<(List<Project>, int)> GetUserProjectsPaginatedAsync(int userId, int page, int limit);
    Task<Project?> GetByIdAsync(int projectId);
    Task<Project?> GetProjectDetailsByIdAndUserIdAsync(int projectId, int userId);
    Task<Project?> GetUserProjectWithTasksAsync(int projectId);
    Task<bool> UserProjectExistsAsync(int projectId, int userId);
    Task AddAsync(Project project);
    void Remove(Project project);
    Task<bool> SaveChangesAsync();
}

public class ProjectRepository(AppDbContext _context) : IProjectRepository
{
    public async Task<List<Project>> GetUserProjectsWithTasksAsync(int userId)
    {
        return await _context.Projects
            .Where(p => p.UserId == userId)
            .Include(p => p.Tasks)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<(List<Project>, int)> GetUserProjectsPaginatedAsync(int userId, int page, int limit)
    {
        var query = _context.Projects
            .Where(p => p.UserId == userId)
            .Include(p => p.Tasks)
            .OrderByDescending(p => p.CreatedAt);

        var total = await query.CountAsync();
        var items = await query.Skip((page - 1) * limit).Take(limit).ToListAsync();
        return (items, total);
    }

    public async Task<Project?> GetByIdAsync(int projectId)
    {
        return await _context.Projects.FindAsync(projectId);
    }

    public async Task<Project?> GetProjectDetailsByIdAndUserIdAsync(int projectId, int userId)
    {
        return await _context.Projects
            .Include(p => p.Tasks)
            .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);
    }

    public async Task<Project?> GetUserProjectWithTasksAsync(int projectId)
    {
        return await _context.Projects
            .Include(p => p.Tasks)
            .FirstOrDefaultAsync(p => p.Id == projectId);
    }

    public async Task<bool> UserProjectExistsAsync(int projectId, int userId)
    {
        return await _context.Projects
            .AnyAsync(p => p.Id == projectId && p.UserId == userId);
    }

    public async Task AddAsync(Project project)
    {
        await _context.Projects.AddAsync(project);
    }

    public void Remove(Project project)
    {
        _context.Projects.Remove(project);
    }

    public async Task<bool> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }
}
