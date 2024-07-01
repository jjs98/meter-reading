using Application.DTOs;

namespace Application.Interfaces;

public interface IMeterService
{
    Task<IEnumerable<MeterDto>> GetAll();
    Task<MeterDto> GetById(int id);
    Task<MeterDto> Create(MeterDto meter);
    Task Update(MeterDto meter);
    Task Delete(int id);
}
