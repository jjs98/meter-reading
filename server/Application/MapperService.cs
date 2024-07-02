using Application.DTOs;
using Domain.Models;

namespace Application;

public static class Mapper
{
    public static Meter MapMeterDtoToMeter(MeterDto meterDto)
    {
        return new Meter
        {
            Id = meterDto.Id,
            UserId = -1,
            Location = meterDto.Location,
            MeterNumber = meterDto.MeterNumber,
            Type = meterDto.Type,
            Comment = meterDto.Comment,
            CreateDate = DateTime.UtcNow,
            UpdateDate = null
        };
    }

    public static MeterDto MapMeterToMeterDto(Meter meter)
    {
        return new MeterDto
        {
            Id = meter.Id,
            Location = meter.Location,
            MeterNumber = meter.MeterNumber,
            Type = meter.Type,
            Comment = meter.Comment
        };
    }
}
