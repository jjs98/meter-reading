﻿namespace Domain.Models;

public class UserRole : DbEntity
{
    public required int RoleId { get; set; }
    public required int UserId { get; set; }
}
