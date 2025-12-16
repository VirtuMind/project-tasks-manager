using System.ComponentModel.DataAnnotations;

namespace ProjectTasksManager.DTOs;

public record LoginRequest(
    [Required, EmailAddress] string Email,
    [Required, MinLength(8)] string Password
);

public record LoginResponse(
    string Token,
    UserDto User
);

public record UserDto(
    int Id,
    string Email,
    string Name
);
