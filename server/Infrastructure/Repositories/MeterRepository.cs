using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class MeterRepository : IMeterRepository
{
    private readonly AppDbContext _context;

    public MeterRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Meter>> GetAll()
    {
        return await _context.Meters.AsNoTracking().ToListAsync();
    }

    public async Task<Meter> GetById(int id)
    {
        var meter = await _context.Meters.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        if (meter is null)
            throw new EntityNotFoundException($"Meter for id {id} not found");

        return meter;
    }

    public async Task<Meter> Create(Meter meter)
    {
        var result = await _context.Meters.AddAsync(meter);
        await _context.SaveChangesAsync();
        return result.Entity;
    }

    public async Task Update(Meter meter)
    {
        var existingMeter = await GetByIdWithTracking(meter.Id);

        await _context
            .Meters.Where(x => x.Id == meter.Id)
            .ExecuteUpdateAsync(x =>
                x.SetProperty(m => m.Owner, meter.Owner)
                    .SetProperty(m => m.Location, meter.Location)
                    .SetProperty(m => m.Type, meter.Type)
                    .SetProperty(m => m.MeterNumber, meter.MeterNumber)
                    .SetProperty(m => m.Comment, meter.Comment)
                    .SetProperty(m => m.UpdateDate, DateTime.UtcNow)
            );

        _context.ChangeTracker.Clear();
    }

    public async Task Delete(int id)
    {
        var existingMeter = await GetByIdWithTracking(id);

        _context.Meters.Remove(existingMeter);
        await _context.SaveChangesAsync();
    }

    private async Task<Meter> GetByIdWithTracking(int id)
    {
        var meter = await _context.Meters.FindAsync(id);
        if (meter is null)
            throw new EntityNotFoundException($"Meter for id {id} not found");

        return meter;
    }
}
