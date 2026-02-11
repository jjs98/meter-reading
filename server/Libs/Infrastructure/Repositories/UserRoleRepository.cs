using Domain.Models;
using Infrastructure.Entities;
using Infrastructure.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class UserRoleRepository : IUserRoleRepository
{
    private readonly IDbContextFactory<AppDbContext> _contextFactory;

    public UserRoleRepository(IDbContextFactory<AppDbContext> contextFactory)
    {
        _contextFactory = contextFactory;
    }

    public async Task<IEnumerable<UserRole>> GetByUserId(int userId)
    {
        using var context = _contextFactory.CreateDbContext();
        var userRoles = await context
            .UserRoles.AsNoTracking()
            .Where(x => x.UserId == userId)
            .ToListAsync();
        return userRoles.Select(x => x.ToDomainModel());
    }

    public async Task<IEnumerable<UserRole>> GetByRoleId(int roleId)
    {
        using var context = _contextFactory.CreateDbContext();
        var userRoles = await context
            .UserRoles.AsNoTracking()
            .Where(x => x.RoleId == roleId)
            .ToListAsync();
        return userRoles.Select(x => x.ToDomainModel());
    }

    public async Task<UserRole> Create(UserRole userRole)
    {
        using var context = _contextFactory.CreateDbContext();
        var userRoleEntity = UserRoleEntity.FromDomainModel(userRole);
        var result = await context.UserRoles.AddAsync(userRoleEntity);
        await context.SaveChangesAsync();
        return result.Entity.ToDomainModel();
    }

    public async Task Delete(UserRole userRole)
    {
        using var context = _contextFactory.CreateDbContext();
        await context
            .UserRoles.Where(x => x.UserId == userRole.UserId && x.RoleId == userRole.RoleId)
            .ExecuteDeleteAsync();
    }
}
