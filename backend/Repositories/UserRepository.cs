using Microsoft.EntityFrameworkCore;
using ProjectTasksManager.Data;
using ProjectTasksManager.Models;

namespace ProjectTasksManager.Repositories;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(int id);
    Task<User?> GetByEmailAsync(string email);
}

public class UserRepository(AppDbContext _context) : IUserRepository
{
    public async Task<User?> GetByIdAsync(int id)
    {
        return await _context.Users.FindAsync(id);
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
    }
}
