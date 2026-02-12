using HitPointsService.API.Endpoints.Requests;
using HitPointsService.Application.Services;

namespace HitPointsService.API.Endpoints;

public static class CharacterHandlers
{
    public static RouteGroupBuilder MapCharacterEndpoints(this RouteGroupBuilder group)
    {
        group.MapGet("/", GetAllCharactersAsync);
        group.MapPost("/damage", DealDamageAsync);
        group.MapPost("/heal", HealAsync);
        group.MapPost("/temporary-hit-points", AddTemporaryHitPointsAsync);
        return group;
    }

    private static async Task<IResult> GetAllCharactersAsync(ICharacterService characterService)
    {
        var characters = await characterService.GetAllCharactersAsync();
        return Results.Ok(characters);
    }

    private static async Task<IResult> DealDamageAsync(ICharacterService characterService, DealDamageRequest request)
    {
        var result = await characterService.DealDamageAsync(request.CharacterId, request.DamageType, request.Damage);
        return result ? Results.Ok() : Results.NotFound();
    }

    private static async Task<IResult> HealAsync(ICharacterService characterService, HealRequest request)
    {
        var result = await characterService.HealAsync(request.CharacterId, request.Amount);
        return result ? Results.Ok() : Results.NotFound();
    }

    private static async Task<IResult> AddTemporaryHitPointsAsync(ICharacterService characterService, AddTemporaryHitPointsRequest request)
    {
        var result = await characterService.AddTemporaryHitPointsAsync(request.CharacterId, request.Amount);
        return result ? Results.Ok() : Results.NotFound();
    }
}
