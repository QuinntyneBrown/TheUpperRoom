using System.Diagnostics.Metrics;

namespace TheUpperRoom.Api.Observability;

public sealed class ApiMetrics : IDisposable
{
    public const string MeterName = "TheUpperRoom.Api";

    private readonly Meter _meter = new(MeterName);

    public Counter<long> ErrorCount { get; }

    public ApiMetrics()
    {
        ErrorCount = _meter.CreateCounter<long>(
            "api_errors_total",
            description: "Total unhandled exceptions");
    }

    public void Dispose() => _meter.Dispose();
}
