namespace Domain.Models;

public class SharedMeter : DbEntity
{
    public required int MeterId { get; set; }
    public required int UserId { get; set; }

    public Meter? Meter { get; set; }
    public User? User { get; set; }
}
