using System;

namespace HitPointsService.API.Endpoints.Requests;

public class AddTemporaryHitPointsRequest
{
    public string CharacterId { get; set; } = string.Empty;
    public int Amount { get; set; }
}
