namespace Core.Models;

public class Meter
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Location { get; set; }
    public DateTime ChangeDate { get; set; }
}
