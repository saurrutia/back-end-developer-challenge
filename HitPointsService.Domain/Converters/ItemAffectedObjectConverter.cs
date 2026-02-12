using System.Text.Json;
using System.Text.Json.Serialization;
using HitPointsService.Domain.Enums;

namespace HitPointsService.Domain.Converters;

public class ItemAffectedObjectJsonConverter: JsonConverter<ItemAffectedObject>
{
    public override ItemAffectedObject Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        string jsonValue = reader.GetString() ?? string.Empty;

        // Manual mapping from JSON string to Enum member
        return jsonValue switch
        {
            "stats" => ItemAffectedObject.Stats,
            _ => throw new NotImplementedException(),
        };
    }

    public override void Write(Utf8JsonWriter writer, ItemAffectedObject value, JsonSerializerOptions options)
    {
        // Manual mapping from Enum member to JSON string
        string jsonValue = value switch
        {
            ItemAffectedObject.Stats => "stats",
            _ => value.ToString()
        };
        writer.WriteStringValue(jsonValue);
    }
}