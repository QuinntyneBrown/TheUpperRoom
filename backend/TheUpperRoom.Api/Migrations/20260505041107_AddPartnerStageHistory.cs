using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TheUpperRoom.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddPartnerStageHistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PartnerStageHistories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    PartnerId = table.Column<Guid>(type: "TEXT", nullable: false),
                    FromStage = table.Column<int>(type: "INTEGER", nullable: false),
                    ToStage = table.Column<int>(type: "INTEGER", nullable: false),
                    ChangedById = table.Column<Guid>(type: "TEXT", nullable: false),
                    ChangedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PartnerStageHistories", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PartnerStageHistories");
        }
    }
}
