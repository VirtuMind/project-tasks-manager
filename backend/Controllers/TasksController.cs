using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectTasksManager.DTOs;
using ProjectTasksManager.Services;

namespace ProjectTasksManager.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TasksController(ITaskService _taskService) : ControllerBase
{
    [HttpPost("{projectId}")]
    public async Task<ActionResult<TaskDto>> CreateTask(int projectId, [FromBody] CreateTaskRequest request)
    {
        int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        var task = await _taskService.CreateTaskAsync(projectId, request, userId);

        if (task is null)
            return NotFound(new ApiResponse("Project Not found", StatusCodes.Status404NotFound));

        return StatusCode(StatusCodes.Status201Created, task);
    }

    [HttpPut("{projectId}/{taskId}")]
    public async Task<ActionResult<TaskDto>> UpdateTask(int projectId, int taskId, [FromBody] UpdateTaskRequest request)
    {
        int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        var task = await _taskService.UpdateTaskAsync(taskId, projectId, request, userId);

        if (task is null)
            return NotFound("Task not found");

        return Ok(task);
    }

    [HttpPatch("{projectId}/{taskId}/toggle")]
    public async Task<ActionResult<TaskDto>> MarkTaskAsCompleted(int projectId, int taskId)
    {
        int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        var task = await _taskService.MarkTaskAsCompletedAsync(taskId, projectId, userId);

        if (task is null)
            return NotFound("Task not found");

        return Ok(task);
    }

    [HttpDelete("{projectId}/{taskId}")]
    public async Task<IActionResult> DeleteTask(int projectId, int taskId)
    {
        int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        var result = await _taskService.DeleteTaskAsync(taskId, projectId, userId);

        if (!result)
            return NotFound("Task not found");

        return Ok(new ApiResponse("Task Deleted Successfully", StatusCodes.Status200OK));
    }
}
