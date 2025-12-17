using AutoMapper;
using ProjectTasksManager.DTOs;
using ProjectTasksManager.Models;
using ProjectTasksManager.Repositories;

namespace ProjectTasksManager.Services;

public interface IProjectService
{
    Task<List<ProjectDto>> GetUserProjectsAsync(int userId);
    Task<ProjectDto?> GetProjectByIdAsync(int projectId);
    Task<bool> CreateProjectAsync(CreateProjectRequest request, int userId);
    Task<ProjectDto?> UpdateProjectAsync(int projectId, UpdateProjectRequest request, int userId);
    Task<bool> DeleteProjectAsync(int projectId, int userId);
    Task<ProjectProgressDto?> GetProjectProgressAsync(int projectId, int userId);
    Task<ProjectDto?> GetUserProjectByIdAsync(int projectId, int userId);
}

public class ProjectService(IProjectRepository _projectRepository, IMapper _mapper) : IProjectService
{
    public async Task<List<ProjectDto>> GetUserProjectsAsync(int userId)
    {
        List<Project> projects = await _projectRepository.GetUserProjectsWithTasksAsync(userId);
        return _mapper.Map<List<ProjectDto>>(projects);
    }

    public async Task<ProjectDto?> GetProjectByIdAsync(int projectId)
    {
        var project = await _projectRepository.GetUserProjectWithTasksAsync(projectId);

        if (project is null)
            return null;

        return _mapper.Map<ProjectDto>(project);
    }

    public async Task<ProjectDto?> GetUserProjectByIdAsync(int projectId, int userId)
    {
        var project = await _projectRepository.GetProjectByIdAndUserIdAsync(projectId, userId);
        
        if (project is null)
            return null;

        return _mapper.Map<ProjectDto>(project);
    }

    public async Task<bool> CreateProjectAsync(CreateProjectRequest request, int userId)
    {
        var project = _mapper.Map<Project>(request);
        project.UserId = userId;

        await _projectRepository.AddAsync(project);

        return await _projectRepository.SaveChangesAsync();
    }

    public async Task<ProjectDto?> UpdateProjectAsync(int projectId, UpdateProjectRequest request, int userId)
    {
        var project = await _projectRepository.GetUserProjectWithTasksAsync(projectId);

        if (project is null)
        {
            return null;
        }

        _mapper.Map(request, project);
        await _projectRepository.SaveChangesAsync();

        return _mapper.Map<ProjectDto>(project);
    }

    public async Task<bool> DeleteProjectAsync(int projectId, int userId)
    {
        var project = await _projectRepository.GetProjectByIdAndUserIdAsync(projectId, userId);

        if (project is null)
            return false;

        _projectRepository.Remove(project);
        await _projectRepository.SaveChangesAsync();

        return true;
    }

    public async Task<ProjectProgressDto?> GetProjectProgressAsync(int projectId, int userId)
    {
        var project = await _projectRepository.GetUserProjectWithTasksAsync(projectId);

        if (project is null)
        {
            return null;
        }

        var totalTasks = project.Tasks.Count;
        var completedTasks = project.Tasks.Count(t => t.IsCompleted);
        var progressPercentage = totalTasks > 0
            ? Math.Round((double)completedTasks / totalTasks * 100, 2)
            : 0;

        return new ProjectProgressDto 
        { 
            TotalTasks= totalTasks, 
            CompletedTasks = completedTasks,  
            ProgressPercentage = progressPercentage 
        };
    }
}
