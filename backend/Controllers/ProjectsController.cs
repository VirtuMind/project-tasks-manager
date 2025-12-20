using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectTasksManager.DTOs;
using ProjectTasksManager.Services;

namespace ProjectTasksManager.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProjectsController(IProjectService _projectService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PaginatedResponse<ProjectDto>>> GetProjects([FromQuery] int page = 1, [FromQuery] int limit = 9)
    {
        if (page < 1) page = 1;
        if (limit < 1 || limit > 50) limit = 9;
        
        int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        var result = await _projectService.GetUserProjectsPaginatedAsync(userId, page, limit);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProjectDetailsDto>> GetProjectDetails(int id)
    {
        int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        var project = await _projectService.GetUserProjectDetailsByIdAsync(id, userId);

        if (project is null)
            return NotFound("Project not found");

        return Ok(project);
    }

    [HttpPost]
    public async Task<ActionResult<ProjectDto>> CreateProject([FromBody] CreateProjectRequest request)
    {
        int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        var result = await _projectService.CreateProjectAsync(request, userId);
        if (result is null)
            return BadRequest(new ApiResponse("Could not create project", StatusCodes.Status400BadRequest));

        return StatusCode(StatusCodes.Status201Created, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ProjectDto>> UpdateProject(int id, [FromBody] UpdateProjectRequest request)
    {
        int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        var project = await _projectService.UpdateProjectAsync(id, request, userId);

        if (project is null)
            return NotFound("Project not found");
        

        return Ok(project);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProject(int id)
    {
        int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        var result = await _projectService.DeleteProjectAsync(id, userId);

        if (!result)
            return NotFound("Project not found");

        return Ok(new ApiResponse("Project Deleted Successfully", StatusCodes.Status200OK));
    }

    [HttpGet("{id}/progress")]
    public async Task<ActionResult<ProjectProgressDto>> GetProjectProgress(int id)
    {
        int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        var progress = await _projectService.GetProjectProgressAsync(id, userId);

        if (progress is null)
            return NotFound("Project not found");

        return Ok(progress);
    }

}
