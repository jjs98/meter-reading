namespace Domain.Models;

public class Reading
{
    public int Id { get; set; }
    public int MeterId { get; set; }
    public required string Number { get; set; }
    public required DateTime ReadingDate { get; set; }
    public Meter? Meter { get; set; }
}
