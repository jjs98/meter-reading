using Domain.Models;
using Infrastructure.Repositories.Interfaces;
using InterfaceGenerator;

namespace Application.Services;

[GenerateAutoInterface]
public class MeterService(
    IMeterRepository meterRepository,
    IReadingService readingService,
    ISharedMeterRepository sharedMeterRepository
) : IMeterService
{
    public async Task<IEnumerable<Meter>> GetAll()
    {
        return await meterRepository.GetAll();
    }

    public async Task<Meter> GetById(int id)
    {
        return await meterRepository.GetById(id);
    }

    public async Task<IEnumerable<Meter>> GetByUserId(int userId)
    {
        return await meterRepository.GetByUserId(userId);
    }

    public async Task<Meter> GetBy(int userId, int meterId)
    {
        return await meterRepository.GetBy(userId, meterId);
    }

    public async Task<IEnumerable<Meter>> GetShared(int userId)
    {
        var sharedMeters = await sharedMeterRepository.GetByUserId(userId);

        var meters = new List<Meter>();
        foreach (var sharedMeter in sharedMeters)
        {
            meters.Add(await meterRepository.GetById(sharedMeter.MeterId));
        }

        return meters;
    }

    public async Task<IEnumerable<SharedMeter>> GetSharedByMeterId(int meterId)
    {
        return await sharedMeterRepository.GetByMeterId(meterId);
    }

    public async Task<SharedMeter> ShareMeter(int userId, int meterId)
    {
        return await sharedMeterRepository.Create(
            new SharedMeter { UserId = userId, MeterId = meterId }
        );
    }

    public async Task RevokeMeter(int userId, int meterId)
    {
        await sharedMeterRepository.DeleteByUserId(userId, meterId);
    }

    public async Task<Meter> Create(Meter meter)
    {
        return await meterRepository.Create(meter);
    }

    public async Task Update(Meter meter)
    {
        await meterRepository.Update(meter);
    }

    public async Task Delete(int id)
    {
        await readingService.DeleteByMeterId(id);
        await sharedMeterRepository.DeleteByMeterId(id);
        await meterRepository.Delete(id);
    }
}
