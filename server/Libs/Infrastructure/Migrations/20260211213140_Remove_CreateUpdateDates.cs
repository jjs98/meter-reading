using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Migrations;

/// <inheritdoc />
public partial class Remove_CreateUpdateDates : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropPrimaryKey(name: "PK_SharedMeters", table: "SharedMeters");

        migrationBuilder.DropColumn(name: "CreateDate", table: "Users");

        migrationBuilder.DropColumn(name: "UpdateDate", table: "Users");

        migrationBuilder.DropColumn(name: "CreateDate", table: "UserRoles");

        migrationBuilder.DropColumn(name: "Id", table: "UserRoles");

        migrationBuilder.DropColumn(name: "UpdateDate", table: "UserRoles");

        migrationBuilder.DropColumn(name: "Id", table: "SharedMeters");

        migrationBuilder.DropColumn(name: "CreateDate", table: "SharedMeters");

        migrationBuilder.DropColumn(name: "UpdateDate", table: "SharedMeters");

        migrationBuilder.DropColumn(name: "CreateDate", table: "Roles");

        migrationBuilder.DropColumn(name: "UpdateDate", table: "Roles");

        migrationBuilder.DropColumn(name: "CreateDate", table: "Readings");

        migrationBuilder.DropColumn(name: "UpdateDate", table: "Readings");

        migrationBuilder.DropColumn(name: "CreateDate", table: "Meters");

        migrationBuilder.DropColumn(name: "UpdateDate", table: "Meters");

        migrationBuilder.AddPrimaryKey(
            name: "PK_SharedMeters",
            table: "SharedMeters",
            columns: ["MeterId", "UserId"]
        );
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropPrimaryKey(name: "PK_SharedMeters", table: "SharedMeters");

        migrationBuilder.AddColumn<DateTime>(
            name: "CreateDate",
            table: "Users",
            type: "timestamp with time zone",
            nullable: false,
            defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified)
        );

        migrationBuilder.AddColumn<DateTime>(
            name: "UpdateDate",
            table: "Users",
            type: "timestamp with time zone",
            nullable: true
        );

        migrationBuilder.AddColumn<DateTime>(
            name: "CreateDate",
            table: "UserRoles",
            type: "timestamp with time zone",
            nullable: false,
            defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified)
        );

        migrationBuilder
            .AddColumn<int>(
                name: "Id",
                table: "UserRoles",
                type: "integer",
                nullable: false,
                defaultValue: 0
            )
            .Annotation(
                "Npgsql:ValueGenerationStrategy",
                NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
            );

        migrationBuilder.AddColumn<DateTime>(
            name: "UpdateDate",
            table: "UserRoles",
            type: "timestamp with time zone",
            nullable: true
        );

        migrationBuilder
            .AddColumn<int>(
                name: "Id",
                table: "SharedMeters",
                type: "integer",
                nullable: false,
                defaultValue: 0
            )
            .Annotation(
                "Npgsql:ValueGenerationStrategy",
                NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
            );

        migrationBuilder.AddColumn<DateTime>(
            name: "CreateDate",
            table: "SharedMeters",
            type: "timestamp with time zone",
            nullable: false,
            defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified)
        );

        migrationBuilder.AddColumn<DateTime>(
            name: "UpdateDate",
            table: "SharedMeters",
            type: "timestamp with time zone",
            nullable: true
        );

        migrationBuilder.AddColumn<DateTime>(
            name: "CreateDate",
            table: "Roles",
            type: "timestamp with time zone",
            nullable: false,
            defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified)
        );

        migrationBuilder.AddColumn<DateTime>(
            name: "UpdateDate",
            table: "Roles",
            type: "timestamp with time zone",
            nullable: true
        );

        migrationBuilder.AddColumn<DateTime>(
            name: "CreateDate",
            table: "Readings",
            type: "timestamp with time zone",
            nullable: false,
            defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified)
        );

        migrationBuilder.AddColumn<DateTime>(
            name: "UpdateDate",
            table: "Readings",
            type: "timestamp with time zone",
            nullable: true
        );

        migrationBuilder.AddColumn<DateTime>(
            name: "CreateDate",
            table: "Meters",
            type: "timestamp with time zone",
            nullable: false,
            defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified)
        );

        migrationBuilder.AddColumn<DateTime>(
            name: "UpdateDate",
            table: "Meters",
            type: "timestamp with time zone",
            nullable: true
        );

        migrationBuilder.AddPrimaryKey(
            name: "PK_SharedMeters",
            table: "SharedMeters",
            column: "Id"
        );
    }
}
