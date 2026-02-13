using FluentValidation;
using HitPointsService.API.Endpoints.Requests;

namespace HitPointsService.API.Validators;

public class HealRequestValidator : AbstractValidator<HealRequest>
{
    public HealRequestValidator()
    {
        RuleFor(x => x.CharacterId)
            .NotEmpty()
            .WithMessage("Character ID is required.");

        RuleFor(x => x.Amount)
            .GreaterThan(0)
            .WithMessage("Heal amount must be a positive integer.");
    }
}
