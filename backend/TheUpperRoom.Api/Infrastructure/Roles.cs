namespace TheUpperRoom.Api.Infrastructure;

public static class Roles
{
    public const string Admin = "Admin";
    public const string CityLead = "CityLead";
    public const string PrayerLead = "PrayerLead";
    public const string EventLead = "EventLead";
    public const string CommunicationLead = "CommunicationLead";

    public static readonly IReadOnlyList<string> All = [Admin, CityLead, PrayerLead, EventLead, CommunicationLead];
    public static readonly IReadOnlyList<string> SubordinateRoles = [PrayerLead, EventLead, CommunicationLead];
}
