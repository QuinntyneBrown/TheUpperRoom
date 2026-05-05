using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TheUpperRoom.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddPartnerContacts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PartnerContacts",
                columns: table => new
                {
                    PartnerId = table.Column<Guid>(type: "TEXT", nullable: false),
                    ContactId = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PartnerContacts", x => new { x.PartnerId, x.ContactId });
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PartnerContacts");
        }
    }
}
