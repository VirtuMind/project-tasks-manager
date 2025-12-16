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
}

public class ProjectService(IProjectRepository projectRepository, IMapper mapper) : IProjectService
{
    public async Task<List<ProjectDto>> GetUserProjectsAsync(int userId)
    {
        List<Project> projects = await projectRepository.GetUserProjectsWithTasksAsync(userId);
        return mapper.Map<List<ProjectDto>>(projects);
    }

    public async Task<ProjectDto?> GetProjectByIdAsync(int projectId)
    {
        var project = await projectRepository.GetUserProjectWithTasksAsync(projectId);

        if (project is null)
            return null;

        return mapper.Map<ProjectDto>(project);
    }

    public async Task<bool> CreateProjectAsync(CreateProjectRequest request, int userId)
    {
        var project = mapper.Map<Project>(request);
        project.UserId = userId;

        await projectRepository.AddAsync(project);

        return await projectRepository.SaveChangesAsync();
    }

    public async Task<ProjectDto?> UpdateProjectAsync(int projectId, UpdateProjectRequest request, int userId)
    {
        var project = await projectRepository.GetUserProjectWithTasksAsync(projectId);

        if (project is null)
        {
            return null;
        }

        mapper.Map(request, project);
        await projectRepository.SaveChangesAsync();

        return mapper.Map<ProjectDto>(project);
    }

    public async Task<bool> DeleteProjectAsync(int projectId, int userId)
    {
        var project = await projectRepository.GetUserProjectByIdAsync(projectId, userId);

        if (project is null)
        {
            return false;
        }

        projectRepository.Remove(project);
        await projectRepository.SaveChangesAsync();

        return true;
    }

    public async Task<ProjectProgressDto?> GetProjectProgressAsync(int projectId, int userId)
    {
        var project = await projectRepository.GetUserProjectWithTasksAsync(projectId);

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
