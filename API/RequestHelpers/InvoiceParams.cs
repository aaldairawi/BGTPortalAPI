

namespace API.RequestHelpers
{

    public class InvoiceParams
    {
        public string OrderBy { get; set; } = string.Empty;
        public string InvoiceType { get; set; } = string.Empty;
        public string FinalizedDate { get; set; } = string.Empty;

    }
}
