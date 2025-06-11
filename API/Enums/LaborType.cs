
using System.Text.Json.Serialization;

namespace API.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum LaborType : byte
{
    NONE, BGT, LABOR, IPA
}
