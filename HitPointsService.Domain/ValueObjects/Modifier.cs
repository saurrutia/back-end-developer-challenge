using System.Text.Json.Serialization;
using HitPointsService.Domain.Converters;
using HitPointsService.Domain.Enums;

namespace HitPointsService.Domain.ValueObjects;
public class Modifier
{
    [JsonConverter(typeof(ItemAffectedObjectJsonConverter))]
    public ItemAffectedObject AffectedObject { get; set; }
    public string AffectedValue { get; set; } = string.Empty;
    public int Value { get; set; }
}