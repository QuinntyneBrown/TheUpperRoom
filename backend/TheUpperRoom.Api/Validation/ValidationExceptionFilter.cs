using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace TheUpperRoom.Api.Validation;

public class ValidationExceptionFilter : IExceptionFilter
{
    public void OnException(ExceptionContext context)
    {
        switch (context.Exception)
        {
            case ValidationException ex:
            {
                var fields = ex.Errors
                    .GroupBy(e => e.PropertyName)
                    .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());
                context.Result = new BadRequestObjectResult(new { error = "validation_failed", fields });
                context.ExceptionHandled = true;
                break;
            }
            case UnauthorizedAccessException:
                context.Result = new ObjectResult(new { error = "forbidden" }) { StatusCode = 403 };
                context.ExceptionHandled = true;
                break;
            case KeyNotFoundException:
                context.Result = new NotFoundObjectResult(new { error = "not_found" });
                context.ExceptionHandled = true;
                break;
        }
    }
}
