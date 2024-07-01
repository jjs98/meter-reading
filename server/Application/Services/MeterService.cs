using Application.DTOs;
using Application.Interfaces;
using Domain.Interfaces;

namespace Application.Services;

public class MeterService : IMeterService
{
    private readonly IMeterRepository _meterRepository;

    public MeterService(IMeterRepository meterRepository)
    {
        _meterRepository = meterRepository;
    }

    public async Task<IEnumerable<MeterDto>> GetAll()
    {
        var meters = await _meterRepository.GetAll();

        return meters.Select(Mapper.MapMeterToMeterDto);
    }

    public async Task<MeterDto> GetById(int id)
    {
        var meter = await _meterRepository.GetById(id);
        return Mapper.MapMeterToMeterDto(meter);
    }

    public async Task<MeterDto> Create(MeterDto meterDto)
    {
        var meter = Mapper.MapMeterDtoToMeter(meterDto);
        meter.CreateDate = DateTime.UtcNow;
        meter.UpdateDate = null;
        var createdMeter = await _meterRepository.Create(meter);
        return Mapper.MapMeterToMeterDto(createdMeter);
    }

    public async Task Update(MeterDto meterDto)
    {
        var meter = Mapper.MapMeterDtoToMeter(meterDto);
        await _meterRepository.Update(meter);
    }

    public async Task Delete(int id)
    {
        await _meterRepository.Delete(id);
    }
}
