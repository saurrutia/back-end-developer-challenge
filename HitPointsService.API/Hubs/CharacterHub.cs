using Microsoft.AspNetCore.SignalR;

namespace HitPointsService.API.Hubs;

public class CharacterHub : Hub
{
    public async Task SendCharacterUpdate(string characterId)
    {
        await Clients.All.SendAsync("CharacterUpdated", characterId);
    }

    public override async Task OnConnectedAsync()
    {
        await base.OnConnectedAsync();
        Console.WriteLine($"Client connected: {Context.ConnectionId}");
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await base.OnDisconnectedAsync(exception);
        Console.WriteLine($"Client disconnected: {Context.ConnectionId}");
    }
}
