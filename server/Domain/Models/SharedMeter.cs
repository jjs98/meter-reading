namespace Domain.Models;

public class SharedMeter
{
    public int MeterId { get; set; }
    public int UserId { get; set; }

    public Meter? Meter { get; set; }
    public User? User { get; set; }
}
