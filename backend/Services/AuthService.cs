using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using Microsoft.IdentityModel.Tokens;
using ProjectTasksManager.DTOs;
using ProjectTasksManager.Models;
using ProjectTasksManager.Repositories;

namespace ProjectTasksManager.Services;

public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(LoginRequest request);
    Task<User?> GetUserByIdAsync(int userId);
}

public class JwtService(
    IUserRepository _userRepository,
    IMapper _mapper,
    IConfiguration _configuration) : IAuthService
{
    public async Task<LoginResponse?> LoginAsync(LoginRequest request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);

        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return null;
        }

        var token = GenerateJwtToken(user);

        return new LoginResponse(token, _mapper.Map<UserDto>(user));
    }

    public async Task<User?> GetUserByIdAsync(int userId)
    {
        return await _userRepository.GetByIdAsync(userId);
    }

    private string GenerateJwtToken(User user)
    {
        var key = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured");
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Name)
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
