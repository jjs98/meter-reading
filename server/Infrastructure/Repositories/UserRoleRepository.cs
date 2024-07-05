using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Models;
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
        var context = _contextFactory.CreateDbContext();
        return await context.UserRoles.AsNoTracking().Where(x => x.UserId == userId).ToListAsync();
    }

    public async Task<IEnumerable<UserRole>> GetByRoleId(int roleId)
    {
        var context = _contextFactory.CreateDbContext();
        return await context.UserRoles.AsNoTracking().Where(x => x.RoleId == roleId).ToListAsync();
    }

    public async Task<UserRole> Create(UserRole userRole)
    {
        var context = _contextFactory.CreateDbContext();
        userRole.UpdateDate = null;
        userRole.CreateDate = DateTime.UtcNow;
        var result = await context.UserRoles.AddAsync(userRole);
        await context.SaveChangesAsync();
        return result.Entity;
    }

    public async Task Update(UserRole userRole)
    {
        var context = _contextFactory.CreateDbContext();
        var existingUserRole = await GetByIdWithTracking(userRole.Id);

        await context
            .UserRoles.Where(x => x.Id == userRole.Id)
            .ExecuteUpdateAsync(x =>
                x.SetProperty(ur => ur.RoleId, userRole.RoleId)
                    .SetProperty(ur => ur.UserId, userRole.UserId)
                    .SetProperty(ur => ur.UpdateDate, DateTime.UtcNow)
            );

        context.ChangeTracker.Clear();
    }

    public async Task Delete(int id)
    {
        var context = _contextFactory.CreateDbContext();
        var existingUserRole = await GetByIdWithTracking(id);

        context.UserRoles.Remove(existingUserRole);
        await context.SaveChangesAsync();
    }

    private async Task<UserRole> GetByIdWithTracking(int id)
    {
        var context = _contextFactory.CreateDbContext();
        var userRole = await context.UserRoles.FindAsync(id);
        if (userRole is null)
            throw new EntityNotFoundException($"UserRole for id {id} not found");

        return userRole;
    }
}
