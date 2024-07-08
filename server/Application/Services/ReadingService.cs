using Domain.Interfaces;
using Domain.Models;
using InterfaceGenerator;

namespace Application.Services;

[GenerateAutoInterface]
public class ReadingService : IReadingService
{
    private readonly IReadingRepository _readingRepository;
    private readonly IMeterService _meterService;

    public ReadingService(IReadingRepository readingRepository, IMeterService meterService)
    {
        _readingRepository = readingRepository;
        _meterService = meterService;
    }

    public async Task<IEnumerable<Reading>> GetAll()
    {
        return await _readingRepository.GetAll();
    }

    public async Task<Reading> GetById(int id)
    {
        return await _readingRepository.GetById(id);
    }

    public async Task<IEnumerable<Reading>> GetBy(int userId, int meterId)
    {
        var meter = await _meterService.GetBy(userId, meterId);
        return await _readingRepository.GetAllByMeterId(meter.Id);
    }

    public async Task<Reading> Create(Reading reading)
    {
        return await _readingRepository.Create(reading);
    }

    public async Task Update(Reading reading)
    {
        await _readingRepository.Update(reading);
    }

    public async Task Delete(int id)
    {
        await _readingRepository.Delete(id);
    }
}
