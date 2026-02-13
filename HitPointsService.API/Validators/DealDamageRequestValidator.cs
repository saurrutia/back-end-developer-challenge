using FluentValidation;
using HitPointsService.API.Endpoints.Requests;

namespace HitPointsService.API.Validators;

public class DealDamageRequestValidator : AbstractValidator<DealDamageRequest>
{
    public DealDamageRequestValidator()
    {
        RuleFor(x => x.CharacterId)
            .NotEmpty()
            .WithMessage("Character ID is required.");

        RuleFor(x => x.Damage)
            .GreaterThan(0)
            .WithMessage("Damage must be a positive integer.");

        RuleFor(x => x.DamageType)
            .IsInEnum()
            .WithMessage("Invalid damage type.");
    }
}
