
using HitPointsService.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace HitPointsService.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<ICharacterService, CharacterService>();
        return services;
    }
}
