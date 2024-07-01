﻿using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Migrations;

/// <inheritdoc />
public partial class Init : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "Meters",
            columns: table => new
            {
                Id = table
                    .Column<int>(type: "integer", nullable: false)
                    .Annotation(
                        "Npgsql:ValueGenerationStrategy",
                        NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                    ),
                Name = table.Column<string>(type: "text", nullable: false),
                Description = table.Column<string>(type: "text", nullable: true),
                Location = table.Column<string>(type: "text", nullable: true),
                UpdateDate = table.Column<DateTime>(
                    type: "timestamp with time zone",
                    nullable: false
                )
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Meters", x => x.Id);
            }
        );
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "Meters");
    }
}
