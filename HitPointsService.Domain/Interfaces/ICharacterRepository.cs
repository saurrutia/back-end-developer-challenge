using HitPointsService.Domain.Entities;

namespace HitPointsService.Domain.Interfaces;

public interface ICharacterRepository
{
    Task<IEnumerable<Character>> GetAllAsync();
    Task<Character?> GetByIdentifierAsync(string identifier);
    Task<Character?> GetTrackedByIdentifierAsync(string identifier);
    Task<Character?> GetTrackedWithDefensesByIdentifierAsync(string identifier);

    Task UpdateAsync(Character character);
}
