using HitPointsService.API.Endpoints.Requests;
using HitPointsService.Application.Services;
using FluentValidation;

namespace HitPointsService.API.Endpoints;

public static class CharacterHandlers
{
    public static RouteGroupBuilder MapCharacterEndpoints(this RouteGroupBuilder group)
    {
        group.MapGet("/", GetAllCharactersAsync);
        group.MapGet("/{id}", GetCharacterByIdentifierAsync);
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

    private static async Task<IResult> GetCharacterByIdentifierAsync(ICharacterService characterService, string id)
    {
        var character = await characterService.GetCharacterByIdentifierAsync(id);
        return character != null ? Results.Ok(character) : Results.NotFound();
    }

    private static async Task<IResult> DealDamageAsync(
        ICharacterService characterService, 
        DealDamageRequest request,
        IValidator<DealDamageRequest> validator)
    {
        await validator.ValidateAndThrowAsync(request);
        var result = await characterService.DealDamageAsync(request.CharacterId, request.DamageType, request.Damage);
        return result ? Results.Ok() : Results.NotFound();
    }

    private static async Task<IResult> HealAsync(
        ICharacterService characterService, 
        HealRequest request,
        IValidator<HealRequest> validator)
    {
        await validator.ValidateAndThrowAsync(request);
        var result = await characterService.HealAsync(request.CharacterId, request.Amount);
        return result ? Results.Ok() : Results.NotFound();
    }

    private static async Task<IResult> AddTemporaryHitPointsAsync(
        ICharacterService characterService, 
        AddTemporaryHitPointsRequest request,
        IValidator<AddTemporaryHitPointsRequest> validator)
    {
        await validator.ValidateAndThrowAsync(request);
        var result = await characterService.AddTemporaryHitPointsAsync(request.CharacterId, request.Amount);
        return result ? Results.Ok() : Results.NotFound();
    }
}
