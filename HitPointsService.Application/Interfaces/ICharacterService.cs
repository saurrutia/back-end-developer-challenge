using HitPointsService.Application.DTOs;
using HitPointsService.Domain.Enums;

namespace HitPointsService.Application.Services;

public interface ICharacterService
{
    Task<IEnumerable<CharacterDto>> GetAllCharactersAsync();
    Task<bool> DealDamageAsync(string characterId, DamageType damageType, int damage);
    Task<bool> HealAsync(string characterId, int amount);
    Task<bool> AddTemporaryHitPointsAsync(string characterId, int amount);
}
