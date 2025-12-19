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
    ITaskRepository _taskRepository,
    IProjectRepository _projectRepository,
    IMapper _mapper) : ITaskService
{
    public async Task<List<TaskDto>> GetProjectTasksAsync(int projectId, int userId)
    {
        var projectExists = await _projectRepository.UserProjectExistsAsync(projectId, userId);

        if (!projectExists)
            return [];

        var tasks = await _taskRepository.GetProjectTasksAsync(projectId);
        return _mapper.Map<List<TaskDto>>(tasks);
    }

    public async Task<TaskDto?> GetTaskByIdAsync(int taskId, int projectId, int userId)
    {
        var task = await _taskRepository.GetTaskWithProjectAsync(taskId, projectId, userId);

        if (task is null)
        {
            return null;
        }

        return _mapper.Map<TaskDto>(task);
    }

    public async Task<TaskDto?> CreateTaskAsync(int projectId, CreateTaskRequest request, int userId)
    {
        if (!await _projectRepository.UserProjectExistsAsync(projectId, userId))
            return null;

        var task = _mapper.Map<ProjectTask>(request);
        task.ProjectId = projectId;

        await _taskRepository.AddAsync(task);
        await _taskRepository.SaveChangesAsync();

        return _mapper.Map<TaskDto>(task);
    }


    public async Task<TaskDto?> UpdateTaskAsync(int taskId, int projectId, UpdateTaskRequest request, int userId)
    {
        ProjectTask? task = await _taskRepository.GetTaskWithProjectAsync(taskId, projectId, userId);

        if (task is null)
            return null;

        _mapper.Map(request, task);
        await _taskRepository.SaveChangesAsync();

        return _mapper.Map<TaskDto>(task);
    }

    public async Task<TaskDto?> MarkTaskAsCompletedAsync(int taskId, int projectId, int userId)
    {
        var task = await _taskRepository.GetTaskWithProjectAsync(taskId, projectId, userId);

        if (task is null)
            return null;

        task.IsCompleted = !task.IsCompleted;
        task.CompletedAt = DateTime.UtcNow;

        await _taskRepository.SaveChangesAsync();

        return _mapper.Map<TaskDto>(task);
    }

    public async Task<bool> DeleteTaskAsync(int taskId, int projectId, int userId)
    {
        var task = await _taskRepository.GetTaskWithProjectAsync(taskId, projectId, userId);

        if (task is null)
            return false;

        _taskRepository.Remove(task);
        await _taskRepository.SaveChangesAsync();

        return true;
    }
}
