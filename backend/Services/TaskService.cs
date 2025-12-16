using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ProjectTasksManager.Data;
using ProjectTasksManager.DTOs;
using ProjectTasksManager.Models;
using ProjectTasksManager.Repositories;

namespace ProjectTasksManager.Services;

public interface ITaskService
{
    Task<List<TaskDto>> GetProjectTasksAsync(int projectId, int userId);
    Task<TaskDto?> GetTaskByIdAsync(int taskId, int projectId, int userId);
    Task<TaskDto?> CreateTaskAsync(int projectId, CreateTaskRequest request, int userId);
    Task<TaskDto?> UpdateTaskAsync(int taskId, int projectId, UpdateTaskRequest request, int userId);
    Task<TaskDto?> MarkTaskAsCompletedAsync(int taskId, int projectId, int userId);
    Task<bool> DeleteTaskAsync(int taskId, int projectId, int userId);
}

public class TaskService(
    ITaskRepository taskRepository,
    IProjectRepository projectRepository,
    IMapper mapper) : ITaskService
{
    public async Task<List<TaskDto>> GetProjectTasksAsync(int projectId, int userId)
    {
        var projectExists = await projectRepository.UserProjectExistsAsync(projectId, userId);

        if (!projectExists)
            return [];

        var tasks = await taskRepository.GetProjectTasksAsync(projectId);
        return mapper.Map<List<TaskDto>>(tasks);
    }

    public async Task<TaskDto?> GetTaskByIdAsync(int taskId, int projectId, int userId)
    {
        var task = await taskRepository.GetTaskWithProjectAsync(taskId, projectId, userId);

        if (task is null)
        {
            return null;
        }

        return mapper.Map<TaskDto>(task);
    }

    public async Task<TaskDto?> CreateTaskAsync(int projectId, CreateTaskRequest request, int userId)
    {
        var projectExists = await projectRepository.UserProjectExistsAsync(projectId, userId);

        if (!projectExists)
        {
            return null;
        }

        var task = mapper.Map<ProjectTask>(request);
        task.ProjectId = projectId;

        await taskRepository.AddAsync(task);
        await taskRepository.SaveChangesAsync();

        return mapper.Map<TaskDto>(task);
    }

    public async Task<TaskDto?> UpdateTaskAsync(int taskId, int projectId, UpdateTaskRequest request, int userId)
    {
        var task = await taskRepository.GetTaskWithProjectAsync(taskId, projectId, userId);

        if (task is null)
        {
            return null;
        }

        mapper.Map(request, task);
        await taskRepository.SaveChangesAsync();

        return mapper.Map<TaskDto>(task);
    }

    public async Task<TaskDto?> MarkTaskAsCompletedAsync(int taskId, int projectId, int userId)
    {
        var task = await taskRepository.GetTaskWithProjectAsync(taskId, projectId, userId);

        if (task is null)
        {
            return null;
        }

        task.IsCompleted = true;
        task.CompletedAt = DateTime.UtcNow;

        await taskRepository.SaveChangesAsync();

        return mapper.Map<TaskDto>(task);
    }

    public async Task<bool> DeleteTaskAsync(int taskId, int projectId, int userId)
    {
        var task = await taskRepository.GetTaskWithProjectAsync(taskId, projectId, userId);

        if (task is null)
        {
            return false;
        }

        taskRepository.Remove(task);
        await taskRepository.SaveChangesAsync();

        return true;
    }
}
