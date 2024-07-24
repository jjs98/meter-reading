using Domain.Interfaces;
using Domain.Models;
using InterfaceGenerator;

namespace Application.Services;

[GenerateAutoInterface]
public class MeterService : IMeterService
{
    private readonly IMeterRepository _meterRepository;
    private readonly IReadingService _readingService;
    private readonly ISharedMeterRepository _sharedMeterRepository;

    public MeterService(
        IMeterRepository meterRepository,
        IReadingService readingService,
        ISharedMeterRepository sharedMeterRepository
    )
    {
        _meterRepository = meterRepository;
        _readingService = readingService;
        _sharedMeterRepository = sharedMeterRepository;
    }

    public async Task<IEnumerable<Meter>> GetAll()
    {
        return await _meterRepository.GetAll();
    }

    public async Task<Meter> GetById(int id)
    {
        return await _meterRepository.GetById(id);
    }

    public async Task<IEnumerable<Meter>> GetByUserId(int userId)
    {
        return await _meterRepository.GetByUserId(userId);
    }

    public async Task<Meter> GetBy(int userId, int meterId)
    {
        return await _meterRepository.GetBy(userId, meterId);
    }

    public async Task<IEnumerable<Meter>> GetShared(int userId)
    {
        var sharedMeters = await _sharedMeterRepository.GetByUserId(userId);

        var meters = new List<Meter>();
        foreach (var sharedMeter in sharedMeters)
        {
            meters.Add(await _meterRepository.GetById(sharedMeter.MeterId));
        }

        return meters;
    }

    public async Task<Meter> Create(Meter meter)
    {
        return await _meterRepository.Create(meter);
    }

    public async Task Update(Meter meter)
    {
        await _meterRepository.Update(meter);
    }

    public async Task Delete(int id)
    {
        await _readingService.DeleteByMeterId(id);
        await _meterRepository.Delete(id);
    }
}
