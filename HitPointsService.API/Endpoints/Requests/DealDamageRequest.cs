using HitPointsService.Domain.Enums;

namespace HitPointsService.API.Endpoints.Requests;
public class DealDamageRequest
{
    public string CharacterId { get; set; } = string.Empty;
    public int Damage { get; set; }
    public DamageType DamageType { get; set; }
}