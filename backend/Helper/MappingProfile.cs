using AutoMapper;
using ProjectTasksManager.DTOs;
using ProjectTasksManager.Models;

namespace ProjectTasksManager.Helper;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<User, UserDto>();

        CreateMap<Project, ProjectDto>()
            .ForMember(dest => dest.Stats, opt => opt.MapFrom(src => new ProjectProgressDto
            {
                TotalTasks = src.Tasks.Count,
                CompletedTasks = src.Tasks.Count(t => t.IsCompleted),
                ProgressPercentage = src.Tasks.Count > 0
                    ? Math.Round((double)src.Tasks.Count(t => t.IsCompleted) / src.Tasks.Count * 100, 2)
                    : 0
            }));

        CreateMap<Project, ProjectDetailsDto>()
            .IncludeBase<Project, ProjectDto>()
            .ForMember(dest => dest.Tasks, opt => opt.MapFrom(src => src.Tasks));

        CreateMap<CreateProjectRequest, Project>();
        CreateMap<UpdateProjectRequest, Project>();

        CreateMap<ProjectTask, TaskDto>();
        CreateMap<CreateTaskRequest, ProjectTask>();
        CreateMap<UpdateTaskRequest, ProjectTask>();
    }
}
