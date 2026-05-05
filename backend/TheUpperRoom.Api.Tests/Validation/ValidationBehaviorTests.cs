// Traces to: 67 - Request validation and body-size limits
// L2-051: validation pipeline throws on invalid input; passes through when valid
using FluentValidation;
using FluentValidation.Results;
using MediatR;
using TheUpperRoom.Api.Validation;

namespace TheUpperRoom.Api.Tests.Validation;

public class ValidationBehaviorTests
{
    record TestRequest(string Name) : IRequest<string>;

    class PassingValidator : AbstractValidator<TestRequest>
    {
        public PassingValidator() { RuleFor(r => r.Name).NotEmpty(); }
    }

    class FailingValidator : AbstractValidator<TestRequest>
    {
        public FailingValidator()
        {
            RuleFor(r => r.Name).Must(_ => false).WithMessage("Name is invalid");
        }
    }

    [Fact]
    public async Task Handle_PassesThrough_WhenValidatorPasses()
    {
        var validators = new IValidator<TestRequest>[] { new PassingValidator() };
        var behavior = new ValidationBehavior<TestRequest, string>(validators);
        var result = await behavior.Handle(
            new TestRequest("Valid"),
            () => Task.FromResult("ok"),
            default);
        Assert.Equal("ok", result);
    }

    [Fact]
    public async Task Handle_ThrowsValidationException_WhenValidatorFails()
    {
        var validators = new IValidator<TestRequest>[] { new FailingValidator() };
        var behavior = new ValidationBehavior<TestRequest, string>(validators);

        await Assert.ThrowsAsync<ValidationException>(() =>
            behavior.Handle(
                new TestRequest(""),
                () => Task.FromResult("ok"),
                default));
    }

    [Fact]
    public async Task Handle_PassesThrough_WhenNoValidatorsRegistered()
    {
        var behavior = new ValidationBehavior<TestRequest, string>([]);
        var result = await behavior.Handle(
            new TestRequest("x"),
            () => Task.FromResult("ok"),
            default);
        Assert.Equal("ok", result);
    }
}
