// Traces to: 77 - Backend CQRS/MediatR enforcement
// L2-062: every controller injects only IMediator; every IRequest<T> has exactly one handler
using System.Reflection;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace TheUpperRoom.Api.Tests.Architecture;

public class CqrsRules
{
    private static readonly Assembly ApiAssembly = typeof(TheUpperRoom.Api.Health.HealthController).Assembly;

    [Fact]
    public void Controllers_InjectOnlyIMediator()
    {
        var controllers = ApiAssembly.GetTypes()
            .Where(t => typeof(ControllerBase).IsAssignableFrom(t) && !t.IsAbstract);

        foreach (var controller in controllers)
        {
            foreach (var ctor in controller.GetConstructors())
            {
                var forbidden = ctor.GetParameters()
                    .Where(p => p.ParameterType != typeof(IMediator))
                    .Select(p => $"{controller.Name}.{p.Name}: {p.ParameterType.Name}");

                Assert.Empty(forbidden);
            }
        }
    }

    [Fact]
    public void EachRequest_HasExactlyOneHandler()
    {
        var requestTypes = ApiAssembly.GetTypes()
            .Where(t => !t.IsAbstract && t.GetInterfaces().Any(i =>
                i.IsGenericType && i.GetGenericTypeDefinition() == typeof(IRequest<>)));

        foreach (var requestType in requestTypes)
        {
            var responseType = requestType.GetInterfaces()
                .First(i => i.IsGenericType && i.GetGenericTypeDefinition() == typeof(IRequest<>))
                .GetGenericArguments()[0];

            var handlerInterface = typeof(IRequestHandler<,>).MakeGenericType(requestType, responseType);
            var handlers = ApiAssembly.GetTypes()
                .Where(t => !t.IsAbstract && handlerInterface.IsAssignableFrom(t))
                .ToList();

            Assert.True(handlers.Count == 1,
                $"{requestType.Name} has {handlers.Count} handler(s) — expected exactly 1.");
        }
    }
}
