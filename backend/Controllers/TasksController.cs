using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectTasksManager.DTOs;
using ProjectTasksManager.Services;

namespace ProjectTasksManager.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TasksController(ITaskService taskService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<TaskDto>>> GetTasks(int projectId)
    {
        int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        var tasks = await taskService.GetProjectTasksAsync(projectId, userId);
        return Ok(tasks);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TaskDto>> GetTask(int projectId, int id)
    {
        int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        var task = await taskService.GetTaskByIdAsync(id, projectId, userId);

        if (task is null)
            return NotFound("Task not found");

        return Ok(task);
    }

    [HttpPost]
    public async Task<ActionResult<TaskDto>> CreateTask(int projectId, [FromBody] CreateTaskRequest request)
    {
        int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        var task = await taskService.CreateTaskAsync(projectId, request, userId);

        if (task is null)
            return NotFound("Project not found");

        return CreatedAtAction(nameof(GetTask), new { projectId, id = task.Id }, task);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TaskDto>> UpdateTask(int projectId, int id, [FromBody] UpdateTaskRequest request)
    {
        int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        var task = await taskService.UpdateTaskAsync(id, projectId, request, userId);

        if (task is null)
            return NotFound("Task not found");

        return Ok(task);
    }

    [HttpPatch("{id}/complete")]
    public async Task<ActionResult<TaskDto>> MarkTaskAsCompleted(int projectId, int id)
    {
        int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        var task = await taskService.MarkTaskAsCompletedAsync(id, projectId, userId);

        if (task is null)
            return NotFound("Task not found");

        return Ok(task);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int projectId, int id)
    {
        int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        var result = await taskService.DeleteTaskAsync(id, projectId, userId);

        if (!result)
            return NotFound("Task not found");

        return NoContent();
    }
}
