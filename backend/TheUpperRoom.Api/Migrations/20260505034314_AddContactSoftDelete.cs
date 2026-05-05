using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TheUpperRoom.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddContactSoftDelete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "Contacts",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "Contacts");
        }
    }
}
