using Domain.Models;
using Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace WebApi.Tests.Integration;

public class DataBuilder
{
    private readonly List<User> _users = [];
    private readonly List<Meter> _meters = [];
    private readonly AppDbContext _dbContext;

    public DataBuilder(TestDatabase database)
    {
        _dbContext = new AppDbContext(
            new DbContextOptionsBuilder<AppDbContext>()
                .UseNpgsql(database.DbContainer.GetConnectionString())
                .Options
        );
    }

    public Data Build()
    {
        return new Data(_users, _meters);
    }

    public DataBuilder WithTestUser(string username, string password, string userRole)
    {
        var role = _dbContext.Roles.FirstOrDefault(r => r.Name == userRole);
        if (role == null)
        {
            role = new Role { Name = userRole };
            _dbContext.Roles.Add(role);
            _dbContext.SaveChanges();
        }

        var user = new User
        {
            Username = username,
            Password = BCrypt.Net.BCrypt.HashPassword(password),
        };
        _dbContext.Users.Add(user);
        _dbContext.SaveChanges();

        var userRoleEntity = _dbContext.UserRoles.FirstOrDefault(ur =>
            ur.UserId == user.Id && ur.RoleId == role.Id
        );
        if (userRoleEntity != null)
        {
            userRoleEntity = new UserRole { UserId = user.Id, RoleId = role.Id };
            _dbContext.UserRoles.Add(userRoleEntity);
            _dbContext.SaveChanges();
        }

        _users.Add(user);

        return this;
    }
}

public record Data(List<User> Users, List<Meter> Meters);
