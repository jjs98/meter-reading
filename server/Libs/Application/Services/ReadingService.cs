using Domain.Models;
using Infrastructure.Repositories.Interfaces;
using InterfaceGenerator;

namespace Application.Services;

[GenerateAutoInterface]
public class ReadingService(IReadingRepository readingRepository) : IReadingService
{
    public async Task<IEnumerable<Reading>> GetAll()
    {
        return await readingRepository.GetAll();
    }

    public async Task<Reading> GetById(int id)
    {
        return await readingRepository.GetById(id);
    }

    public async Task<IEnumerable<Reading>> GetByMeterId(int meterId)
    {
        return await readingRepository.GetAllByMeterId(meterId);
    }

    public async Task<Reading> Create(Reading reading)
    {
        return await readingRepository.Create(reading);
    }

    public async Task Update(Reading reading)
    {
        await readingRepository.Update(reading);
    }

    public async Task DeleteByMeterId(int meterId)
    {
        await readingRepository.DeleteByMeterId(meterId);
    }

    public async Task Delete(int id)
    {
        await readingRepository.Delete(id);
    }
}
