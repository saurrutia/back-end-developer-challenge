using System.Text.Json.Serialization;
using HitPointsService.Domain.Converters;
using HitPointsService.Domain.Enums;

namespace HitPointsService.Domain.Entities;

public class CharacterDefense : Entity
{
    public int CharacterId { get; set; }
    [JsonConverter(typeof(DamageTypeJsonConverter))]
    public DamageType Type { get; set; }
    [JsonConverter(typeof(DefenseTypeJsonConverter))]
    public DefenseType Defense { get; set; }
}