using FluentValidation;
using HitPointsService.API.Endpoints.Requests;

namespace HitPointsService.API.Validators;

public class AddTemporaryHitPointsRequestValidator : AbstractValidator<AddTemporaryHitPointsRequest>
{
    public AddTemporaryHitPointsRequestValidator()
    {
        RuleFor(x => x.CharacterId)
            .NotEmpty()
            .WithMessage("Character ID is required.");

        RuleFor(x => x.Amount)
            .GreaterThan(0)
            .WithMessage("Temporary hit points amount must be a positive integer.");
    }
}
