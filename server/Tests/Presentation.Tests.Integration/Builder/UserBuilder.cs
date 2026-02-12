using Infrastructure;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using static Presentation.Tests.Integration.WebApiFactory;

namespace Presentation.Tests.Integration.Builder;

public class UserBuilder(AppDbContext dbContext)
{
    private readonly List<UserEntity> _users = [];
    private readonly List<RoleEntity> _roles = [];
    private readonly List<UserRoleEntity> _userRoles = [];

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
        var user = new UserEntity
        {
            Username = username,
            Password = BCrypt.Net.BCrypt.HashPassword(password),
        };
        dbContext.Users.Add(user);
        _users.Add(user);

        foreach (var role in roles)
        {
            var roleEntity = GetOrCreateRole(role);
            var userRole = new UserRoleEntity { User = user, Role = roleEntity };
            dbContext.UserRoles.Add(userRole);
            _userRoles.Add(userRole);
        }

        return this;
    }

    private RoleEntity GetOrCreateRole(string roleName)
    {
        // First check the local context cache
        var localRole = dbContext.Roles.Local.FirstOrDefault(r => r.Name == roleName);
        if (localRole != null)
        {
            return localRole;
        }

        // Then check the database
        var existingRole = dbContext.Roles.AsNoTracking().FirstOrDefault(r => r.Name == roleName);
        if (existingRole != null)
        {
            // Attach it to the context
            dbContext.Roles.Attach(existingRole);
            return existingRole;
        }

        // Create new role
        var newRole = new RoleEntity { Name = roleName };
        dbContext.Roles.Add(newRole);
        _roles.Add(newRole);

        try
        {
            dbContext.SaveChanges();
        }
        catch (DbUpdateException)
        {
            // Role was created by another test, detach our entity and get the existing one
            dbContext.Entry(newRole).State = EntityState.Detached;
            _roles.Remove(newRole);
            var roleFromDb = dbContext.Roles.First(r => r.Name == roleName);
            return roleFromDb;
        }

        return newRole;
    }
}

public record UserData(
    List<UserEntity> Users,
    List<RoleEntity> Roles,
    List<UserRoleEntity> UserRoles
);
