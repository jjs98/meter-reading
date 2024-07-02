namespace Domain.Models;

public class Reading : DbEntity
{
    public required int MeterId { get; set; }
    public required string Number { get; set; }
    public required DateTime ReadingDate { get; set; }
}
