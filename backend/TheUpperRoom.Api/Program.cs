using TheUpperRoom.Api.Audit;
using TheUpperRoom.Api.Infrastructure;
using TheUpperRoom.Api.Observability;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblyContaining<Program>());
builder.Services.AddDbContext<AppDbContext>();
builder.Services.AddSingleton<ApiMetrics>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IAuditLog, AuditLog>();
builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:4200").AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

app.UseMiddleware<CorrelationMiddleware>();
app.UseMiddleware<ErrorMiddleware>();
app.UseMiddleware<RequestLoggingMiddleware>();
app.UseCors();
app.UseHttpsRedirection();
app.MapControllers();
app.Run();
