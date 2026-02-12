using Domain.Exceptions;
using Domain.Models;
using Infrastructure.Entities;
using Infrastructure.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class ReadingRepository : IReadingRepository
{
    private readonly IDbContextFactory<AppDbContext> _contextFactory;

    public ReadingRepository(IDbContextFactory<AppDbContext> contextFactory)
    {
        _contextFactory = contextFactory;
    }

    public async Task<IEnumerable<Reading>> GetAll()
    {
        using var context = _contextFactory.CreateDbContext();
        var readings = await context
            .Readings.AsNoTracking()
            .OrderByDescending(x => x.ReadingDate)
            .ToListAsync();

        return readings.Select(x => x.ToDomainModel());
    }

    public async Task<Reading> GetById(int id)
    {
        using var context = _contextFactory.CreateDbContext();
        var reading = await context.Readings.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        if (reading is null)
            throw new EntityNotFoundException($"Reading for id {id} not found");

        return reading.ToDomainModel();
    }

    public async Task<IEnumerable<Reading>> GetAllByMeterId(int meterId)
    {
        using var context = _contextFactory.CreateDbContext();
        var readings = await context
            .Readings.AsNoTracking()
            .Where(x => x.MeterId == meterId)
            .OrderByDescending(x => x.ReadingDate)
            .ToListAsync();
        return readings.Select(x => x.ToDomainModel());
    }

    public async Task<Reading> Create(Reading reading)
    {
        using var context = _contextFactory.CreateDbContext();
        var readingEntity = ReadingEntity.FromDomainModel(reading);
        var result = await context.Readings.AddAsync(readingEntity);
        await context.SaveChangesAsync();
        return result.Entity.ToDomainModel();
    }

    public async Task Update(Reading reading)
    {
        using var context = _contextFactory.CreateDbContext();
        var existingReading = await GetByIdWithTracking(reading.Id);

        await context
            .Readings.Where(x => x.Id == reading.Id)
            .ExecuteUpdateAsync(x =>
                x.SetProperty(r => r.MeterId, reading.MeterId)
                    .SetProperty(r => r.Number, reading.Number)
                    .SetProperty(r => r.ReadingDate, reading.ReadingDate)
            );

        context.ChangeTracker.Clear();
    }

    public async Task DeleteByMeterId(int meterId)
    {
        using var context = _contextFactory.CreateDbContext();
        var readings = await context.Readings.Where(x => x.MeterId == meterId).ToArrayAsync();
        context.Readings.RemoveRange(readings);
        await context.SaveChangesAsync();
    }

    public async Task Delete(int id)
    {
        using var context = _contextFactory.CreateDbContext();
        var existingReading = await GetByIdWithTracking(id);

        context.Readings.Remove(existingReading);
        await context.SaveChangesAsync();
    }

    private async Task<ReadingEntity> GetByIdWithTracking(int id)
    {
        using var context = _contextFactory.CreateDbContext();
        var reading = await context.Readings.FindAsync(id);
        if (reading is null)
            throw new EntityNotFoundException($"Reading for id {id} not found");

        return reading;
    }
}
