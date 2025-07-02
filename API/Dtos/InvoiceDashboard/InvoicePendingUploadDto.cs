
namespace API.Dtos.InvoiceDashboard
{
    public class InvoicePendingUploadDto
    {


        public required string FinalInvoiceNumber { get; set; }
        public DateTime FinalizedDate { get; set; }
        public bool UploadedSuccessfully { get; set; }
        public required string Currency { get; set; }
        public required string InvoiceType { get; set; }
        public required string Customer { get; set; }
        public required double InvoiceTotal { get; set; }



    }
}