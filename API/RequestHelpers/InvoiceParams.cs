

using System.Text.Json.Serialization;

namespace API.RequestHelpers
{

    public class InvoiceParams
    {
        [JsonPropertyName("invoiceType")]
        public string InvoiceType { get; set; } = string.Empty;
        [JsonPropertyName("finalizedDate")]
        public DateTime FinalizedDate { get; set; }

    }
}
