var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
    if (!dbContext.Users.Any())
    {
        var users = new[]
        {
            new User
            {
                Email = "younes@example.com",
                Name = "Younes Khoubaz",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("younes123"),
            },
            new User
            {
                Email = "hamid@example.com",
                Name = "Hamid Kherbach",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("hamid123"),
            },
            new User
            {
                Email = "houria@example.com",
                Name = "Houria Jaabouqi",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("houria123"),
            }
        };

        dbContext.Users.AddRange(users);
        dbContext.SaveChanges();
    }
}

app.Run();
