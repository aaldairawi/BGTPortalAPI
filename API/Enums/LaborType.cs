
using System.Text.Json.Serialization;

namespace API.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum LaborType : byte
{
    BGT = 1, IPA = 2, Labor = 3, Flat = 4, NONE = 8
}
