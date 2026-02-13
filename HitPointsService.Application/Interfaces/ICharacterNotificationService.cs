namespace HitPointsService.Application.Services;

public interface ICharacterNotificationService
{
    Task NotifyCharacterUpdatedAsync(string characterId);
}
