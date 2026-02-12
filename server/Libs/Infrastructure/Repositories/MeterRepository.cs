using Domain.Exceptions;
using Domain.Models;
using Infrastructure.Entities;
using Infrastructure.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class MeterRepository : IMeterRepository
{
    private readonly IDbContextFactory<AppDbContext> _contextFactory;

    public MeterRepository(IDbContextFactory<AppDbContext> contextFactory)
    {
        _contextFactory = contextFactory;
    }

    public async Task<IEnumerable<Meter>> GetAll()
    {
        using var context = _contextFactory.CreateDbContext();
        var meters = await context.Meters.AsNoTracking().ToListAsync();
        return meters.Select(m => m.ToDomainModel());
    }

    public async Task<Meter> GetById(int id)
    {
        using var context = _contextFactory.CreateDbContext();
        var meter = await context.Meters.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        if (meter is null)
            throw new EntityNotFoundException($"Meter for id {id} not found");

        return meter.ToDomainModel();
    }

    public async Task<IEnumerable<Meter>> GetByUserId(int userId)
    {
        using var context = _contextFactory.CreateDbContext();
        var meter = await context
            .Meters.AsNoTracking()
            .Where(x => x.UserId == userId)
            .ToListAsync();

        return meter.Select(m => m.ToDomainModel());
    }

    public async Task<Meter> GetBy(int userId, int meterId)
    {
        using var context = _contextFactory.CreateDbContext();
        var meter = await context
            .Meters.AsNoTracking()
            .Where(x => x.UserId == userId)
            .FirstOrDefaultAsync(x => x.Id == meterId);
        if (meter is null)
            throw new EntityNotFoundException(
                $"Meter for user id {userId} and meter id {meterId} not found"
            );

        return meter.ToDomainModel();
    }

    public async Task<Meter> Create(Meter meter)
    {
        using var context = _contextFactory.CreateDbContext();
        var meterEntity = MeterEntity.FromDomainModel(meter);
        var result = await context.Meters.AddAsync(meterEntity);
        await context.SaveChangesAsync();
        return result.Entity.ToDomainModel();
    }

    public async Task Update(Meter meter)
    {
        using var context = _contextFactory.CreateDbContext();
        var existingMeter = await GetByIdWithTracking(meter.Id);

        await context
            .Meters.Where(x => x.Id == meter.Id)
            .ExecuteUpdateAsync(x =>
                x.SetProperty(m => m.Location, meter.Location)
                    .SetProperty(m => m.Type, meter.Type)
                    .SetProperty(m => m.MeterNumber, meter.MeterNumber)
                    .SetProperty(m => m.Addition, meter.Addition)
            );

        context.ChangeTracker.Clear();
    }

    public async Task DeleteByUserId(int userId)
    {
        using var context = _contextFactory.CreateDbContext();
        var meter = await context.Meters.Where(x => x.UserId == userId).ToArrayAsync();

        context.Meters.RemoveRange(meter);
        await context.SaveChangesAsync();
    }

    public async Task Delete(int id)
    {
        using var context = _contextFactory.CreateDbContext();
        var existingMeter = await GetByIdWithTracking(id);

        context.Meters.Remove(existingMeter);
        await context.SaveChangesAsync();
    }

    private async Task<MeterEntity> GetByIdWithTracking(int id)
    {
        using var context = _contextFactory.CreateDbContext();
        var meter = await context.Meters.FindAsync(id);
        if (meter is null)
            throw new EntityNotFoundException($"Meter for id {id} not found");

        return meter;
    }
}
