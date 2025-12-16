using Microsoft.EntityFrameworkCore;
using ProjectTasksManager.Models;

namespace ProjectTasksManager.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<ProjectTask> Tasks => Set<ProjectTask>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.Email).IsUnique();
            entity.Property(u => u.Email).HasMaxLength(255);
            entity.Property(u => u.Name).HasMaxLength(100);
            entity.Property(u => u.CreatedAt).HasDefaultValueSql("NOW()");
        });

        modelBuilder.Entity<Project>(entity =>
        {
            entity.Property(p => p.Title).HasMaxLength(200);
            entity.Property(p => p.Description).HasMaxLength(1000);

            entity.HasOne(p => p.User)
                  .WithMany(u => u.Projects)
                  .HasForeignKey(p => p.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ProjectTask>(entity =>
        {
            entity.Property(t => t.Title).HasMaxLength(200);
            entity.Property(t => t.Description).HasMaxLength(1000);

            entity.HasOne(t => t.Project)
                  .WithMany(p => p.Tasks)
                  .HasForeignKey(t => t.ProjectId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

    }

}
