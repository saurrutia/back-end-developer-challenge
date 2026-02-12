using HitPointsService.Domain.Interfaces;
using HitPointsService.Infrastructure.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace HitPointsService.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<ICharacterRepository, CharacterRepository>();
        return services;
    }
}