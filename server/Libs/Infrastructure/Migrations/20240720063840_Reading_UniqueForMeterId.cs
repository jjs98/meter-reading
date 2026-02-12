using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Reading_UniqueForMeterId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(name: "IX_Readings_MeterId", table: "Readings");

            migrationBuilder.DropIndex(name: "IX_Readings_ReadingDate", table: "Readings");

            migrationBuilder.CreateIndex(
                name: "IX_Readings_MeterId_ReadingDate",
                table: "Readings",
                columns: new[] { "MeterId", "ReadingDate" },
                unique: true
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(name: "IX_Readings_MeterId_ReadingDate", table: "Readings");

            migrationBuilder.CreateIndex(
                name: "IX_Readings_MeterId",
                table: "Readings",
                column: "MeterId"
            );

            migrationBuilder.CreateIndex(
                name: "IX_Readings_ReadingDate",
                table: "Readings",
                column: "ReadingDate",
                unique: true
            );
        }
    }
}
