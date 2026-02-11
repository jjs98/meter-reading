using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Models;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class SharedMeterRepository : ISharedMeterRepository
{
    private readonly IDbContextFactory<AppDbContext> _contextFactory;

    public SharedMeterRepository(IDbContextFactory<AppDbContext> contextFactory)
    {
        _contextFactory = contextFactory;
    }

    public async Task<IEnumerable<SharedMeter>> GetAll()
    {
        using var context = _contextFactory.CreateDbContext();
        var sharedMeters = await context.SharedMeters.AsNoTracking().ToListAsync();
        return sharedMeters.Select(x => x.ToDomainModel());
    }

    public async Task<IEnumerable<SharedMeter>> GetByUserId(int userId)
    {
        using var context = _contextFactory.CreateDbContext();
        var sharedMeters = await context
            .SharedMeters.AsNoTracking()
            .Where(x => x.UserId == userId)
            .ToListAsync();

        return sharedMeters.Select(x => x.ToDomainModel());
    }

    public async Task<IEnumerable<SharedMeter>> GetByMeterId(int meterId)
    {
        using var context = _contextFactory.CreateDbContext();
        var sharedMeters = await context
            .SharedMeters.AsNoTracking()
            .Where(x => x.MeterId == meterId)
            .ToListAsync();

        return sharedMeters.Select(x => x.ToDomainModel());
    }

    public async Task<SharedMeter> GetBy(int userId, int meterId)
    {
        using var context = _contextFactory.CreateDbContext();
        var sharedMeter = await context
            .SharedMeters.AsNoTracking()
            .Where(x => x.UserId == userId)
            .FirstOrDefaultAsync(x => x.MeterId == meterId);
        if (sharedMeter is null)
            throw new EntityNotFoundException(
                $"Shared Meter for user id {userId} and meter id {meterId} not found"
            );

        return sharedMeter.ToDomainModel();
    }

    public async Task<SharedMeter> Create(SharedMeter meter)
    {
        using var context = _contextFactory.CreateDbContext();
        var meterEntity = SharedMeterEntity.FromDomainModel(meter);
        var result = await context.SharedMeters.AddAsync(meterEntity);
        await context.SaveChangesAsync();
        return result.Entity.ToDomainModel();
    }

    public async Task DeleteByUserId(int userId, int meterId)
    {
        using var context = _contextFactory.CreateDbContext();
        var sharedMeter = await context
            .SharedMeters.Where(x => x.UserId == userId && x.MeterId == meterId)
            .ToArrayAsync();

        context.SharedMeters.RemoveRange(sharedMeter);
        await context.SaveChangesAsync();
    }

    public async Task DeleteByMeterId(int meterId)
    {
        using var context = _contextFactory.CreateDbContext();
        var sharedMeter = await context
            .SharedMeters.Where(x => x.MeterId == meterId)
            .ToArrayAsync();

        context.SharedMeters.RemoveRange(sharedMeter);
        await context.SaveChangesAsync();
    }

    public async Task Delete(int id)
    {
        using var context = _contextFactory.CreateDbContext();
        var sharedMeter = await GetByIdWithTracking(id);
        context.SharedMeters.Remove(sharedMeter);
        await context.SaveChangesAsync();
    }

    private async Task<SharedMeterEntity> GetByIdWithTracking(int id)
    {
        using var context = _contextFactory.CreateDbContext();
        var sharedMeter = await context.SharedMeters.FindAsync(id);
        if (sharedMeter is null)
            throw new EntityNotFoundException($"Shared Meter for id {id} not found");

        return sharedMeter;
    }
}
