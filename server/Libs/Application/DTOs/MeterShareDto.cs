namespace Application.DTOs;

public class MeterShareDto
{
    public required int MeterId { get; set; }
    public int UserId { get; set; }
    public required string Username { get; set; }
}
