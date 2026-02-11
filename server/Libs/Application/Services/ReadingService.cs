using Domain.Interfaces;
using Domain.Models;
using InterfaceGenerator;

namespace Application.Services;

[GenerateAutoInterface]
public class ReadingService : IReadingService
{
    private readonly IReadingRepository _readingRepository;

    public ReadingService(IReadingRepository readingRepository)
    {
        _readingRepository = readingRepository;
    }

    public async Task<IEnumerable<Reading>> GetAll()
    {
        return await _readingRepository.GetAll();
    }

    public async Task<Reading> GetById(int id)
    {
        return await _readingRepository.GetById(id);
    }

    public async Task<IEnumerable<Reading>> GetByMeterId(int meterId)
    {
        return await _readingRepository.GetAllByMeterId(meterId);
    }

    public async Task<Reading> Create(Reading reading)
    {
        return await _readingRepository.Create(reading);
    }

    public async Task Update(Reading reading)
    {
        await _readingRepository.Update(reading);
    }

    public async Task DeleteByMeterId(int meterId)
    {
        await _readingRepository.DeleteByMeterId(meterId);
    }

    public async Task Delete(int id)
    {
        await _readingRepository.Delete(id);
    }
}
