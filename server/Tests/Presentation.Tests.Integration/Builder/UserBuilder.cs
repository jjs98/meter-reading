using Domain.Models;
using Infrastructure;
using static Presentation.Tests.Integration.WebApiFactory;

namespace Presentation.Tests.Integration.Builder;

public class UserBuilder(AppDbContext dbContext)
{
    private readonly List<User> _users = [];
    private readonly List<Role> _roles = [];
    private readonly List<UserRole> _userRoles = [];

    public UserData Result()
    {
        return new UserData(_users, _roles, _userRoles);
    }

    public UserData Build()
    {
        try
        {
            dbContext.SaveChanges();
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            throw new Exception(
                "Error saving changes to the database. See inner exception for details.",
                ex.InnerException
            );
        }
        return Result();
    }

    public UserBuilder WithUser(TestUser testUser) =>
        WithUser(testUser.Username, testUser.Password, testUser.Role);

    public UserBuilder WithUser(string username, string password, string role) =>
        WithUser(username, password, [role]);

    public UserBuilder WithUser(string username, string password, string[] roles)
    {
        var user = new User
        {
            Username = username,
            Password = BCrypt.Net.BCrypt.HashPassword(password),
        };
        dbContext.Users.Add(user);
        _users.Add(user);

        foreach (var role in roles)
        {
            var roleEntity = new Role { Name = role };
            var userRole = new UserRole { User = user, Role = roleEntity };
            dbContext.Roles.Add(roleEntity);
            dbContext.UserRoles.Add(userRole);
            _roles.Add(roleEntity);
            _userRoles.Add(userRole);
        }

        return this;
    }
}

public record UserData(List<User> Users, List<Role> Roles, List<UserRole> UserRoles);
