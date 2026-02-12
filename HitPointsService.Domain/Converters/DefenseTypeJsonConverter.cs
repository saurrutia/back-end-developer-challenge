using System.Text.Json;
using System.Text.Json.Serialization;
using HitPointsService.Domain.Enums;

namespace HitPointsService.Domain.Converters;

public class DefenseTypeJsonConverter: JsonConverter<DefenseType>
{
    public override DefenseType Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        string jsonValue = reader.GetString() ?? string.Empty;

        // Manual mapping from JSON string to Enum member
        return jsonValue switch
        {
            "immunity" => DefenseType.Immunity,
            "resistance" => DefenseType.Resistance,
            _ => throw new NotImplementedException(),
        };
    }

    public override void Write(Utf8JsonWriter writer, DefenseType value, JsonSerializerOptions options)
    {
        // Manual mapping from Enum member to JSON string
        string jsonValue = value switch
        {
            DefenseType.Immunity => "immunity",
            DefenseType.Resistance => "resistance",
            _ => value.ToString()
        };
        writer.WriteStringValue(jsonValue);
    }
}