using System;

namespace HitPointsService.API.Endpoints.Requests;

public class HealRequest
{
    public string CharacterId { get; set; } = string.Empty;
    public int Amount { get; set; }
}
