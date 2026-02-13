using HitPointsService.Application.Services;
using HitPointsService.API.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace HitPointsService.API.Services;

public class SignalRCharacterNotificationService : ICharacterNotificationService
{
    private readonly IHubContext<CharacterHub> _hubContext;

    public SignalRCharacterNotificationService(IHubContext<CharacterHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task NotifyCharacterUpdatedAsync(string characterId)
    {
        await _hubContext.Clients.All.SendAsync("CharacterUpdated", characterId);
    }
}
