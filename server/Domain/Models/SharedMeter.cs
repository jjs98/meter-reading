namespace Domain.Models;

public class SharedMeter : DbEntity
{
    public required int MeterId { get; set; }
    public required int UserId { get; set; }
}
