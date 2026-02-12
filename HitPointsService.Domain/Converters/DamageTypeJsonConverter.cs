using System.Text.Json;
using System.Text.Json.Serialization;
using HitPointsService.Domain.Enums;

namespace HitPointsService.Domain.Converters;

public class DamageTypeJsonConverter: JsonConverter<DamageType>
{
    public override DamageType Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        string jsonValue = reader.GetString() ?? string.Empty;

        // Manual mapping from JSON string to Enum member
        return jsonValue switch
        {
            "bludgeoning" => DamageType.Bludgeoning,
            "piercing" => DamageType.Piercing,
            "slashing" => DamageType.Slashing,
            "fire" => DamageType.Fire,
            "cold" => DamageType.Cold,
            "lightning" => DamageType.Lightning,
            "acid" => DamageType.Acid,
            "poison" => DamageType.Poison,
            "psychic" => DamageType.Psychic,
            "necrotic" => DamageType.Necrotic,
            "radiant" => DamageType.Radiant,
            "force" => DamageType.Force,
            _ => throw new NotImplementedException(),
        };
    }

    public override void Write(Utf8JsonWriter writer, DamageType value, JsonSerializerOptions options)
    {
        // Manual mapping from Enum member to JSON string
        string jsonValue = value switch
        {
            DamageType.Bludgeoning => "bludgeoning",
            DamageType.Piercing => "piercing",
            DamageType.Slashing => "slashing",
            DamageType.Fire => "fire",
            DamageType.Cold => "cold",
            DamageType.Lightning => "lightning",
            DamageType.Acid => "acid",
            DamageType.Poison => "poison",
            DamageType.Psychic => "psychic",
            DamageType.Necrotic => "necrotic",
            DamageType.Radiant => "radiant",
            DamageType.Force => "force",
            _ => value.ToString()
        };
        writer.WriteStringValue(jsonValue);
    }
}