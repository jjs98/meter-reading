using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations;

/// <inheritdoc />
public partial class Add_Relations : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropPrimaryKey(name: "PK_Roles", table: "Roles");

        migrationBuilder.AddPrimaryKey(name: "PK_Roles", table: "Roles", column: "Id");

        migrationBuilder.CreateIndex(
            name: "IX_UserRoles_RoleId",
            table: "UserRoles",
            column: "RoleId"
        );

        migrationBuilder.CreateIndex(
            name: "IX_SharedMeters_UserId",
            table: "SharedMeters",
            column: "UserId"
        );

        migrationBuilder.CreateIndex(
            name: "IX_Roles_Name",
            table: "Roles",
            column: "Name",
            unique: true
        );

        migrationBuilder.AddForeignKey(
            name: "FK_SharedMeters_Meters_MeterId",
            table: "SharedMeters",
            column: "MeterId",
            principalTable: "Meters",
            principalColumn: "Id",
            onDelete: ReferentialAction.Cascade
        );

        migrationBuilder.AddForeignKey(
            name: "FK_SharedMeters_Users_UserId",
            table: "SharedMeters",
            column: "UserId",
            principalTable: "Users",
            principalColumn: "Id",
            onDelete: ReferentialAction.Cascade
        );

        migrationBuilder.AddForeignKey(
            name: "FK_UserRoles_Roles_RoleId",
            table: "UserRoles",
            column: "RoleId",
            principalTable: "Roles",
            principalColumn: "Id",
            onDelete: ReferentialAction.Cascade
        );
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropForeignKey(
            name: "FK_SharedMeters_Meters_MeterId",
            table: "SharedMeters"
        );

        migrationBuilder.DropForeignKey(
            name: "FK_SharedMeters_Users_UserId",
            table: "SharedMeters"
        );

        migrationBuilder.DropForeignKey(name: "FK_UserRoles_Roles_RoleId", table: "UserRoles");

        migrationBuilder.DropIndex(name: "IX_UserRoles_RoleId", table: "UserRoles");

        migrationBuilder.DropIndex(name: "IX_SharedMeters_UserId", table: "SharedMeters");

        migrationBuilder.DropPrimaryKey(name: "PK_Roles", table: "Roles");

        migrationBuilder.DropIndex(name: "IX_Roles_Name", table: "Roles");

        migrationBuilder.AddPrimaryKey(name: "PK_Roles", table: "Roles", columns: ["Id", "Name"]);
    }
}
