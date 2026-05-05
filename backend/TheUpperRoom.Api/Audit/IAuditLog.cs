namespace TheUpperRoom.Api.Audit;

public interface IAuditLog
{
    Task Write(string eventType, Guid? targetId, object data);
}
