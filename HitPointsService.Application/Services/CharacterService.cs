using HitPointsService.Application.DTOs;
using HitPointsService.Application.Extensions;
using HitPointsService.Domain.Entities;
using HitPointsService.Domain.Enums;
using HitPointsService.Domain.Interfaces;

namespace HitPointsService.Application.Services;

public class CharacterService(
    ICharacterRepository characterRepository,
    ICharacterNotificationService notificationService) : ICharacterService
{
    private readonly ICharacterRepository _characterRepository = characterRepository;
    private readonly ICharacterNotificationService _notificationService = notificationService;

    public async Task<IEnumerable<CharacterDto>> GetAllCharactersAsync()
    {
        var characters = await _characterRepository.GetAllAsync();
        return characters.Select(c => c.ToDto());
    }

    public async Task<bool> DealDamageAsync(string characterId, DamageType damageType, int damage)
    {
        var character = await _characterRepository.GetTrackedWithDefensesByIdentifierAsync(characterId);
        if (character == null)
        {
            return false;
        }
        character.ApplyDamage(damageType, damage);
        await _characterRepository.UpdateAsync(character);
        
        await _notificationService.NotifyCharacterUpdatedAsync(characterId);
        
        return true;
    }

    public async Task<bool> HealAsync(string characterId, int healAmount)
    {
        var character = await _characterRepository.GetTrackedByIdentifierAsync(characterId);
        if (character == null)
        {
            return false;
        }
        character.Heal(healAmount);
        await _characterRepository.UpdateAsync(character);
        
        await _notificationService.NotifyCharacterUpdatedAsync(characterId);
        
        return true;
    }

    public async Task<bool> AddTemporaryHitPointsAsync(string characterId, int amount)
    {
        var character = await _characterRepository.GetTrackedByIdentifierAsync(characterId);
        if (character == null)
        {
            return false;
        }
        character.AddTemporaryHitPoints(amount);
        await _characterRepository.UpdateAsync(character);
        
        await _notificationService.NotifyCharacterUpdatedAsync(characterId);
        
        return true;
    }

    public async Task<CharacterDto?> GetCharacterByIdentifierAsync(string id)
    {
        var character = await _characterRepository.GetByIdentifierAsync(id);
        return character?.ToDto();
    }
}
