using Domain.Interfaces;
using Domain.Models;
using InterfaceGenerator;

namespace Application.Services;

[GenerateAutoInterface]
public class MeterService : IMeterService
{
    private readonly IMeterRepository _meterRepository;
    private readonly IReadingService _readingService;

    public MeterService(IMeterRepository meterRepository, IReadingService readingService)
    {
        _meterRepository = meterRepository;
        _readingService = readingService;
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
